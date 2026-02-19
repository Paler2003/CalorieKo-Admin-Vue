<template>
  <div class="grid-4">
    <div
      v-for="tile in tiles"
      :key="tile.title"
      class="ck-stat-tile"
    >
      <div class="kpi-tile">
        <div class="kpi-tile__info">
          <p class="kpi-tile__label">{{ tile.title }}</p>
          <p class="kpi-tile__value">{{ tile.value }}</p>
          <p v-if="tile.trend" class="kpi-tile__trend">{{ tile.trend }}</p>
        </div>
        <div
          class="kpi-tile__icon"
          :style="{ backgroundColor: tile.color + '20', color: tile.color }"
        >
          <component :is="tile.icon" :size="24" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Users, Target, Scale, Database } from 'lucide-vue-next'

const tiles = [
  {
    title: 'Total Enrolled Research Subjects',
    value: 127,
    icon: Users,
    trend: '+12 this month',
    color: '#10b981'
  },
  {
    title: 'Successful AI Identifications',
    value: '82%',
    icon: Target,
    trend: 'Above 75% target',
    color: '#10b981'
  },
  {
    title: 'Avg Scale Measurement Stability',
    value: '1.5s',
    icon: Scale,
    trend: 'Optimal range',
    color: '#f59e0b'
  },
  {
    title: 'Synced Logs Today',
    value: '2,847',
    icon: Database,
    trend: 'Last sync: 2 min ago',
    color: '#10b981'
  }
]
</script>

<style scoped>
.kpi-tile {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.kpi-tile__info {
  flex: 1;
}

.kpi-tile__label {
  font-size: 0.875rem;
  color: var(--ck-gray-600);
  margin-bottom: 0.5rem;
}

.kpi-tile__value {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--ck-gray-800);
  margin-bottom: 0.25rem;
}

.kpi-tile__trend {
  font-size: 0.75rem;
  color: var(--ck-gray-500);
}

.kpi-tile__icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--ck-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
