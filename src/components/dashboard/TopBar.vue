<template>
  <q-header class="bg-white text-grey-9 border-bottom-grey" height-hint="64">
    <q-toolbar class="q-px-lg" style="height: 64px">
      <!-- Left: Menu + Logo -->
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="$emit('toggle-drawer')"
        class="text-grey-7 q-mr-sm"
      />

      <div class="row items-center no-wrap cursor-pointer" @click="$router.push('/dashboard')">
        <q-icon name="school" size="sm" color="primary" />
        <div class="text-subtitle1 text-weight-bold q-ml-sm text-grey-9">ClassMaster</div>
      </div>

      <q-space />

      <!-- Center/Right: Search -->
      <div class="gt-xs q-mr-md" style="min-width: 300px">
        <q-input
          outlined
          dense
          v-model="search"
          placeholder="Search..."
          class="bg-grey-1 rounded-borders"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>
      </div>

      <!-- Right Actions -->
      <div class="row items-center q-gutter-sm">
        <q-btn flat round dense icon="notifications_none" color="grey-7">
          <q-badge color="red" floating rounded mini />
        </q-btn>

        <!-- Profile Avatar -->
        <q-avatar size="36px" class="cursor-pointer q-ml-sm">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup to="/dashboard/profile">
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('logout')">
                <q-item-section class="text-red">Sign Out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
defineEmits(['toggle-drawer', 'logout'])
</script>

<style scoped>
.border-bottom-grey {
  border-bottom: 1px solid #e0e0e0;
}
.rounded-borders {
  border-radius: 8px;
}
:deep(.q-field__control) {
  border-radius: 8px;
  border-color: transparent;
}
:deep(.q-field--outlined .q-field__control:before) {
  border: 1px solid transparent;
}
:deep(.q-field--focused .q-field__control:after) {
  border-width: 1px;
}
</style>
