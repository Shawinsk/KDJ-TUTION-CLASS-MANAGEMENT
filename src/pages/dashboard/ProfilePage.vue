<template>
  <q-page class="bg-transparent text-grey-9 q-pb-xl">
    <div class="row q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-my-none text-grey-10">My Profile</h1>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Left Side: Profile Card -->
      <div class="col-12 col-md-4">
        <q-card flat class="bg-white rounded-lg shadow-sm text-center q-pa-lg full-height">
          <div class="q-mb-md">
            <q-avatar size="120px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </div>

          <div class="text-h5 text-weight-bold q-mb-xs">{{ userName }}</div>
          <div class="text-grey-6 q-mb-sm">{{ userEmail }}</div>

          <q-chip color="black" text-color="white" size="sm" class="text-weight-bold q-px-md"
            >Administrator</q-chip
          >

          <q-separator class="q-my-lg" />

          <div class="text-left">
            <div
              class="text-caption text-grey-5 text-weight-bold text-uppercase q-mb-md letter-spacing-1"
            >
              Details
            </div>

            <div class="row items-center q-mb-sm">
              <q-icon name="mail" size="xs" color="grey-5" class="q-mr-sm" />
              <div class="text-grey-7">{{ userEmail }}</div>
            </div>
            <div class="row items-center q-mb-sm">
              <q-icon name="calendar_today" size="xs" color="grey-5" class="q-mr-sm" />
              <div class="text-grey-7">Joined {{ joinDate }}</div>
            </div>
            <div class="row items-center text-green-6">
              <q-icon name="verified" size="xs" class="q-mr-sm" />
              <div class="text-weight-medium">Verified Account</div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Right Side: Tabs & Form -->
      <div class="col-12 col-md-8">
        <q-card flat class="bg-white rounded-lg shadow-sm full-height">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="black"
            indicator-color="black"
            align="left"
            narrow-indicator
            content-class="text-weight-bold"
          >
            <q-tab name="general" label="General Information" class="text-weight-bold q-px-lg" />
            <q-tab name="security" label="Security" class="text-weight-bold q-px-lg" />
            <q-tab name="preferences" label="Preferences" class="text-weight-bold q-px-lg" />
          </q-tabs>
          <q-separator color="grey-2" />

          <q-tab-panels v-model="tab" animated class="q-pa-md">
            <q-tab-panel name="general">
              <div class="text-h6 text-weight-bold q-mb-lg">Personal Details</div>

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12 col-md-6">
                  <label class="text-grey-7 text-caption text-weight-bold q-mb-xs block"
                    >First Name</label
                  >
                  <q-input v-model="form.firstName" outlined dense class="bg-white rounded-input" />
                </div>
                <div class="col-12 col-md-6">
                  <label class="text-grey-7 text-caption text-weight-bold q-mb-xs block"
                    >Last Name</label
                  >
                  <q-input v-model="form.lastName" outlined dense class="bg-white rounded-input" />
                </div>
                <div class="col-12">
                  <label class="text-grey-7 text-caption text-weight-bold q-mb-xs block"
                    >Bio / About</label
                  >
                  <q-input
                    v-model="form.bio"
                    type="textarea"
                    outlined
                    dense
                    rows="3"
                    class="bg-white rounded-input"
                  />
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn
                  unelevated
                  color="black"
                  text-color="white"
                  label="Save Changes"
                  no-caps
                  class="q-px-lg rounded-borders"
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="security">
              <div class="text-h6 q-mb-md">Security Settings</div>
              <p class="text-grey-7">Change your password and configure security options.</p>
              <div class="row q-col-gutter-md" style="max-width: 400px">
                <div class="col-12">
                  <q-input label="Current Password" type="password" outlined dense />
                </div>
                <div class="col-12">
                  <q-input label="New Password" type="password" outlined dense />
                </div>
                <div class="col-12">
                  <q-btn unelevated color="black" label="Update Password" no-caps />
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="preferences">
              <div class="text-h6 q-mb-md">Preferences</div>
              <q-toggle
                v-model="prefs.notifications"
                label="Enable Email Notifications"
                color="black"
              />
              <q-toggle v-model="prefs.darkMode" label="Dark Mode" color="black" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'
import { supabase } from 'boot/supabase'

const tab = ref('general')
const userEmail = ref('')
const userName = ref('User')
const joinDate = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  bio: 'Administrator of the Tuition Management System.',
})
const prefs = ref({
  notifications: true,
  darkMode: false,
})

onMounted(async () => {
  // Fetch logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    userEmail.value = user.email
    // Format date: Jan 1, 2026
    joinDate.value = date.formatDate(user.created_at, 'MMM D, YYYY')

    // Get name from metadata or default
    // In register page we saved { full_name: ... } to user_metadata
    const metaName = user.user_metadata?.full_name || 'Admin User'
    userName.value = metaName

    // Populate form
    const names = metaName.split(' ')
    form.value.firstName = names[0] || ''
    form.value.lastName = names.slice(1).join(' ') || ''
  }
})
</script>

<style scoped>
.rounded-lg {
  border-radius: 12px;
}
.rounded-borders {
  border-radius: 8px;
}
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.letter-spacing-1 {
  letter-spacing: 0.5px;
}

/* Clean input borders */
:deep(.q-field--outlined .q-field__control) {
  border-radius: 6px;
}
:deep(.q-tab__label) {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}
</style>
