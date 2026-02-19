<template>
  <div class="overview">
    <!-- KPI Tiles -->
    <KpiTiles />

    <!-- AI Inference Chart -->
    <AiInferenceChart />

    <!-- Nutritional Trends -->
    <NutritionalTrendsChart />

    <!-- Hardware & Connectivity -->
    <HardwareStatus />

    <!-- Security Feed -->
    <SecurityFeed />
  </div>
</template>

<script setup>
import KpiTiles from '../components/overview/KpiTiles.vue'
import AiInferenceChart from '../components/overview/AiInferenceChart.vue'
import NutritionalTrendsChart from '../components/overview/NutritionalTrendsChart.vue'
import HardwareStatus from '../components/overview/HardwareStatus.vue'
import SecurityFeed from '../components/overview/SecurityFeed.vue'
</script>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
