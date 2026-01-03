const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
    ],
  },

  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'profile', component: () => import('pages/dashboard/ProfilePage.vue') },
      { path: 'users', component: () => import('pages/dashboard/UsersPage.vue') },
      { path: 'classes', component: () => import('pages/dashboard/ClassesPage.vue') },
      { path: 'students', component: () => import('pages/dashboard/StudentsPage.vue') },
      { path: 'attendance', component: () => import('pages/dashboard/AttendancePage.vue') },
      { path: 'payments', component: () => import('pages/dashboard/PaymentsPage.vue') },
      { path: 'exams', component: () => import('pages/dashboard/ExamsPage.vue') },
    ],
    meta: { requiresAuth: true },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
