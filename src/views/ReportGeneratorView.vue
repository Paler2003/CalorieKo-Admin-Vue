<template>
  <div class="report-gen">
    <div class="report-layout">
      <!-- Left: Configuration Panel -->
      <div class="ck-card ck-card--elevated config-panel">
        <h2 class="page-title">Report Generator</h2>
        <p class="page-subtitle" style="margin-bottom: 1.5rem;">
          Generate & Export Research Reports
        </p>

        <!-- Report Type -->
        <div class="form-section">
          <label class="form-label">Report Type</label>
          <div class="report-types">
            <button
              v-for="type in reportTypes"
              :key="type.id"
              class="report-type-btn"
              :class="{ 'report-type-btn--active': selectedType === type.id }"
              @click="selectedType = type.id"
            >
              <component :is="type.icon" :size="20" />
              <span>{{ type.label }}</span>
            </button>
          </div>
        </div>

        <!-- Date Range -->
        <div class="form-section">
          <label class="form-label">Date Range</label>
          <div class="date-inputs">
            <input type="date" v-model="dateFrom" class="ck-input" />
            <span class="date-sep">to</span>
            <input type="date" v-model="dateTo" class="ck-input" />
          </div>
        </div>

        <!-- Dish Selection -->
        <div class="form-section">
          <label class="form-label">Dish Selection</label>
          <select v-model="selectedDish" class="ck-select">
            <option value="all">All Dishes</option>
            <option v-for="dish in dishOptions" :key="dish" :value="dish">{{ dish }}</option>
          </select>
        </div>

        <!-- User Group -->
        <div class="form-section">
          <label class="form-label">User Group</label>
          <select v-model="selectedGroup" class="ck-select">
            <option value="all">All Participants</option>
            <option value="active">Active Only</option>
            <option value="high-consistency">High Consistency (>80%)</option>
          </select>
        </div>

        <!-- Export Buttons -->
        <div class="export-actions">
          <button class="ck-btn ck-btn--primary" style="flex: 1;">
            <FileTextIcon :size="20" />
            <span>Export as PDF</span>
          </button>
          <button class="ck-btn ck-btn--dark" style="flex: 1;">
            <TableIcon :size="20" />
            <span>Export as CSV</span>
          </button>
        </div>
      </div>

      <!-- Right: Live Preview -->
      <div class="ck-card ck-card--elevated preview-panel">
        <div class="preview-header">
          <h3 class="section-title">Live Preview</h3>
          <span class="ck-badge ck-badge--outline">{{ currentReport.label }}</span>
        </div>

        <!-- Preview Content -->
        <div class="preview-content custom-scrollbar">
          <div class="preview-meta">
            <div class="preview-meta__row">
              <span>Report Type:</span>
              <strong>{{ currentReport.label }}</strong>
            </div>
            <div class="preview-meta__row">
              <span>Date Range:</span>
              <strong>{{ dateFrom || 'Not set' }} — {{ dateTo || 'Not set' }}</strong>
            </div>
            <div class="preview-meta__row">
              <span>Dishes:</span>
              <strong>{{ selectedDish === 'all' ? 'All Dishes' : selectedDish }}</strong>
            </div>
            <div class="preview-meta__row">
              <span>User Group:</span>
              <strong>{{ groupLabel }}</strong>
            </div>
          </div>

          <div class="preview-divider"></div>

          <!-- Sample Report Data -->
          <h4 class="preview-section-title">Sample Data Preview</h4>
          <div class="table-wrapper">
            <table class="ck-table">
              <thead>
                <tr>
                  <th v-for="col in currentReport.columns" :key="col">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in currentReport.sampleData" :key="i">
                  <td v-for="(val, j) in row" :key="j">{{ val }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="preview-note">
            <InfoIcon :size="16" style="color: var(--ck-blue); flex-shrink: 0;" />
            <span>Showing sample data. Full report will contain {{ currentReport.totalRows }} records.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, markRaw } from 'vue'
import {
  Target,
  Utensils,
  Activity,
  Cpu,
  FileText as FileTextIcon,
  Table as TableIcon,
  Info as InfoIcon
} from 'lucide-vue-next'

const selectedType = ref('ai')
const dateFrom = ref('2025-01-01')
const dateTo = ref('2025-02-19')
const selectedDish = ref('all')
const selectedGroup = ref('all')

const reportTypes = [
  { id: 'ai', label: 'AI Accuracy', icon: markRaw(Target) },
  { id: 'nutrition', label: 'Nutritional Summary', icon: markRaw(Utensils) },
  { id: 'tdee', label: 'TDEE Correlation', icon: markRaw(Activity) },
  { id: 'hardware', label: 'Hardware Reliability', icon: markRaw(Cpu) }
]

const dishOptions = ['Law-uy', 'Balbacua', 'Humba', 'Pork Adobo', 'Chicken Adobo', 'Sinigang na Baboy', 'Tinola', 'Kare-Kare', 'Pancit Canton', 'Lumpia Shanghai']

const groupLabel = computed(() => {
  const map = { all: 'All Participants', active: 'Active Only', 'high-consistency': 'High Consistency (>80%)' }
  return map[selectedGroup.value]
})

const reportData = {
  ai: {
    label: 'AI Accuracy Report',
    columns: ['Dish', 'Samples', 'Accuracy (%)', 'Confused With'],
    sampleData: [
      ['Law-uy', '142', '81.2%', 'Bulalo'],
      ['Balbacua', '128', '76.8%', 'Kaldereta'],
      ['Humba', '156', '72.4%', 'Pork Adobo'],
      ['Pork Adobo', '203', '84.6%', 'Humba'],
      ['Chicken Adobo', '198', '87.3%', 'Tinola']
    ],
    totalRows: 42
  },
  nutrition: {
    label: 'Nutritional Summary Report',
    columns: ['Date', 'Avg. Logged (kcal)', 'Avg. Burned (kcal)', 'Deficit/Surplus'],
    sampleData: [
      ['Feb 13', '2,150', '2,080', '+70 kcal'],
      ['Feb 14', '1,980', '2,040', '-60 kcal'],
      ['Feb 15', '2,310', '2,150', '+160 kcal'],
      ['Feb 16', '2,050', '2,020', '+30 kcal'],
      ['Feb 17', '2,240', '2,200', '+40 kcal']
    ],
    totalRows: 127
  },
  tdee: {
    label: 'TDEE Correlation Report',
    columns: ['Participant', 'Predicted TDEE', 'Actual Intake', 'Correlation'],
    sampleData: [
      ['P-0001', '1,850', '1,920', '96.3%'],
      ['P-0002', '2,200', '2,150', '97.7%'],
      ['P-0003', '1,750', '1,680', '96.0%'],
      ['P-0006', '2,100', '2,050', '97.6%'],
      ['P-0007', '1,800', '1,870', '96.1%']
    ],
    totalRows: 89
  },
  hardware: {
    label: 'Hardware Reliability Report',
    columns: ['Scale ID', 'Uptime', 'Avg Signal', 'Data Capture Rate'],
    sampleData: [
      ['SC-001', '99.8%', '-38 dBm', '97.2%'],
      ['SC-012', '98.5%', '-45 dBm', '95.1%'],
      ['SC-053', '99.9%', '-39 dBm', '98.4%'],
      ['SC-068', '97.2%', '-44 dBm', '94.8%'],
      ['SC-074', '99.7%', '-36 dBm', '98.9%']
    ],
    totalRows: 18
  }
}

const currentReport = computed(() => reportData[selectedType.value])
</script>

<style scoped>
.report-gen { display: flex; flex-direction: column; gap: 1.5rem; }

.report-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
@media (max-width: 1024px) { .report-layout { grid-template-columns: 1fr; } }

.page-title { font-size: 1.5rem; font-weight: 600; color: var(--ck-gray-900); }
.page-subtitle { font-size: 0.875rem; color: var(--ck-gray-600); }
.section-title { font-size: 1.125rem; font-weight: 600; color: var(--ck-gray-900); }

.form-section { margin-bottom: 1.5rem; }
.form-label { font-size: 0.875rem; font-weight: 500; color: var(--ck-gray-700); display: block; margin-bottom: 0.5rem; }

.report-types { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
.report-type-btn {
  display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem;
  background: var(--ck-gray-50); border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg); font-size: 0.8125rem; font-weight: 500;
  color: var(--ck-gray-700); transition: all var(--ck-transition-fast); cursor: pointer;
}
.report-type-btn:hover { border-color: var(--ck-primary-border); background: var(--ck-primary-light); }
.report-type-btn--active {
  background: var(--ck-primary-light) !important; border-color: var(--ck-primary) !important;
  color: var(--ck-primary) !important;
}

.date-inputs { display: flex; align-items: center; gap: 0.5rem; }
.date-sep { font-size: 0.875rem; color: var(--ck-gray-500); }

.export-actions { display: flex; gap: 0.75rem; }

.preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }

.preview-content { max-height: 600px; overflow-y: auto; }

.preview-meta {
  background: var(--ck-gray-50); border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg); padding: 1rem;
}
.preview-meta__row {
  display: flex; justify-content: space-between; font-size: 0.8125rem;
  color: var(--ck-gray-600); padding: 0.25rem 0;
}
.preview-meta__row strong { color: var(--ck-gray-900); }

.preview-divider { height: 1px; background: var(--ck-gray-200); margin: 1.5rem 0; }

.preview-section-title { font-size: 0.875rem; font-weight: 600; color: var(--ck-gray-800); margin-bottom: 0.75rem; }

.table-wrapper {
  background: var(--ck-gray-50); border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg); overflow: hidden;
}

.preview-note {
  display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;
  font-size: 0.75rem; color: var(--ck-gray-600);
}
</style>
