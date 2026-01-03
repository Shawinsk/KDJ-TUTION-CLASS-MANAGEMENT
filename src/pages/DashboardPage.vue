<template>
  <q-page class="bg-transparent text-grey-9 q-pb-xl">
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none text-grey-10">Dashboard</h1>
        <div class="text-grey-6 text-body1 q-mt-xs">
          Welcome back, here's what's happening today.
        </div>
      </div>
      <div>
        <q-btn
          unelevated
          color="black"
          text-color="white"
          icon="add"
          label="New Enrollment"
          no-caps
          class="rounded-borders q-px-md"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-3" v-for="(stat, index) in stats" :key="index">
        <q-card flat class="bg-white rounded-lg shadow-sm hover-shadow full-height">
          <q-card-section class="q-pa-lg">
            <div class="row items-start justify-between">
              <div>
                <div
                  class="text-caption text-grey-6 text-uppercase text-weight-bold letter-spacing-1 q-mb-sm"
                >
                  {{ stat.title }}
                </div>
                <div class="text-h4 text-weight-bold text-grey-9">{{ stat.value }}</div>
                <div class="q-mt-sm row items-center text-caption font-weight-medium">
                  <span :class="stat.trendColor" class="row items-center q-mr-xs">
                    <q-icon :name="stat.trendIcon" size="xs" class="q-mr-xs" />
                    {{ stat.trendValue }}
                  </span>
                  <span class="text-grey-5">from last month</span>
                </div>
              </div>
              <div
                :class="`bg-${stat.color}-1 text-${stat.color}-7`"
                class="q-pa-md rounded-circle row flex-center"
                style="width: 50px; height: 50px"
              >
                <q-icon :name="stat.icon" size="sm" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="row q-col-gutter-lg">
      <!-- Recent Enrollments (Left - Wide) -->
      <div class="col-12 col-md-8">
        <q-card flat class="bg-white rounded-lg shadow-sm full-height">
          <q-card-section class="row items-center justify-between q-pb-none col-header">
            <div class="text-h6 text-weight-bold text-grey-9">Recent Enrollments</div>
            <q-btn flat dense no-caps label="View All" color="grey-7" class="text-weight-medium" />
          </q-card-section>

          <div v-if="recentEnrollments.length === 0" class="text-center q-py-xl text-grey-5">
            <q-icon name="assignment_ind" size="lg" class="q-mb-sm opacity-50" />
            <div>No recent enrollments found</div>
          </div>

          <q-list separator v-else>
            <q-item v-for="(student, i) in recentEnrollments" :key="i" class="q-py-md">
              <q-item-section avatar>
                <q-avatar size="42px" color="grey-2" text-color="grey-7" class="text-weight-bold">
                  {{ student.avatar }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-grey-9 text-subtitle1">{{
                  student.name
                }}</q-item-label>
                <q-item-label caption class="text-grey-6">{{ student.details }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge
                  color="green-1"
                  text-color="green-8"
                  class="q-px-sm q-py-xs font-weight-bold rounded-sm"
                >
                  Active
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Today's Schedule (Right - Narrow) -->
      <div class="col-12 col-md-4">
        <q-card flat class="bg-white rounded-lg shadow-sm full-height">
          <q-card-section class="q-pb-md col-header">
            <div class="text-h6 text-weight-bold text-grey-9">Today's Schedule</div>
          </q-card-section>

          <div v-if="todaysSchedule.length === 0" class="text-center q-py-xl text-grey-5">
            <q-icon name="event_busy" size="lg" class="q-mb-sm opacity-50" />
            <div>No classes scheduled today</div>
          </div>

          <div class="q-px-md q-pb-md" v-else>
            <div
              v-for="(cls, i) in todaysSchedule"
              :key="i"
              class="row no-wrap items-start q-mb-md"
            >
              <div class="text-caption text-grey-5 q-mt-xs q-mr-md" style="min-width: 60px">
                {{ cls.time }}
              </div>
              <div class="bg-blue-1 text-primary rounded-borders q-pa-md full-width">
                <div class="text-weight-bold">{{ cls.subject }}</div>
                <div class="text-caption text-blue-8">{{ cls.hall }}</div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
  {
    title: 'Total Students',
    value: '0',
    icon: 'school',
    color: 'blue',
    trendValue: '0%',
    trendIcon: 'trending_flat',
    trendColor: 'text-grey-6',
  },
  {
    title: 'Active Classes',
    value: '0',
    icon: 'class',
    color: 'orange',
    trendValue: '0%',
    trendIcon: 'trending_flat',
    trendColor: 'text-grey-6',
  },
  {
    title: 'Monthly Revenue',
    value: '$0',
    icon: 'attach_money',
    color: 'green',
    trendValue: '0%',
    trendIcon: 'trending_flat',
    trendColor: 'text-grey-6',
  },
  {
    title: 'New Tutors',
    value: '0',
    icon: 'person',
    color: 'purple',
    trendValue: '0%',
    trendIcon: 'trending_flat',
    trendColor: 'text-grey-6',
  },
])

const recentEnrollments = ref([])
const todaysSchedule = ref([])
</script>

<style scoped>
.rounded-lg {
  border-radius: 12px;
}
.rounded-circle {
  border-radius: 50%;
}
.rounded-sm {
  border-radius: 6px;
}
.rounded-borders {
  border-radius: 8px;
}
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.hover-shadow:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
.letter-spacing-1 {
  letter-spacing: 0.5px;
}
.col-header {
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 16px;
}
.opacity-50 {
  opacity: 0.5;
}
</style>
