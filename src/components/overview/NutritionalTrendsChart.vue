<template>
  <div class="ck-card">
    <div class="chart-header">
      <h3 class="chart-title">Nutritional Quantification Trends (Aggregated Data)</h3>
      <p class="chart-subtitle">Mass-quantified data via PhilFCT integration</p>
    </div>

    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <div class="grid-2 stats-footer">
      <div class="stat-box">
        <p class="stat-box__label">Total Logged (7 days)</p>
        <p class="stat-box__value" style="color: #10b981;">156,420</p>
        <p class="stat-box__unit">kcal</p>
      </div>
      <div class="stat-box">
        <p class="stat-box__label">Total Burned (7 days)</p>
        <p class="stat-box__value" style="color: #f59e0b;">148,350</p>
        <p class="stat-box__unit">kcal (TDEE calculated)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const chartData = {
  labels: ['Weekly Aggregate'],
  datasets: [
    {
      label: 'Total Calories Logged',
      data: [156420],
      backgroundColor: '#10b981',
      borderRadius: 8,
      barThickness: 80
    },
    {
      label: 'Total Calories Burned (TDEE)',
      data: [148350],
      backgroundColor: '#f59e0b',
      borderRadius: 8,
      barThickness: 80
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#374151',
        font: { size: 13 },
        usePointStyle: true,
        pointStyle: 'rect',
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#d1d5db',
      borderWidth: 1,
      callbacks: {
        label: (ctx) => `${ctx.raw.toLocaleString()} kcal`
      }
    }
  },
  scales: {
    x: {
      grid: { color: '#e5e7eb' },
      ticks: { color: '#1f2937', font: { size: 13 } }
    },
    y: {
      grid: { color: '#e5e7eb' },
      ticks: { color: '#6b7280', font: { size: 12 } },
      title: { display: true, text: 'Calories (kcal)', color: '#6b7280' }
    }
  }
}
</script>

<style scoped>
.chart-header {
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ck-gray-800);
  margin-bottom: 0.25rem;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: var(--ck-gray-600);
}

.chart-container {
  height: 300px;
}

.stats-footer {
  margin-top: 1.5rem;
}

.stat-box {
  background: var(--ck-gray-50);
  border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg);
  padding: 1rem;
}

.stat-box__label {
  font-size: 0.75rem;
  color: var(--ck-gray-600);
  margin-bottom: 0.25rem;
}

.stat-box__value {
  font-size: 1.5rem;
  font-weight: 600;
}

.stat-box__unit {
  font-size: 0.75rem;
  color: var(--ck-gray-500);
  margin-top: 0.25rem;
}
</style>
