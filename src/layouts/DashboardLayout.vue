<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1 font-inter">
    <TopBar @toggle-drawer="toggleLeftDrawer" @logout="handleLogout" />

    <DashboardSidebar v-model="leftDrawerOpen" @logout="handleLogout" />

    <q-page-container>
      <div class="q-pa-md q-pa-lg-xl">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'
import TopBar from 'components/dashboard/TopBar.vue'
import DashboardSidebar from 'components/dashboard/DashboardSidebar.vue'

const leftDrawerOpen = ref(false)
const router = useRouter()
const $q = useQuasar()

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleLogout = async () => {
  try {
    await supabase.auth.signOut()
    $q.notify({
      type: 'positive',
      message: 'Logged out successfully',
      color: 'green-9',
      position: 'top',
    })
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
.font-inter {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}
</style>
