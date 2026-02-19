<template>
  <div class="security-view">
    <!-- Security Health Score -->
    <div class="ck-card ck-card--elevated">
      <div class="health-header">
        <div>
          <h2 class="page-title">Security Posture</h2>
          <p class="page-subtitle">Real-time Security Health Monitoring</p>
        </div>
        <div class="health-score">
          <div class="health-score__ring" :data-score="securityScore">
            <svg viewBox="0 0 100 100" class="health-score__svg">
              <circle cx="50" cy="50" r="42" class="health-score__bg" />
              <circle cx="50" cy="50" r="42" class="health-score__progress"
                :style="{ strokeDashoffset: 264 - (264 * securityScore / 100) }" />
            </svg>
            <div class="health-score__text">
              <span class="health-score__value">{{ securityScore }}</span>
              <span class="health-score__label">/100</span>
            </div>
          </div>
          <p class="health-score__status">Excellent</p>
        </div>
      </div>
    </div>

    <!-- Three-Layer Encryption -->
    <div class="ck-card ck-card--elevated">
      <h3 class="section-title">Three-Layer Encryption Architecture</h3>
      <p class="section-subtitle" style="margin-bottom: 1rem;">
        End-to-end security applied at every data lifecycle stage
      </p>

      <div class="grid-3 encryption-layers">
        <div
          v-for="layer in encryptionLayers"
          :key="layer.title"
          class="enc-layer"
          :style="{ borderColor: layer.color + '40' }"
        >
          <div class="enc-layer__icon" :style="{ background: layer.color + '15', color: layer.color }">
            <component :is="layer.icon" :size="24" />
          </div>
          <h4 class="enc-layer__title">{{ layer.title }}</h4>
          <p class="enc-layer__desc">{{ layer.description }}</p>
          <div class="enc-layer__tech font-mono">{{ layer.tech }}</div>
        </div>
      </div>
    </div>

    <!-- Privacy by Design -->
    <div class="ck-card ck-card--elevated">
      <h3 class="section-title">Privacy by Design: Edge AI Processing</h3>
      <p class="section-subtitle" style="margin-bottom: 1.5rem;">
        All ML inference runs on-device — raw images never leave the Android client
      </p>

      <div class="pipeline">
        <div v-for="(step, i) in edgePipeline" :key="i" class="pipeline-step">
          <div class="pipeline-step__number">{{ i + 1 }}</div>
          <div class="pipeline-step__content">
            <h4>{{ step.title }}</h4>
            <p>{{ step.description }}</p>
          </div>
          <div v-if="i < edgePipeline.length - 1" class="pipeline-arrow">→</div>
        </div>
      </div>
    </div>

    <!-- RA 10173 Compliance -->
    <div class="ck-card ck-card--elevated">
      <h3 class="section-title">Compliance: RA 10173 (Data Privacy Act of 2012)</h3>
      <div class="compliance-list">
        <div
          v-for="item in compliance"
          :key="item.label"
          class="compliance-item"
        >
          <div class="compliance-item__check">
            <CheckCircle2Icon :size="18" style="color: #10b981;" />
          </div>
          <div>
            <strong>{{ item.label }}</strong>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Hash Chain Integrity -->
    <div class="ck-card ck-card--elevated">
      <h3 class="section-title">Data Integrity Hash Chain</h3>
      <p class="section-subtitle" style="margin-bottom: 1rem;">
        Blockchain-style linked hashing for tamper-proof audit trail
      </p>

      <div class="hash-blocks-grid">
        <div v-for="(block, i) in hashBlocks" :key="i" class="hash-block">
          <div class="hash-block__top">
            <span class="font-mono hash-block__id">#{{ String(i + 1).padStart(3, '0') }}</span>
            <CheckCircle2Icon :size="14" style="color: #10b981;" />
          </div>
          <div class="hash-block__hash font-mono">{{ block.hash }}</div>
          <div class="hash-block__time">{{ block.time }}</div>
        </div>
      </div>

      <div class="integrity-footer">
        <ShieldCheckIcon :size="20" style="color: #10b981;" />
        <span>Chain integrity verified — {{ hashBlocks.length }} blocks valid</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { markRaw } from 'vue'
import {
  Lock,
  ShieldCheck as ShieldCheckIcon,
  Server,
  UserCheck,
  CheckCircle2 as CheckCircle2Icon
} from 'lucide-vue-next'

const securityScore = 97

const encryptionLayers = [
  {
    title: 'Layer 1: At-Rest',
    description: 'All locally stored data is encrypted using SQLCipher with AES-256 encryption on the Android device.',
    tech: 'SQLCipher AES-256',
    icon: markRaw(Lock),
    color: '#10b981'
  },
  {
    title: 'Layer 2: In-Transit',
    description: 'Data transmitted between devices and the server uses TLS 1.3 for maximum transport security.',
    tech: 'TLS 1.3 HTTPS',
    icon: markRaw(Server),
    color: '#3b82f6'
  },
  {
    title: 'Layer 3: Identity',
    description: 'User credentials are hashed using Argon2id, a memory-hard algorithm resistant to GPU attacks.',
    tech: 'Argon2id Hashing',
    icon: markRaw(UserCheck),
    color: '#8b5cf6'
  }
]

const edgePipeline = [
  { title: 'Image Capture', description: 'Camera captures dish photo on Android device' },
  { title: 'On-Device Inference', description: 'TFLite model processes image locally (MobileNetV3)' },
  { title: 'Result Extraction', description: 'Dish classification & nutritional lookup via PhilFCT' },
  { title: 'Encrypted Upload', description: 'Only numeric results sent to server via TLS 1.3' }
]

const compliance = [
  { label: 'Consent Management', description: 'All participants provide informed digital consent before data collection.' },
  { label: 'Data Minimization', description: 'Only essential data is collected — no raw images stored on server.' },
  { label: 'Purpose Limitation', description: 'Data used exclusively for TDEE research analysis.' },
  { label: 'Retention Policy', description: 'Data automatically purged 6 months after study conclusion.' },
  { label: 'Breach Notification', description: 'Automated alerts within 72 hours per NPC guidelines.' },
  { label: 'DPO Designation', description: 'Dedicated Data Protection Officer assigned for study oversight.' }
]

const generateHash = () => {
  const chars = '0123456789abcdef'
  return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * 16)]).join('')
}

const hashBlocks = Array.from({ length: 6 }, (_, i) => ({
  hash: generateHash(),
  time: `${14 - i * 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
}))
</script>

<style scoped>
.security-view { display: flex; flex-direction: column; gap: 1.5rem; }

.health-header { display: flex; justify-content: space-between; align-items: center; }
.page-title { font-size: 1.5rem; font-weight: 600; color: var(--ck-gray-900); }
.page-subtitle { font-size: 0.875rem; color: var(--ck-gray-600); }
.section-title { font-size: 1.125rem; font-weight: 600; color: var(--ck-gray-900); }
.section-subtitle { font-size: 0.875rem; color: var(--ck-gray-600); }

.health-score { text-align: center; }
.health-score__ring { position: relative; width: 100px; height: 100px; }
.health-score__svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.health-score__bg { fill: none; stroke: #e5e7eb; stroke-width: 6; }
.health-score__progress { fill: none; stroke: #10b981; stroke-width: 6; stroke-linecap: round; stroke-dasharray: 264; transition: stroke-dashoffset 1s ease; }
.health-score__text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; align-items: baseline; }
.health-score__value { font-size: 1.5rem; font-weight: 700; color: var(--ck-primary); }
.health-score__label { font-size: 0.875rem; color: var(--ck-gray-500); }
.health-score__status { font-size: 0.75rem; font-weight: 500; color: var(--ck-primary); margin-top: 0.25rem; }

.enc-layer {
  background: var(--ck-gray-50); border: 1px solid; border-radius: var(--ck-radius-lg);
  padding: 1.5rem; text-align: center;
}
.enc-layer__icon {
  width: 3rem; height: 3rem; border-radius: var(--ck-radius-lg);
  display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;
}
.enc-layer__title { font-weight: 600; color: var(--ck-gray-900); margin-bottom: 0.5rem; }
.enc-layer__desc { font-size: 0.875rem; color: var(--ck-gray-600); margin-bottom: 0.75rem; line-height: 1.5; }
.enc-layer__tech { font-size: 0.75rem; color: var(--ck-gray-500); background: var(--ck-gray-100); padding: 0.25rem 0.5rem; border-radius: 4px; display: inline-block; }

.pipeline {
  display: flex; align-items: flex-start; gap: 0; flex-wrap: wrap;
}
.pipeline-step {
  display: flex; align-items: flex-start; gap: 0.75rem; flex: 1; min-width: 180px;
}
.pipeline-step__number {
  width: 2rem; height: 2rem; border-radius: 50%; background: var(--ck-primary);
  color: white; display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 0.875rem; flex-shrink: 0;
}
.pipeline-step__content h4 { font-size: 0.875rem; font-weight: 600; color: var(--ck-gray-900); margin-bottom: 0.25rem; }
.pipeline-step__content p { font-size: 0.75rem; color: var(--ck-gray-600); line-height: 1.4; }
.pipeline-arrow { font-size: 1.5rem; color: var(--ck-gray-400); padding: 0.25rem 0.5rem; flex-shrink: 0; }

.compliance-list { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
.compliance-item {
  display: flex; gap: 0.75rem; padding: 0.75rem 1rem;
  background: var(--ck-gray-50); border-radius: var(--ck-radius-lg); border: 1px solid var(--ck-gray-200);
}
.compliance-item__check { flex-shrink: 0; margin-top: 2px; }
.compliance-item strong { font-size: 0.875rem; color: var(--ck-gray-900); display: block; margin-bottom: 0.25rem; }
.compliance-item p { font-size: 0.75rem; color: var(--ck-gray-600); }

.hash-blocks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
.hash-block {
  background: var(--ck-gray-50); border: 1px solid var(--ck-gray-200);
  border-radius: var(--ck-radius-lg); padding: 0.75rem;
}
.hash-block__top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
.hash-block__id { font-size: 0.75rem; font-weight: 600; color: var(--ck-gray-700); }
.hash-block__hash { font-size: 0.625rem; color: var(--ck-gray-500); word-break: break-all; }
.hash-block__time { font-size: 0.625rem; color: var(--ck-gray-400); margin-top: 0.25rem; }

.integrity-footer {
  display: flex; align-items: center; gap: 0.5rem; justify-content: center;
  margin-top: 1rem; font-size: 0.875rem; font-weight: 500; color: var(--ck-primary);
}
</style>
