<template>
  <div class="overview">
    <KpiTiles />

    <div class="grid-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
        <NutritionTrendsChart />
        <TopDishesChart />
    </div>

    <UserConsistencyChart />
  </div>
</template>

<script setup>
import KpiTiles from '../components/overview/KpiTiles.vue'
import UserConsistencyChart from '../components/overview/UserConsistencyChart.vue'
import TopDishesChart from '../components/overview/TopDishesChart.vue'
import NutritionTrendsChart from '../components/overview/NutritionTrendsChart.vue'
</script>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
