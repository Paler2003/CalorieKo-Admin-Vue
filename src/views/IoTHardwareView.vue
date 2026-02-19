<template>
  <div class="iot-hardware">
    <!-- Architecture Header -->
    <div class="ck-card ck-card--elevated">
      <h2 class="page-title">IoT Hardware Architecture</h2>
      <p class="page-subtitle">ESP32 Microcontroller with HX711 ADC via BLE 5.0 Protocol</p>

      <div class="grid-4 hw-stats">
        <div class="hw-stat">
          <WifiIcon :size="20" class="hw-stat__icon" />
          <div class="hw-stat__label">Avg Signal</div>
          <div class="hw-stat__value">-42 dBm</div>
          <div class="hw-stat__status status-good">Excellent</div>
        </div>
        <div class="hw-stat">
          <BatteryIcon :size="20" class="hw-stat__icon" />
          <div class="hw-stat__label">Avg Battery</div>
          <div class="hw-stat__value">78%</div>
          <div class="hw-stat__status status-good">Good</div>
        </div>
        <div class="hw-stat">
          <ActivityIcon :size="20" class="hw-stat__icon" />
          <div class="hw-stat__label">Avg Jitter</div>
          <div class="hw-stat__value">1.2 ms</div>
          <div class="hw-stat__status status-good">Optimal</div>
        </div>
        <div class="hw-stat">
          <GaugeIcon :size="20" class="hw-stat__icon" />
          <div class="hw-stat__label">Calibration Drift</div>
          <div class="hw-stat__value">±0.3g</div>
          <div class="hw-stat__status status-warn">Acceptable</div>
        </div>
      </div>
    </div>

    <!-- Device Registry -->
    <div class="ck-card ck-card--elevated">
      <div class="registry-header">
        <div>
          <h3 class="section-title">Device Registry</h3>
          <p class="section-subtitle">Active IoT scale connections with live status</p>
        </div>
        <div class="live-badge">
          <span class="ck-dot ck-dot--green animate-pulse"></span>
          <span>Live Status</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="ck-table">
          <thead>
            <tr>
              <th>Scale ID</th>
              <th>MAC Address</th>
              <th style="text-align:right">Signal (dBm)</th>
              <th style="text-align:right">Battery</th>
              <th style="text-align:right">Jitter (ms)</th>
              <th>Calibration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in devices" :key="device.id">
              <td class="font-mono" style="font-weight: 500; color: var(--ck-gray-900);">{{ device.id }}</td>
              <td class="font-mono">{{ device.mac }}</td>
              <td style="text-align:right">
                <span :class="signalClass(device.signal)">{{ device.signal }}</span>
              </td>
              <td style="text-align:right">
                <div class="battery-cell">
                  <div class="ck-progress" style="width: 60px;">
                    <div
                      class="ck-progress__bar"
                      :style="{ width: device.battery + '%', background: batteryColor(device.battery) }"
                    ></div>
                  </div>
                  <span>{{ device.battery }}%</span>
                </div>
              </td>
              <td style="text-align:right">{{ device.jitter.toFixed(1) }}</td>
              <td>
                <span
                  class="ck-badge"
                  :class="device.calibrated ? 'ck-badge--success' : 'ck-badge--warning'"
                >
                  {{ device.calibrated ? 'Calibrated' : 'Due' }}
                </span>
              </td>
              <td>
                <span
                  class="ck-badge"
                  :class="device.online ? 'ck-badge--success' : 'ck-badge--error'"
                >
                  {{ device.online ? 'Online' : 'Offline' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Data Capture Chart -->
    <div class="ck-card ck-card--elevated">
      <h3 class="section-title">Data Capture Success Rate (Last 7 Days)</h3>
      <div class="chart-container">
        <Bar :data="captureChartData" :options="captureChartOptions" />
      </div>
    </div>

    <!-- Diagnostic Tools -->
    <div class="ck-card ck-card--elevated">
      <h3 class="section-title">Remote Diagnostics</h3>
      <p class="section-subtitle" style="margin-bottom: 1rem;">
        Execute system commands on connected devices
      </p>

      <div class="grid-3">
        <button class="ck-btn ck-btn--primary">
          <RefreshCwIcon :size="20" />
          <span>Force Recalibration</span>
        </button>
        <button class="ck-btn ck-btn--dark">
          <WifiIcon :size="20" />
          <span>Ping All Devices</span>
        </button>
        <button class="ck-btn" style="background: var(--ck-gray-600); color: white;">
          <DownloadIcon :size="20" />
          <span>Download Firmware</span>
        </button>
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
  Tooltip
} from 'chart.js'
import {
  Wifi as WifiIcon,
  Battery as BatteryIcon,
  Activity as ActivityIcon,
  Gauge as GaugeIcon,
  RefreshCw as RefreshCwIcon,
  Download as DownloadIcon
} from 'lucide-vue-next'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

const devices = [
  { id: 'SC-001', mac: 'AA:BB:CC:11:22:33', signal: -38, battery: 92, jitter: 0.8, calibrated: true, online: true },
  { id: 'SC-012', mac: 'AA:BB:CC:11:22:44', signal: -45, battery: 85, jitter: 1.1, calibrated: true, online: true },
  { id: 'SC-022', mac: 'AA:BB:CC:11:22:55', signal: -52, battery: 67, jitter: 1.6, calibrated: false, online: true },
  { id: 'SC-035', mac: 'AA:BB:CC:11:22:66', signal: -41, battery: 78, jitter: 0.9, calibrated: true, online: true },
  { id: 'SC-047', mac: 'AA:BB:CC:11:22:77', signal: -48, battery: 23, jitter: 2.1, calibrated: false, online: false },
  { id: 'SC-053', mac: 'AA:BB:CC:11:22:88', signal: -39, battery: 91, jitter: 0.7, calibrated: true, online: true },
  { id: 'SC-068', mac: 'AA:BB:CC:11:22:99', signal: -44, battery: 72, jitter: 1.3, calibrated: true, online: true },
  { id: 'SC-074', mac: 'AA:BB:CC:11:23:AA', signal: -36, battery: 96, jitter: 0.5, calibrated: true, online: true }
]

const signalClass = (signal) =>
  signal >= -40 ? 'signal-excellent' : signal >= -50 ? 'signal-good' : 'signal-fair'

const batteryColor = (b) =>
  b > 60 ? '#10b981' : b > 30 ? '#f59e0b' : '#ef4444'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const captureRates = [94.2, 96.1, 93.8, 97.3, 95.6, 92.4, 96.8]

const captureChartData = {
  labels: days,
  datasets: [{
    label: 'Success Rate (%)',
    data: captureRates,
    backgroundColor: captureRates.map(r => r >= 95 ? '#10b981' : '#f59e0b'),
    borderRadius: 6,
    barThickness: 40
  }]
}

const captureChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#374151' } },
    y: { min: 85, max: 100, grid: { color: '#e5e7eb' }, ticks: { color: '#6b7280' } }
  }
}
</script>

<style scoped>
.iot-hardware { display: flex; flex-direction: column; gap: 1.5rem; }

.page-title { font-size: 1.5rem; font-weight: 600; color: var(--ck-gray-900); }
.page-subtitle { font-size: 0.875rem; color: var(--ck-gray-600); margin-bottom: 1.5rem; }
.section-title { font-size: 1.125rem; font-weight: 600; color: var(--ck-gray-900); }
.section-subtitle { font-size: 0.875rem; color: var(--ck-gray-600); }

.hw-stat {
  background: var(--ck-gray-50); border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg); padding: 1rem; text-align: center;
}
.hw-stat__icon { margin: 0 auto 0.5rem; color: var(--ck-gray-600); }
.hw-stat__label { font-size: 0.75rem; color: var(--ck-gray-500); margin-bottom: 0.25rem; }
.hw-stat__value { font-size: 1.25rem; font-weight: 600; color: var(--ck-gray-900); margin-bottom: 0.25rem; }
.hw-stat__status { font-size: 0.75rem; font-weight: 500; }
.status-good { color: #10b981; }
.status-warn { color: #f59e0b; }

.registry-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }

.live-badge {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.75rem; color: var(--ck-gray-600);
}

.table-wrapper {
  background: var(--ck-gray-50); border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg); overflow: hidden;
}

.battery-cell { display: flex; align-items: center; gap: 0.5rem; justify-content: flex-end; }

.signal-excellent { color: #10b981; font-weight: 500; }
.signal-good { color: #f59e0b; font-weight: 500; }
.signal-fair { color: #ef4444; font-weight: 500; }

.chart-container { height: 250px; }
</style>
