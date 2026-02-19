<template>
  <div class="user-mgmt">
    <!-- Header -->
    <div class="ck-card ck-card--elevated">
      <div class="mgmt-header">
        <div>
          <h2 class="page-title">User Management</h2>
          <p class="page-subtitle">Research Participant Registry & Monitoring</p>
        </div>
        <div class="header-stats">
          <div class="header-stat">
            <span class="header-stat__value">{{ participants.length }}</span>
            <span class="header-stat__label">Total Participants</span>
          </div>
          <div class="header-stat">
            <span class="header-stat__value">{{ activeCount }}</span>
            <span class="header-stat__label">Active</span>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="filters-bar">
        <div class="search-wrapper">
          <SearchIcon :size="16" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search participants by name or ID..."
            class="ck-input ck-input--with-icon"
          />
        </div>
        <select v-model="statusFilter" class="ck-select" style="width: auto; min-width: 120px;">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <!-- Participants Table -->
      <div class="table-wrapper">
        <table class="ck-table">
          <thead>
            <tr>
              <th>Participant ID</th>
              <th>Name</th>
              <th style="text-align: center;">Age</th>
              <th style="text-align: center;">Sex</th>
              <th>Linked Scale</th>
              <th>Last Sync</th>
              <th style="text-align: center;">Logging Consistency</th>
              <th>Status</th>
              <th style="text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filteredParticipants" :key="p.id">
              <td class="font-mono" style="font-weight: 500; color: var(--ck-gray-900);">{{ p.id }}</td>
              <td style="font-weight: 500; color: var(--ck-gray-900);">{{ p.name }}</td>
              <td style="text-align: center;">{{ p.age }}</td>
              <td style="text-align: center;">{{ p.sex }}</td>
              <td class="font-mono">{{ p.linkedScale }}</td>
              <td>{{ p.lastSync }}</td>
              <td style="text-align: center;">
                <div class="consistency-cell">
                  <div class="ck-progress" style="width: 80px;">
                    <div
                      class="ck-progress__bar"
                      :style="{ width: p.consistency + '%', background: consistencyColor(p.consistency) }"
                    ></div>
                  </div>
                  <span class="consistency-pct">{{ p.consistency }}%</span>
                </div>
              </td>
              <td>
                <span
                  class="ck-badge"
                  :class="p.active ? 'ck-badge--success' : 'ck-badge--outline'"
                >
                  {{ p.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td style="text-align: center;">
                <button class="action-btn" @click="showDetail(p)">
                  <EyeIcon :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredParticipants.length === 0" class="empty-state">
        <p>No participants found.</p>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedParticipant" class="ck-overlay" @click.self="selectedParticipant = null">
        <div class="modal animate-fade-in">
          <div class="modal__header">
            <h3>Participant Details</h3>
            <button @click="selectedParticipant = null" class="modal__close"><XIcon :size="20" /></button>
          </div>
          <div class="modal__body">
            <div class="detail-grid">
              <div class="detail-row">
                <span class="detail-label">ID:</span>
                <span class="font-mono">{{ selectedParticipant.id }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span>{{ selectedParticipant.name }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Age / Sex:</span>
                <span>{{ selectedParticipant.age }} / {{ selectedParticipant.sex }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Linked Scale:</span>
                <span class="font-mono">{{ selectedParticipant.linkedScale }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Last Sync:</span>
                <span>{{ selectedParticipant.lastSync }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Baseline TDEE:</span>
                <span>{{ selectedParticipant.baselineTDEE }} kcal</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">BMI:</span>
                <span>{{ selectedParticipant.bmi }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Consistency:</span>
                <span style="font-weight: 600;">{{ selectedParticipant.consistency }}%</span>
              </div>
            </div>

            <div class="modal-actions">
              <button class="ck-btn ck-btn--primary" style="flex: 1;">
                <MailIcon :size="18" />
                <span>Reset Password</span>
              </button>
              <button class="ck-btn" style="background: #fecaca; color: #dc2626; flex: 1;">
                <UserXIcon :size="18" />
                <span>Deactivate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Search as SearchIcon,
  Eye as EyeIcon,
  X as XIcon,
  Mail as MailIcon,
  UserX as UserXIcon
} from 'lucide-vue-next'

const searchQuery = ref('')
const statusFilter = ref('all')
const selectedParticipant = ref(null)

const participants = [
  { id: 'P-0001', name: 'Maria Santos', age: 28, sex: 'F', linkedScale: 'SC-001', lastSync: '2 mins ago', consistency: 94, active: true, baselineTDEE: 1850, bmi: 22.1 },
  { id: 'P-0002', name: 'Juan Dela Cruz', age: 34, sex: 'M', linkedScale: 'SC-012', lastSync: '15 mins ago', consistency: 87, active: true, baselineTDEE: 2200, bmi: 24.5 },
  { id: 'P-0003', name: 'Ana Reyes', age: 22, sex: 'F', linkedScale: 'SC-022', lastSync: '1 hour ago', consistency: 92, active: true, baselineTDEE: 1750, bmi: 20.8 },
  { id: 'P-0004', name: 'Carlos Garcia', age: 45, sex: 'M', linkedScale: 'SC-035', lastSync: '3 hours ago', consistency: 76, active: true, baselineTDEE: 2350, bmi: 27.2 },
  { id: 'P-0005', name: 'Lisa Fernandez', age: 31, sex: 'F', linkedScale: 'SC-047', lastSync: '2 days ago', consistency: 45, active: false, baselineTDEE: 1900, bmi: 23.4 },
  { id: 'P-0006', name: 'Mark Villanueva', age: 26, sex: 'M', linkedScale: 'SC-053', lastSync: '5 mins ago', consistency: 98, active: true, baselineTDEE: 2100, bmi: 21.9 },
  { id: 'P-0007', name: 'Cherry Mae Tan', age: 29, sex: 'F', linkedScale: 'SC-068', lastSync: '30 mins ago', consistency: 88, active: true, baselineTDEE: 1800, bmi: 22.7 },
  { id: 'P-0008', name: 'Roberto Aquino', age: 38, sex: 'M', linkedScale: 'SC-074', lastSync: '1 hour ago', consistency: 81, active: true, baselineTDEE: 2280, bmi: 25.1 }
]

const activeCount = computed(() => participants.filter(p => p.active).length)

const filteredParticipants = computed(() =>
  participants.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value === 'all' ||
      (statusFilter.value === 'active' && p.active) ||
      (statusFilter.value === 'inactive' && !p.active)
    return matchSearch && matchStatus
  })
)

const consistencyColor = (c) => c >= 80 ? '#10b981' : c >= 60 ? '#f59e0b' : '#ef4444'

const showDetail = (p) => { selectedParticipant.value = p }
</script>

<style scoped>
.user-mgmt { display: flex; flex-direction: column; gap: 1.5rem; }

.mgmt-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.page-title { font-size: 1.5rem; font-weight: 600; color: var(--ck-gray-900); }
.page-subtitle { font-size: 0.875rem; color: var(--ck-gray-600); }

.header-stats { display: flex; gap: 1.5rem; }
.header-stat { text-align: center; }
.header-stat__value { font-size: 1.5rem; font-weight: 700; color: var(--ck-primary); display: block; }
.header-stat__label { font-size: 0.75rem; color: var(--ck-gray-500); }

.filters-bar { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
.search-wrapper { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--ck-gray-400); pointer-events: none; }

.table-wrapper {
  background: var(--ck-gray-50); border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg); overflow-x: auto;
}

.consistency-cell { display: flex; align-items: center; gap: 0.5rem; justify-content: center; }
.consistency-pct { font-size: 0.75rem; font-weight: 500; color: var(--ck-gray-700); width: 2.5rem; }

.action-btn {
  padding: 0.375rem; color: var(--ck-gray-500); border-radius: var(--ck-radius-md);
  transition: all var(--ck-transition-fast);
}
.action-btn:hover { background: var(--ck-gray-100); color: var(--ck-gray-800); }

.empty-state { text-align: center; padding: 2rem; color: var(--ck-gray-500); font-size: 0.875rem; }

/* Modal */
.modal {
  background: white; border-radius: var(--ck-radius-xl); width: 100%; max-width: 500px;
  box-shadow: var(--ck-shadow-2xl); overflow: hidden;
}
.modal__header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.5rem; border-bottom: 1px solid var(--ck-gray-200);
}
.modal__header h3 { font-size: 1.125rem; font-weight: 600; color: var(--ck-gray-900); }
.modal__close { color: var(--ck-gray-400); padding: 0.25rem; border-radius: var(--ck-radius-md); }
.modal__close:hover { background: var(--ck-gray-100); color: var(--ck-gray-700); }
.modal__body { padding: 1.5rem; }

.detail-grid { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
.detail-row { display: flex; gap: 1rem; font-size: 0.875rem; }
.detail-label { color: var(--ck-gray-500); width: 120px; flex-shrink: 0; }

.modal-actions { display: flex; gap: 0.75rem; }
</style>
