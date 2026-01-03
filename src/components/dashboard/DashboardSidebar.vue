<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    show-if-above
    side="left"
    bordered
    class="bg-white"
    :width="260"
  >
    <div class="column full-height">
      <q-scroll-area class="col">
        <q-list padding class="text-grey-8">
          <q-item-label
            header
            class="text-grey-6 text-uppercase text-weight-bold text-caption q-pl-md q-mb-sm"
            >MAIN MENU</q-item-label
          >

          <q-item
            clickable
            v-ripple
            v-for="link in mainLinks"
            :key="link.title"
            :to="link.route"
            active-class="bg-blue-1 text-primary text-weight-bold rounded-borders"
            class="q-mx-sm q-mb-xs rounded-borders transition-colors"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>{{ link.title }}</q-item-section>
          </q-item>

          <q-separator class="q-my-md q-mx-md" />

          <q-item-label
            header
            class="text-grey-6 text-uppercase text-weight-bold text-caption q-pl-md q-mb-sm"
            >MANAGEMENT</q-item-label
          >

          <q-item
            clickable
            v-ripple
            v-for="link in managementLinks"
            :key="link.title"
            :to="link.route"
            active-class="bg-blue-1 text-primary text-weight-bold rounded-borders"
            class="q-mx-sm q-mb-xs rounded-borders transition-colors"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>{{ link.title }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>
  </q-drawer>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
})
defineEmits(['update:modelValue', 'logout'])

const mainLinks = [{ title: 'Dashboard', icon: 'grid_view', route: '/dashboard' }]

const managementLinks = [
  { title: 'Users', icon: 'people', route: '/dashboard/users' },
  { title: 'Classes & Subjects', icon: 'menu_book', route: '/dashboard/classes' },
  { title: 'Students', icon: 'school', route: '/dashboard/students' },
  { title: 'Attendance', icon: 'fact_check', route: '/dashboard/attendance' },
  { title: 'Payments', icon: 'payments', route: '/dashboard/payments' },
  { title: 'Exams', icon: 'assignment', route: '/dashboard/exams' },
]
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
.border-top-grey {
  border-top: 1px solid #e0e0e0;
}
.transition-colors {
  transition:
    background-color 0.2s,
    color 0.2s;
}
</style>
