<template>
  <div class="overview">
    <!-- KPI Tiles -->
    <KpiTiles />

    <!-- User Consistency Overview -->
    <UserConsistencyChart />
  </div>
</template>

<script setup>
import KpiTiles from '../components/overview/KpiTiles.vue'
import UserConsistencyChart from '../components/overview/UserConsistencyChart.vue'
</script>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
