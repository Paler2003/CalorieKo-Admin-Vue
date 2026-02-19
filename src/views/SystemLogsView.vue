<template>
  <div class="system-logs">
    <!-- Live Transaction Feed Header -->
    <div class="ck-card ck-card--elevated">
      <div class="logs-header">
        <div>
          <h2 class="page-title">System Logs</h2>
          <p class="page-subtitle">Live Transaction Audit Trail with Blockchain-style Integrity</p>
        </div>
        <div class="live-indicator">
          <span class="ck-dot ck-dot--green animate-pulse"></span>
          <span class="live-text">Live</span>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="filters-bar">
        <div class="search-wrapper">
          <SearchIcon :size="16" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search logs..."
            class="ck-input ck-input--with-icon"
          />
        </div>
        <div class="filter-group">
          <select v-model="selectedType" class="ck-select">
            <option value="all">All Types</option>
            <option value="data">Data Operations</option>
            <option value="auth">Authentication</option>
            <option value="security">Security Events</option>
            <option value="sync">Synchronization</option>
            <option value="model">Model Events</option>
          </select>
          <select v-model="selectedStatus" class="ck-select">
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <!-- Log Table -->
      <div class="table-wrapper">
        <table class="ck-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Researcher</th>
              <th>Event Type</th>
              <th>Description</th>
              <th>Status</th>
              <th>Hash</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in filteredLogs"
              :key="log.id"
              class="log-row"
              :class="{ 'log-row--new': log.isNew }"
            >
              <td class="font-mono" style="font-size: 0.75rem; white-space: nowrap;">{{ log.timestamp }}</td>
              <td>
                <span class="ck-badge ck-badge--outline">{{ log.researcher }}</span>
              </td>
              <td>
                <span
                  class="ck-badge"
                  :class="typeClass(log.type)"
                >
                  {{ log.type }}
                </span>
              </td>
              <td class="td-desc">{{ log.description }}</td>
              <td>
                <span
                  class="ck-badge"
                  :class="statusClass(log.status)"
                >
                  {{ log.status }}
                </span>
              </td>
              <td>
                <span class="font-mono hash-text">{{ log.hash }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredLogs.length === 0" class="empty-state">
        <p>No logs match the current filters.</p>
      </div>
    </div>

    <!-- Hash Chain Visualization -->
    <div class="ck-card ck-card--elevated">
      <h3 class="section-title">Blockchain-style Hash Chain</h3>
      <p class="section-subtitle" style="margin-bottom: 1rem;">
        Each log entry is cryptographically linked to ensure integrity
      </p>

      <div class="hash-chain">
        <div
          v-for="(block, i) in hashChain"
          :key="i"
          class="hash-block"
        >
          <div class="hash-block__header">
            <span class="hash-block__label">Block {{ i + 1 }}</span>
            <CheckCircle2Icon :size="14" style="color: #10b981;" />
          </div>
          <div class="hash-block__hash font-mono">{{ block.hash }}</div>
          <div v-if="i < hashChain.length - 1" class="hash-chain__arrow">
            <ArrowDownIcon :size="16" style="color: var(--ck-gray-400);" />
          </div>
        </div>
      </div>

      <div class="integrity-status">
        <ShieldCheckIcon :size="20" style="color: #10b981;" />
        <span>All {{ hashChain.length }} blocks verified. Data integrity confirmed.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Search as SearchIcon,
  CheckCircle2 as CheckCircle2Icon,
  ArrowDown as ArrowDownIcon,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-vue-next'

const searchQuery = ref('')
const selectedType = ref('all')
const selectedStatus = ref('all')

const generateHash = () => {
  const chars = '0123456789abcdef'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * 16)]).join('')
}

const logEntries = [
  { id: '1', timestamp: '2025-02-19 14:23:01', researcher: 'R-0042', type: 'Data', description: 'Log entry encrypted and stored via SQLCipher', status: 'Success', hash: generateHash() },
  { id: '2', timestamp: '2025-02-19 14:22:45', researcher: 'R-0015', type: 'Auth', description: 'Session token refreshed successfully', status: 'Success', hash: generateHash() },
  { id: '3', timestamp: '2025-02-19 14:21:30', researcher: 'R-0042', type: 'Sync', description: 'BLE data synced from SC-012 (128 records)', status: 'Success', hash: generateHash() },
  { id: '4', timestamp: '2025-02-19 14:20:18', researcher: 'SYSTEM', type: 'Security', description: 'AES-256 encryption applied to batch export', status: 'Success', hash: generateHash() },
  { id: '5', timestamp: '2025-02-19 14:19:55', researcher: 'R-0008', type: 'Model', description: 'Inference request: Pancit Canton — 91.2% confidence', status: 'Success', hash: generateHash() },
  { id: '6', timestamp: '2025-02-19 14:18:42', researcher: 'SYSTEM', type: 'Security', description: 'Argon2id hash verification passed', status: 'Success', hash: generateHash() },
  { id: '7', timestamp: '2025-02-19 14:17:01', researcher: 'R-0023', type: 'Data', description: 'Nutritional log submitted: 2,450 kcal', status: 'Success', hash: generateHash() },
  { id: '8', timestamp: '2025-02-19 14:15:33', researcher: 'SYSTEM', type: 'Sync', description: 'Database backup completed (2.3 GB)', status: 'Success', hash: generateHash() },
  { id: '9', timestamp: '2025-02-19 14:12:10', researcher: 'R-0042', type: 'Auth', description: 'Failed login attempt — incorrect password', status: 'Warning', hash: generateHash() },
  { id: '10', timestamp: '2025-02-19 14:10:05', researcher: 'SYSTEM', type: 'Model', description: 'Model retraining queued (ETA: 45 min)', status: 'Success', hash: generateHash() },
  { id: '11', timestamp: '2025-02-19 14:08:22', researcher: 'R-0015', type: 'Data', description: 'Participant P-0089 baseline metrics updated', status: 'Success', hash: generateHash() },
  { id: '12', timestamp: '2025-02-19 14:05:41', researcher: 'SYSTEM', type: 'Security', description: 'TLS 1.3 handshake validated for API connection', status: 'Success', hash: generateHash() }
]

const filteredLogs = computed(() => {
  return logEntries.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.researcher.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = selectedType.value === 'all' || log.type.toLowerCase() === selectedType.value
    const matchesStatus = selectedStatus.value === 'all' || log.status.toLowerCase() === selectedStatus.value
    return matchesSearch && matchesType && matchesStatus
  })
})

const typeClass = (type) => {
  const map = { Data: 'type-data', Auth: 'type-auth', Security: 'type-security', Sync: 'type-sync', Model: 'type-model' }
  return map[type] || ''
}

const statusClass = (status) => {
  const map = { Success: 'ck-badge--success', Warning: 'ck-badge--warning', Error: 'ck-badge--error' }
  return map[status] || ''
}

const hashChain = Array.from({ length: 5 }, () => ({ hash: generateHash() + generateHash() }))
</script>

<style scoped>
.system-logs { display: flex; flex-direction: column; gap: 1.5rem; }

.logs-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.page-title { font-size: 1.5rem; font-weight: 600; color: var(--ck-gray-900); }
.page-subtitle { font-size: 0.875rem; color: var(--ck-gray-600); }
.section-title { font-size: 1.125rem; font-weight: 600; color: var(--ck-gray-900); }
.section-subtitle { font-size: 0.875rem; color: var(--ck-gray-600); }

.live-indicator { display: flex; align-items: center; gap: 0.5rem; }
.live-text { font-size: 0.875rem; color: var(--ck-gray-500); }

.filters-bar {
  display: flex; gap: 1rem; margin-bottom: 1rem;
  flex-wrap: wrap; align-items: center;
}
.search-wrapper { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--ck-gray-400); pointer-events: none; }
.filter-group { display: flex; gap: 0.5rem; }
.filter-group .ck-select { width: auto; min-width: 140px; }

.table-wrapper {
  background: var(--ck-gray-50); border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg); overflow-x: auto;
}

.td-desc { max-width: 300px; }

.hash-text { font-size: 0.625rem; color: var(--ck-gray-500); word-break: break-all; }

.log-row--new td { background: rgba(16, 185, 129, 0.05); }

.type-data { background: var(--ck-primary-light); color: var(--ck-primary); border: 1px solid var(--ck-primary-border); }
.type-auth { background: var(--ck-blue-light); color: var(--ck-blue); border: 1px solid rgba(59, 130, 246, 0.3); }
.type-security { background: var(--ck-purple-light); color: var(--ck-purple); border: 1px solid rgba(139, 92, 246, 0.3); }
.type-sync { background: var(--ck-cyan-light); color: var(--ck-cyan); border: 1px solid rgba(6, 182, 212, 0.3); }
.type-model { background: var(--ck-amber-light); color: var(--ck-amber); border: 1px solid var(--ck-amber-border); }

.empty-state { text-align: center; padding: 2rem; color: var(--ck-gray-500); font-size: 0.875rem; }

.hash-chain { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.hash-block {
  background: var(--ck-gray-50); border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg); padding: 0.75rem 1.5rem; width: 100%; max-width: 400px;
}
.hash-block__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
.hash-block__label { font-size: 0.75rem; font-weight: 600; color: var(--ck-gray-700); }
.hash-block__hash { font-size: 0.6875rem; color: var(--ck-gray-500); word-break: break-all; }
.hash-chain__arrow { padding: 0.25rem 0; text-align: center; }

.integrity-status {
  display: flex; align-items: center; gap: 0.5rem; justify-content: center;
  margin-top: 1rem; font-size: 0.875rem; font-weight: 500; color: var(--ck-primary);
}
</style>
