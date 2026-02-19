import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Overview',
                component: () => import('../views/OverviewView.vue')
            },
            {
                path: 'ai-model-lab',
                name: 'AIModelLab',
                component: () => import('../views/AIModelLabView.vue')
            },
            {
                path: 'iot-hardware',
                name: 'IoTHardware',
                component: () => import('../views/IoTHardwareView.vue')
            },
            {
                path: 'system-logs',
                name: 'SystemLogs',
                component: () => import('../views/SystemLogsView.vue')
            },
            {
                path: 'security',
                name: 'Security',
                component: () => import('../views/SecurityView.vue')
            },
            {
                path: 'user-management',
                name: 'UserManagement',
                component: () => import('../views/UserManagementView.vue')
            },
            {
                path: 'report-generator',
                name: 'ReportGenerator',
                component: () => import('../views/ReportGeneratorView.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard for auth simulation
router.beforeEach((to, from, next) => {
    const isLoggedIn = sessionStorage.getItem('ck_logged_in') === 'true'

    if (to.meta.requiresAuth && !isLoggedIn) {
        next({ name: 'Login' })
    } else if (to.name === 'Login' && isLoggedIn) {
        next({ name: 'Overview' })
    } else {
        next()
    }
})

export default router
