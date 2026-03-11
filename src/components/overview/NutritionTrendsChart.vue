<template>
  <div class="ck-card">
    <div class="chart-header">
      <h3 class="chart-title">Nutritional Quantification Trends</h3>
      <p class="chart-subtitle">System-Wide Calories Logged vs TDEE Target (Last 7 Days)</p>
    </div>

    <div v-if="loading" style="text-align: center; padding: 2rem; color: var(--ck-gray-500);">
      Aggregating system nutrition trends...
    </div>

    <div v-else-if="chartData.labels.length === 0" style="text-align: center; padding: 2rem; color: var(--ck-gray-500);">
      Insufficient data to generate trends.
    </div>

    <div v-else class="chart-container" style="height: 300px; position: relative;">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <div v-if="!loading && chartData.labels.length > 0" class="stats-footer grid-2" style="margin-top: 1.5rem; display: flex; gap: 1rem;">
      <div class="stat-box" style="flex: 1;">
        <p class="stat-box__label">Weekly Avg TDEE</p>
        <p class="stat-box__value" style="color: #6366f1;">{{ systemTDEE.toLocaleString() }}</p>
        <p class="stat-box__unit">kcal / day</p>
      </div>
      <div class="stat-box" style="flex: 1;">
        <p class="stat-box__label">Weekly Avg Intake</p>
        <p class="stat-box__value" style="color: #10b981;">{{ Math.round(avgIntake).toLocaleString() }}</p>
        <p class="stat-box__unit">kcal / day</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { getProfiles, getNutritionSummaries } from '../../services/api.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const loading = ref(true)
const chartData = ref({ labels: [], datasets: [] })
const systemTDEE = ref(0)
const avgIntake = ref(0)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (context) => ` ${context.dataset.label}: ${context.raw} kcal`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: true, color: 'rgba(0,0,0,0.05)' }
    },
    x: {
      grid: { display: false }
    }
  }
}

const calculateTDEE = (p) => {
  if (!p.weight || !p.height || !p.age || !p.sex) return 0
  
  // Mifflin-St Jeor Equation
  let bmr = (10 * p.weight) + (6.25 * p.height) - (5 * p.age)
  bmr = p.sex === 'Male' ? bmr + 5 : bmr - 161
  
  // Activity Multiplier
  let multiplier = 1.2 // Default for mostly inactive
  switch(p.activityLevel) {
    case 'lightly_active': multiplier = 1.375; break;
    case 'active': multiplier = 1.55; break;
    case 'very_active': multiplier = 1.725; break;
  }
  
  return Math.round(bmr * multiplier)
}

onMounted(async () => {
  try {
    const [profiles, summaries] = await Promise.all([
      getProfiles(),
      getNutritionSummaries()
    ])

    // Calculate sum of TDEE for all active participants
    let totalSystemTDEE = 0
    profiles.forEach(p => {
        // Assume all returned profiles contribute to TDEE or only active ones
        if (p.is_active !== false) {
            totalSystemTDEE += calculateTDEE(p)
        }
    })
    // If no profiles have enough data, provide a fallback or 0
    systemTDEE.value = totalSystemTDEE

    // Generate last 7 days arrays
    const labels = []
    const loggedData = []
    const tdeeData = []

    const today = new Date()
    let sumWeeklyIntake = 0

    // Loop from 6 days ago -> today
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateString = d.toISOString().substring(0, 10) // YYYY-MM-DD
      
      labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }))
      
      // Calculate total calories logged on this date
      const daysSummaries = summaries.filter(s => {
          if (!s.date) return false;
          return s.date.substring(0, 10) === dateString
      })
      
      const dayTotalCalories = daysSummaries.reduce((sum, s) => sum + (Number(s.total_calories) || 0), 0)
      
      loggedData.push(dayTotalCalories)
      tdeeData.push(totalSystemTDEE)
      
      sumWeeklyIntake += dayTotalCalories
    }

    avgIntake.value = sumWeeklyIntake / 7

    chartData.value = {
      labels,
      datasets: [
        {
          label: 'Total Calories Logged',
          data: loggedData,
          backgroundColor: '#10b981', // green
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8
        },
        {
          label: 'Total Calories Burned (TDEE)',
          data: tdeeData,
          backgroundColor: '#6366f1', // indigo
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8
        }
      ]
    }

  } catch (err) {
    console.error('Failed to aggregate nutrition trends:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.ck-card {
  background: white;
  border-radius: var(--ck-radius-xl);
  padding: 1.5rem;
  box-shadow: var(--ck-shadow-sm);
  border: 1px solid rgba(209, 213, 219, 0.5);
  display: flex;
  flex-direction: column;
}
.chart-header { margin-bottom: 1.5rem; }
.chart-title { font-size: 1.125rem; font-weight: 600; color: var(--ck-gray-800); margin-bottom: 0.25rem; }
.chart-subtitle { font-size: 0.875rem; color: var(--ck-gray-600); }
.stat-box { background: var(--ck-gray-50); border: 1px solid var(--ck-gray-200); border-radius: var(--ck-radius-lg); padding: 1rem; }
.stat-box__label { font-size: 0.75rem; color: var(--ck-gray-600); margin-bottom: 0.25rem; }
.stat-box__value { font-size: 1.5rem; font-weight: 600; }
.stat-box__unit { font-size: 0.75rem; color: var(--ck-gray-500); margin-top: 0.25rem; }
</style>
