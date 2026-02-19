<template>
  <div class="ck-card">
    <div class="feed-header">
      <div>
        <h3 class="chart-title">Security & Data Integrity Feed</h3>
        <p class="chart-subtitle">System Audit Logs (Real-time)</p>
      </div>
      <div class="live-indicator">
        <span class="ck-dot ck-dot--green animate-pulse"></span>
        <span class="live-text">Live</span>
      </div>
    </div>

    <div class="feed-container custom-scrollbar">
      <div
        v-for="(log, index) in logs"
        :key="log.id"
        class="feed-item"
        :class="{ 'animate-fade-in': index < 2 }"
      >
        <span class="feed-item__time font-mono">{{ log.time }}</span>
        <component :is="log.iconComponent" :size="14" :class="'feed-item__icon feed-item__icon--' + log.type" />
        <p class="feed-item__action">{{ log.action }}</p>
      </div>
    </div>

    <div class="grid-3 feed-stats">
      <div class="feed-stat">
        <p class="feed-stat__label">Encryptions</p>
        <p class="feed-stat__value" style="color: #10b981;">847</p>
        <p class="feed-stat__period">Today</p>
      </div>
      <div class="feed-stat">
        <p class="feed-stat__label">Verifications</p>
        <p class="feed-stat__value" style="color: #3b82f6;">1,234</p>
        <p class="feed-stat__period">Today</p>
      </div>
      <div class="feed-stat">
        <p class="feed-stat__label">Failed Attempts</p>
        <p class="feed-stat__value" style="color: #ef4444;">0</p>
        <p class="feed-stat__period">Today</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, markRaw } from 'vue'
import { Lock, Hash, Database, Shield, CheckCircle } from 'lucide-vue-next'

const generateLogs = () => {
  const now = new Date()
  const templates = [
    { action: 'Log Encrypted via SQLCipher', type: 'encryption', iconComponent: markRaw(Lock) },
    { action: 'Data Hashed via Argon2id', type: 'hash', iconComponent: markRaw(Hash) },
    { action: 'Database Sync Completed', type: 'sync', iconComponent: markRaw(Database) },
    { action: 'Session Token Verified', type: 'auth', iconComponent: markRaw(Shield) },
    { action: 'Integrity Check Passed', type: 'verify', iconComponent: markRaw(CheckCircle) },
    { action: 'AES-256 Encryption Applied', type: 'encryption', iconComponent: markRaw(Lock) },
    { action: 'Secure Data Export Completed', type: 'sync', iconComponent: markRaw(Database) },
    { action: 'User Authentication Successful', type: 'auth', iconComponent: markRaw(Shield) }
  ]

  return Array.from({ length: 12 }, (_, i) => {
    const logTime = new Date(now.getTime() - i * 5 * 60 * 1000)
    const template = templates[i % templates.length]
    return {
      id: `log-${i}`,
      time: `${String(logTime.getHours()).padStart(2, '0')}:${String(logTime.getMinutes()).padStart(2, '0')}`,
      ...template
    }
  })
}

const logs = ref(generateLogs())
let interval = null

onMounted(() => {
  interval = setInterval(() => { logs.value = generateLogs() }, 30000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
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

.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.live-text {
  font-size: 0.75rem;
  color: var(--ck-gray-600);
}

.feed-container {
  background: var(--ck-gray-50);
  border-radius: var(--ck-radius-lg);
  padding: 1rem;
  max-height: 20rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.feed-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--ck-radius-lg);
  transition: background var(--ck-transition-fast);
}

.feed-item:hover {
  background: white;
}

.feed-item__time {
  font-size: 0.75rem;
  color: var(--ck-gray-500);
  width: 3rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.feed-item__icon { flex-shrink: 0; margin-top: 2px; }
.feed-item__icon--encryption { color: #10b981; }
.feed-item__icon--hash { color: #3b82f6; }
.feed-item__icon--sync { color: #8b5cf6; }
.feed-item__icon--auth { color: #f59e0b; }
.feed-item__icon--verify { color: #10b981; }

.feed-item__action {
  font-size: 0.875rem;
  color: var(--ck-gray-700);
  flex: 1;
}

.feed-stats {
  margin-top: 1rem;
}

.feed-stat {
  background: var(--ck-gray-50);
  border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg);
  padding: 0.75rem;
  text-align: center;
}

.feed-stat__label {
  font-size: 0.75rem;
  color: var(--ck-gray-600);
  margin-bottom: 0.25rem;
}

.feed-stat__value {
  font-size: 1.125rem;
  font-weight: 600;
}

.feed-stat__period {
  font-size: 0.75rem;
  color: var(--ck-gray-500);
}
</style>
