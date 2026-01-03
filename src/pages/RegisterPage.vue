<template>
  <q-page class="bg-black flex flex-center relative-position overflow-hidden">
    <!-- Background Effects -->
    <div
      class="absolute-bottom-left bg-glow-gradient"
      style="transform: translate(-30%, 30%)"
    ></div>
    <div class="absolute-top-right bg-glow-gradient" style="transform: translate(30%, -30%)"></div>

    <!-- Home Button -->
    <q-btn
      to="/"
      flat
      no-caps
      icon="arrow_back"
      label="Home"
      color="white"
      class="absolute-top-left q-ma-md z-20 hover-scale"
    />

    <q-card
      class="bg-black-translucent border-dark q-pa-xl shadow-2xl relative-position z-10"
      style="width: 100%; max-width: 500px; backdrop-filter: blur(20px)"
    >
      <div class="text-center q-mb-xl">
        <q-icon name="person_add" size="xl" color="white" class="q-mb-md" />
        <div class="text-h4 text-weight-bold text-white q-mb-xs">Join ClassMaster</div>
        <div class="text-grey-5 text-body1">Start your journey with us today</div>
      </div>

      <q-form @submit.prevent="handleRegister" class="q-gutter-md">
        <div class="column q-gutter-y-lg">
          <q-input
            v-model="fullName"
            label="Full Name"
            dark
            outlined
            color="white"
            class="input-dark"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please enter your name']"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="grey-6" />
            </template>
          </q-input>

          <q-input
            v-model="email"
            label="Email Address"
            dark
            outlined
            color="white"
            type="email"
            class="input-dark"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please enter your email']"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="grey-6" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            label="Password"
            dark
            outlined
            color="white"
            type="password"
            class="input-dark"
            lazy-rules
            :rules="[(val) => (val && val.length >= 6) || 'Password must be at least 6 characters']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="grey-6" />
            </template>
          </q-input>
        </div>

        <div class="q-mt-lg"></div>

        <q-btn
          label="Create Account"
          type="submit"
          color="white"
          text-color="black"
          size="lg"
          no-caps
          class="full-width text-weight-bold rounded-lg hover-scale shadow-lg"
          :loading="loading"
        />
      </q-form>

      <div class="text-center q-mt-xl text-grey-6 text-body2">
        Already have an account?
        <router-link
          to="/login"
          class="text-white text-weight-bold hover-underline q-ml-xs"
          style="text-decoration: none"
          >Sign In</router-link
        >
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'

const fullName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const $q = useQuasar()

const handleRegister = async () => {
  console.log('Starting registration check...')
  loading.value = true
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: fullName.value,
        },
      },
    })

    if (error) throw error

    // Create profile entry manually since no trigger is set up yet
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          full_name: fullName.value,
          role: 'student', // Defaulting to student
        },
      ])

      if (profileError) {
        console.error('Error creating profile details:', profileError)
        // Continue anyway, auth is successful
      }
    }

    $q.notify({
      type: 'positive',
      message: 'Account created! Please check your email for verification.',
      position: 'top',
      color: 'green-9',
      icon: 'check_circle',
      timeout: 5000,
    })

    router.push('/login')
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Error creating account',
      position: 'top',
      color: 'red-9',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-black-translucent {
  background: rgba(15, 15, 15, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
}
.bg-glow-gradient {
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.input-dark :deep(.q-field__control) {
  border-radius: 12px;
}
.hover-scale {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.hover-scale:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
}
.hover-underline:hover {
  text-decoration: underline !important;
}
</style>
