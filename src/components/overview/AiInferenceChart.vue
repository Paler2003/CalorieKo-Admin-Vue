<template>
  <div class="ck-card">
    <div class="chart-header">
      <h3 class="chart-title">AI Inference Accuracy (CNN Performance)</h3>
      <p class="chart-subtitle">Top 5 most accurately identified dishes from custom dataset</p>
    </div>

    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <div class="chart-legend">
      <div class="chart-legend__item">
        <span class="chart-legend__dot" style="background: #10b981;"></span>
        <span>≥75% Target Met</span>
      </div>
      <div class="chart-legend__item">
        <span class="chart-legend__dot" style="background: #f59e0b;"></span>
        <span>&lt;75% Needs Improvement</span>
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

const dishes = [
  { dish: 'Law-uy', accuracy: 89 },
  { dish: 'Balbacua', accuracy: 85 },
  { dish: 'Kinilaw', accuracy: 82 },
  { dish: 'Sinuglaw', accuracy: 78 },
  { dish: 'Lechon', accuracy: 76 }
]

const chartData = {
  labels: dishes.map(d => d.dish),
  datasets: [{
    label: 'Accuracy (%)',
    data: dishes.map(d => d.accuracy),
    backgroundColor: dishes.map(d => d.accuracy >= 75 ? '#10b981' : '#f59e0b'),
    borderRadius: 4,
    barThickness: 30
  }]
}

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#d1d5db',
      borderWidth: 1,
      callbacks: {
        label: (ctx) => `${ctx.raw}% Accuracy`
      }
    }
  },
  scales: {
    x: {
      max: 100,
      grid: { color: '#e5e7eb' },
      ticks: { color: '#6b7280', font: { size: 12 } },
      title: { display: true, text: 'Accuracy (%)', color: '#6b7280' }
    },
    y: {
      grid: { display: false },
      ticks: { color: '#1f2937', font: { size: 13 } }
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

.chart-legend {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.chart-legend__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--ck-gray-600);
}

.chart-legend__dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 2px;
}
</style>
