<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Logo -->
      <div class="sidebar__header">
        <div class="sidebar__logo">
          <div class="sidebar__logo-icon">
            <span>CK</span>
          </div>
          <div class="sidebar__logo-text">
            <h2>CalorieKo</h2>
            <p>Research Portal</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar__nav">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="sidebar__nav-item"
          :class="{ 'sidebar__nav-item--active': isActive(item.routeName) }"
        >
          <component :is="item.icon" class="sidebar__nav-icon" />
          <span>{{ item.name }}</span>
        </router-link>
      </nav>

      <!-- Version Footer -->
      <div class="sidebar__footer">
        <p class="sidebar__version font-mono">v1.0.2-Stable</p>
        <p class="sidebar__status">System Operational</p>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main">
      <!-- Top Header Bar -->
      <header class="topbar">
        <div class="topbar__left">
          <h1 class="topbar__title">{{ pageTitle }}</h1>
          <div class="topbar__location">
            <MapPinIcon class="topbar__location-icon" />
            <span>Node Location: Tagum City, Davao</span>
          </div>
        </div>
        <div class="topbar__encryption">
          <LockIcon class="topbar__encryption-icon" />
          <span>System Encryption: Active</span>
        </div>
      </header>

      <!-- Page Content -->
      <main class="content custom-scrollbar">
        <div class="content__inner">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Brain,
  Cpu,
  FileText,
  Shield,
  Users,
  FileBarChart,
  MapPin as MapPinIcon,
  Lock as LockIcon
} from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: 'Overview', icon: LayoutDashboard, to: '/dashboard', routeName: 'Overview' },
  { name: 'AI Model Lab', icon: Brain, to: '/dashboard/ai-model-lab', routeName: 'AIModelLab' },
  { name: 'IoT Hardware', icon: Cpu, to: '/dashboard/iot-hardware', routeName: 'IoTHardware' },
  { name: 'System Logs', icon: FileText, to: '/dashboard/system-logs', routeName: 'SystemLogs' },
  { name: 'Security', icon: Shield, to: '/dashboard/security', routeName: 'Security' },
  { name: 'User Management', icon: Users, to: '/dashboard/user-management', routeName: 'UserManagement' },
  { name: 'Report Generator', icon: FileBarChart, to: '/dashboard/report-generator', routeName: 'ReportGenerator' }
]

const isActive = (routeName) => route.name === routeName

const pageTitle = computed(() => {
  const currentNav = navItems.find(item => item.routeName === route.name)
  if (route.name === 'Overview') return 'Research Overview'
  return currentNav?.name || 'Dashboard'
})
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  background: var(--ck-bg);
  color: var(--ck-gray-800);
}

/* --- Sidebar --- */
.sidebar {
  width: var(--ck-sidebar-width);
  background: var(--ck-surface);
  border-right: 1px solid rgba(209, 213, 219, 0.5);
  display: flex;
  flex-direction: column;
  box-shadow: var(--ck-shadow-lg);
  flex-shrink: 0;
}

.sidebar__header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(209, 213, 219, 0.5);
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sidebar__logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--ck-primary);
  border-radius: var(--ck-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar__logo-icon span {
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
}

.sidebar__logo-text h2 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ck-gray-900);
  line-height: 1.25;
}

.sidebar__logo-text p {
  font-size: 0.75rem;
  color: var(--ck-gray-500);
}

.sidebar__nav {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
}

.sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--ck-radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ck-gray-600);
  transition: all var(--ck-transition-base);
  text-decoration: none;
}

.sidebar__nav-item:hover {
  background: var(--ck-gray-100);
  color: var(--ck-gray-900);
}

.sidebar__nav-item--active {
  background: var(--ck-primary) !important;
  color: white !important;
  box-shadow: var(--ck-shadow-lg);
}

.sidebar__nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.sidebar__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(209, 213, 219, 0.5);
}

.sidebar__version {
  font-size: 0.75rem;
  color: var(--ck-gray-500);
}

.sidebar__status {
  font-size: 0.75rem;
  color: var(--ck-gray-400);
  margin-top: 0.25rem;
}

/* --- Main Area --- */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.topbar {
  height: var(--ck-header-height);
  background: var(--ck-surface);
  border-bottom: 1px solid rgba(209, 213, 219, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-shadow: var(--ck-shadow-sm);
  flex-shrink: 0;
}

.topbar__left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.topbar__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ck-gray-900);
}

.topbar__location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--ck-gray-600);
}

.topbar__location-icon {
  width: 1rem;
  height: 1rem;
}

.topbar__encryption {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--ck-primary-light);
  border: 1px solid var(--ck-primary-border);
  padding: 0.5rem 1rem;
  border-radius: var(--ck-radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ck-primary);
}

.topbar__encryption-icon {
  width: 1rem;
  height: 1rem;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.content__inner {
  max-width: 80rem;
  margin: 0 auto;
}
</style>
