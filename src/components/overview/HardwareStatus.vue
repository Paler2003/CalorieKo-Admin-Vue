<template>
  <div class="hardware-grid">
    <!-- BLE Chart -->
    <div class="ck-card hardware-chart">
      <div class="chart-head">
        <div>
          <h3 class="chart-title">Hardware & Connectivity Status</h3>
          <p class="chart-subtitle">BLE Data Transmission Success Rate (Last 24 Hours)</p>
        </div>
        <div class="live-badge">
          <ActivityIcon :size="16" />
          <span>Live</span>
        </div>
      </div>

      <div class="chart-container">
        <Line :data="chartData" :options="chartOptions" />
      </div>

      <div class="grid-3 stats-row">
        <div class="stat-mini">
          <p class="stat-mini__label">Current Rate</p>
          <p class="stat-mini__value" style="color: #10b981;">94.7%</p>
        </div>
        <div class="stat-mini">
          <p class="stat-mini__label">Avg (24h)</p>
          <p class="stat-mini__value">92.3%</p>
        </div>
        <div class="stat-mini">
          <p class="stat-mini__label">Active Scales</p>
          <p class="stat-mini__value">18</p>
        </div>
      </div>
    </div>

    <!-- Calibration Alerts -->
    <div class="ck-card hardware-alerts">
      <div class="alerts-header">
        <AlertTriangleIcon :size="20" style="color: #f59e0b;" />
        <h3 class="chart-title">Calibration Required</h3>
      </div>

      <div class="alerts-list">
        <div
          v-for="alert in calibrationAlerts"
          :key="alert.id"
          class="alert-item"
        >
          <div class="alert-item__head">
            <p class="alert-item__id">{{ alert.id }}</p>
            <span class="alert-item__badge">Alert</span>
          </div>
          <p class="alert-item__location">{{ alert.location }}</p>
          <p class="alert-item__date">Last calibrated: {{ alert.lastCalibrated }}</p>
        </div>
      </div>

      <button class="calibration-btn">Schedule Calibration</button>
    </div>
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js'
import { Activity as ActivityIcon, AlertTriangle as AlertTriangleIcon } from 'lucide-vue-next'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

// Generate BLE data
const bleData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  rate: Math.round((85 + Math.random() * 12) * 10) / 10
}))

const chartData = {
  labels: bleData.map(d => d.time),
  datasets: [{
    label: 'Success Rate',
    data: bleData.map(d => d.rate),
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    fill: true,
    tension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 6,
    pointHoverBackgroundColor: '#10b981',
    borderWidth: 2
  }]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#6b7280',
        font: { size: 11 },
        maxTicksLimit: 8
      }
    },
    y: {
      min: 80,
      max: 100,
      grid: { color: '#e5e7eb' },
      ticks: { color: '#6b7280', font: { size: 12 } },
      title: { display: true, text: 'Success Rate (%)', color: '#6b7280' }
    }
  }
}

const calibrationAlerts = [
  { id: 'SC-047', location: 'Lab Station 3', lastCalibrated: '6 days ago' },
  { id: 'SC-022', location: 'Field Unit A', lastCalibrated: '8 days ago' }
]
</script>

<style scoped>
.hardware-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .hardware-grid {
    grid-template-columns: 1fr;
  }
}

.chart-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.live-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: var(--ck-primary-light);
  padding: 0.375rem 0.75rem;
  border-radius: var(--ck-radius-lg);
  color: var(--ck-primary);
  font-size: 0.75rem;
  font-weight: 500;
}

.chart-container {
  height: 250px;
}

.stats-row {
  margin-top: 1rem;
}

.stat-mini {
  background: var(--ck-gray-50);
  border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg);
  padding: 0.75rem;
}

.stat-mini__label {
  font-size: 0.75rem;
  color: var(--ck-gray-600);
}

.stat-mini__value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ck-gray-800);
}

.alerts-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  background: #fef3c7;
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--ck-radius-lg);
  padding: 1rem;
}

.alert-item__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.alert-item__id {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ck-gray-800);
}

.alert-item__badge {
  font-size: 0.75rem;
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.alert-item__location {
  font-size: 0.75rem;
  color: var(--ck-gray-700);
  margin-bottom: 0.25rem;
}

.alert-item__date {
  font-size: 0.75rem;
  color: var(--ck-gray-600);
}

.calibration-btn {
  margin-top: 1rem;
  width: 100%;
  padding: 0.5rem;
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #f59e0b;
  border-radius: var(--ck-radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--ck-transition-fast);
}

.calibration-btn:hover {
  background: rgba(245, 158, 11, 0.3);
}
</style>
