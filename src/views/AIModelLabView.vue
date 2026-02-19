<template>
  <div class="ai-lab">
    <!-- Model Metadata Header -->
    <div class="ck-card ck-card--elevated">
      <div class="lab-header">
        <div>
          <h2 class="lab-title">AI Model Lab</h2>
          <p class="lab-subtitle">MobileNetV3 CNN Training & Performance Monitor</p>
        </div>
        <div class="accuracy-badge">
          <ZapIcon :size="20" />
          <div>
            <div class="accuracy-badge__label">Overall Accuracy</div>
            <div class="accuracy-badge__value">{{ overallAccuracy }}%</div>
          </div>
        </div>
      </div>

      <div class="grid-3 arch-cards">
        <div class="arch-card" v-for="item in archInfo" :key="item.label">
          <LayersIcon :size="20" class="arch-card__icon" />
          <div>
            <div class="arch-card__label">{{ item.label }}</div>
            <div class="arch-card__value">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Regional Dish Inventory -->
    <div class="ck-card ck-card--elevated">
      <div class="inventory-header">
        <div>
          <h3 class="section-title">Regional Dish Inventory</h3>
          <p class="section-subtitle">Custom Dataset: {{ dishes.length }} Davao Filipino Dishes</p>
        </div>
        <span class="ck-badge ck-badge--outline">
          Total Samples: {{ totalSamples.toLocaleString() }}
        </span>
      </div>

      <!-- Search -->
      <div class="search-wrapper">
        <SearchIcon :size="16" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search dishes by name..."
          class="ck-input ck-input--with-icon"
        />
      </div>

      <!-- Dish Grid -->
      <div class="dish-grid">
        <div
          v-for="dish in filteredDishes"
          :key="dish.id"
          class="dish-card"
        >
          <div class="dish-card__image">
            <img :src="dish.imageUrl" :alt="dish.name" loading="lazy" />
            <span
              class="dish-card__accuracy"
              :class="dish.accuracy >= 75 ? 'dish-card__accuracy--pass' : 'dish-card__accuracy--warn'"
            >
              {{ dish.accuracy.toFixed(1) }}%
            </span>
          </div>
          <div class="dish-card__info">
            <h4>{{ dish.name }}</h4>
            <div class="dish-card__meta">
              <div class="dish-card__row">
                <span>Training Samples:</span>
                <strong>{{ dish.sampleCount }}</strong>
              </div>
              <div class="dish-card__confusion">
                <span class="dish-card__confusion-label">Confusion Matrix:</span>
                <span>Often confused with <strong>{{ dish.confusedWith }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredDishes.length === 0" class="empty-state">
        <SearchIcon :size="48" class="empty-state__icon" />
        <p>No dishes found matching "{{ searchQuery }}"</p>
      </div>
    </div>

    <!-- Timpla Variance Monitor -->
    <div class="ck-card ck-card--elevated">
      <h3 class="section-title">"Timpla" Variance Monitor</h3>
      <p class="section-subtitle" style="margin-bottom: 1rem;">
        High Visual Heterogeneity Dishes (Lutong Bahay) - Statistical Averages from PhilFCT
      </p>

      <div class="table-wrapper">
        <table class="ck-table">
          <thead>
            <tr>
              <th>Dish Name</th>
              <th style="text-align:right">Avg. Calories (kcal)</th>
              <th style="text-align:right">Avg. Sodium (mg)</th>
              <th>Variance Level</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in timplaVariance" :key="item.dish">
              <td style="font-weight: 500; color: var(--ck-gray-900);">{{ item.dish }}</td>
              <td style="text-align:right">{{ item.avgCalories }}</td>
              <td style="text-align:right">{{ item.avgSodium }}</td>
              <td>
                <span
                  class="ck-badge"
                  :class="item.variance === 'High' ? 'variance-high' : 'variance-medium'"
                >
                  {{ item.variance }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="note-box note-box--blue">
        <strong>Note:</strong> These dishes exhibit significant variation in preparation methods across different households.
        Nutritional values represent statistical averages based on the Philippine Food Composition Tables (PhilFCT).
      </div>
    </div>

    <!-- Transfer Learning Controls -->
    <div class="ck-card ck-card--elevated">
      <h3 class="section-title" style="margin-bottom: 1rem;">Transfer Learning Controls</h3>
      <div class="grid-3">
        <button class="ck-btn ck-btn--primary">
          <RefreshCwIcon :size="20" />
          <span>Retrain Model</span>
        </button>
        <button class="ck-btn ck-btn--dark">
          <DownloadIcon :size="20" />
          <span>Export .tflite for Android</span>
        </button>
        <button class="ck-btn" style="background: var(--ck-gray-600); color: white;">
          <BarChart3Icon :size="20" />
          <span>View Dataset Distribution</span>
        </button>
      </div>

      <div class="model-status">
        <CheckCircle2Icon :size="20" style="color: #10b981; flex-shrink: 0;" />
        <div>
          <strong>Model Status:</strong> Ready for deployment.
          Current accuracy ({{ overallAccuracy }}%) exceeds the target threshold of 75%.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Zap as ZapIcon,
  Layers as LayersIcon,
  Search as SearchIcon,
  RefreshCw as RefreshCwIcon,
  Download as DownloadIcon,
  BarChart3 as BarChart3Icon,
  CheckCircle2 as CheckCircle2Icon
} from 'lucide-vue-next'

const searchQuery = ref('')

const archInfo = [
  { label: 'Architecture', value: 'MobileNetV3-Small' },
  { label: 'Framework', value: 'TensorFlow Lite' },
  { label: 'Target Performance', value: '> 75% Accuracy' }
]

const dishes = [
  { id: '1', name: 'Law-uy', imageUrl: 'https://images.unsplash.com/photo-1518536671722-8fa717aafde8?w=400', sampleCount: 142, accuracy: 81.2, confusedWith: 'Bulalo' },
  { id: '2', name: 'Balbacua', imageUrl: 'https://images.unsplash.com/photo-1758762972966-c7d0eecd09d2?w=400', sampleCount: 128, accuracy: 76.8, confusedWith: 'Kaldereta' },
  { id: '3', name: 'Humba', imageUrl: 'https://images.unsplash.com/photo-1624174881680-24efadda7299?w=400', sampleCount: 156, accuracy: 72.4, confusedWith: 'Pork Adobo' },
  { id: '4', name: 'Pork Adobo', imageUrl: 'https://images.unsplash.com/photo-1606525575548-2d62ed40291d?w=400', sampleCount: 203, accuracy: 84.6, confusedWith: 'Humba' },
  { id: '5', name: 'Chicken Adobo', imageUrl: 'https://images.unsplash.com/photo-1708597525178-6c302364f37c?w=400', sampleCount: 198, accuracy: 87.3, confusedWith: 'Tinola' },
  { id: '6', name: 'Sinigang na Baboy', imageUrl: 'https://images.unsplash.com/photo-1518536671722-8fa717aafde8?w=400', sampleCount: 175, accuracy: 79.5, confusedWith: 'Sinigang na Isda' },
  { id: '7', name: 'Tinola', imageUrl: 'https://images.unsplash.com/photo-1673139140820-039ad8bc2c0e?w=400', sampleCount: 168, accuracy: 82.1, confusedWith: 'Chicken Adobo' },
  { id: '8', name: 'Kare-Kare', imageUrl: 'https://images.unsplash.com/photo-1677385433524-8ef48474f07c?w=400', sampleCount: 134, accuracy: 73.9, confusedWith: 'Dinuguan' },
  { id: '9', name: 'Pancit Canton', imageUrl: 'https://images.unsplash.com/photo-1724861836718-d8443baa0f82?w=400', sampleCount: 211, accuracy: 91.2, confusedWith: 'Pancit Bihon' },
  { id: '10', name: 'Lumpia Shanghai', imageUrl: 'https://images.unsplash.com/photo-1701577652148-74a141cdca97?w=400', sampleCount: 224, accuracy: 93.5, confusedWith: 'Lumpia Sariwa' },
  { id: '11', name: 'Lechon Kawali', imageUrl: 'https://images.unsplash.com/photo-1728240257876-dd4fc7398043?w=400', sampleCount: 187, accuracy: 88.4, confusedWith: 'Crispy Pata' },
  { id: '12', name: 'Sisig', imageUrl: 'https://images.unsplash.com/photo-1646821195934-fb7ddb6166ab?w=400', sampleCount: 192, accuracy: 85.7, confusedWith: 'Lechon Kawali' }
]

const filteredDishes = computed(() =>
  dishes.filter(d => d.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
)

const totalSamples = computed(() => dishes.reduce((sum, d) => sum + d.sampleCount, 0))

const overallAccuracy = computed(() =>
  (dishes.reduce((sum, d) => sum + d.accuracy * d.sampleCount, 0) /
    dishes.reduce((sum, d) => sum + d.sampleCount, 0)).toFixed(1)
)

const timplaVariance = [
  { dish: 'Humba', avgCalories: 312, avgSodium: 890, variance: 'High' },
  { dish: 'Pork Adobo', avgCalories: 298, avgSodium: 1024, variance: 'High' },
  { dish: 'Menudo', avgCalories: 267, avgSodium: 756, variance: 'Medium' },
  { dish: 'Kaldereta', avgCalories: 289, avgSodium: 812, variance: 'High' },
  { dish: 'Sinigang na Baboy', avgCalories: 245, avgSodium: 1156, variance: 'Medium' }
]
</script>

<style scoped>
.ai-lab { display: flex; flex-direction: column; gap: 1.5rem; }

.lab-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.lab-title { font-size: 1.5rem; font-weight: 600; color: var(--ck-gray-900); margin-bottom: 0.5rem; }
.lab-subtitle { font-size: 0.875rem; color: var(--ck-gray-600); }

.accuracy-badge {
  display: flex; align-items: center; gap: 0.5rem;
  background: var(--ck-primary-light); border: 1px solid var(--ck-primary-border);
  padding: 0.5rem 1rem; border-radius: var(--ck-radius-lg); color: var(--ck-primary);
}
.accuracy-badge__label { font-size: 0.75rem; color: var(--ck-gray-600); }
.accuracy-badge__value { font-size: 1.5rem; font-weight: 700; color: var(--ck-primary); }

.arch-card {
  display: flex; align-items: center; gap: 0.75rem;
  background: var(--ck-gray-50); padding: 1rem; border-radius: var(--ck-radius-lg);
  border: 1px solid var(--ck-gray-200);
}
.arch-card__icon { color: var(--ck-gray-600); }
.arch-card__label { font-size: 0.75rem; color: var(--ck-gray-500); }
.arch-card__value { font-size: 0.875rem; font-weight: 600; color: var(--ck-gray-900); }

.inventory-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.section-title { font-size: 1.125rem; font-weight: 600; color: var(--ck-gray-900); }
.section-subtitle { font-size: 0.875rem; color: var(--ck-gray-600); }

.search-wrapper { position: relative; margin-bottom: 1.5rem; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--ck-gray-400); pointer-events: none; }

.dish-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;
}

.dish-card {
  background: white; border: 1px solid var(--ck-gray-200); border-radius: var(--ck-radius-lg);
  overflow: hidden; transition: all var(--ck-transition-base);
}
.dish-card:hover { box-shadow: var(--ck-shadow-lg); border-color: var(--ck-primary-border); }
.dish-card:hover .dish-card__image img { transform: scale(1.05); }

.dish-card__image {
  position: relative; height: 10rem; background: var(--ck-gray-100); overflow: hidden;
}
.dish-card__image img {
  width: 100%; height: 100%; object-fit: cover; transition: transform var(--ck-transition-base);
}
.dish-card__accuracy {
  position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.25rem 0.625rem;
  border-radius: var(--ck-radius-full); font-size: 0.75rem; font-weight: 600;
  box-shadow: var(--ck-shadow-lg);
}
.dish-card__accuracy--pass { background: var(--ck-primary); color: white; }
.dish-card__accuracy--warn { background: var(--ck-amber); color: white; }

.dish-card__info { padding: 1rem; }
.dish-card__info h4 { font-weight: 600; color: var(--ck-gray-900); margin-bottom: 0.75rem; }
.dish-card__meta { font-size: 0.75rem; }
.dish-card__row { display: flex; justify-content: space-between; color: var(--ck-gray-600); }
.dish-card__confusion { margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--ck-gray-200); color: var(--ck-gray-700); }
.dish-card__confusion-label { color: var(--ck-gray-500); display: block; margin-bottom: 0.25rem; }

.empty-state { text-align: center; padding: 3rem 0; color: var(--ck-gray-500); }
.empty-state__icon { margin: 0 auto 0.75rem; opacity: 0.3; }

.table-wrapper { background: var(--ck-gray-50); border: 1px solid var(--ck-gray-200); border-radius: var(--ck-radius-lg); overflow: hidden; }

.variance-high { background: var(--ck-amber-light); color: #f59e0b; border: 1px solid var(--ck-amber-border); }
.variance-medium { background: #fef9c3; color: #a16207; border: 1px solid #fde68a; }

.note-box { padding: 1rem; border-radius: var(--ck-radius-lg); font-size: 0.75rem; margin-top: 1rem; }
.note-box--blue { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a5f; }

.model-status {
  display: flex; align-items: flex-start; gap: 0.75rem; margin-top: 1.5rem;
  padding: 1rem; background: var(--ck-primary-light); border: 1px solid var(--ck-primary-border);
  border-radius: var(--ck-radius-lg); font-size: 0.875rem; color: var(--ck-gray-700);
}
</style>
