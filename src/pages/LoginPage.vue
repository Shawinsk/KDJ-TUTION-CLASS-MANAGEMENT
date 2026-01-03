<template>
  <q-page class="bg-black flex flex-center relative-position overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute-top-left bg-glow-gradient" style="transform: translate(-30%, -30%)"></div>
    <div
      class="absolute-bottom-right bg-glow-gradient"
      style="transform: translate(30%, 30%)"
    ></div>

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
      style="width: 100%; max-width: 450px; backdrop-filter: blur(20px)"
    >
      <div class="text-center q-mb-xl">
        <q-icon name="school" size="xl" color="white" class="q-mb-md" />
        <div class="text-h4 text-weight-bold text-white q-mb-xs">Welcome Back</div>
        <div class="text-grey-5 text-body1">Sign in to access your dashboard</div>
      </div>

      <q-form @submit.prevent="handleLogin" class="q-gutter-md">
        <div class="column q-gutter-y-lg">
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
            :rules="[(val) => (val && val.length > 0) || 'Please enter your password']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="grey-6" />
            </template>
          </q-input>
        </div>

        <div class="row justify-end q-mt-sm q-mb-lg">
          <a
            href="#"
            class="text-grey-5 text-caption hover-text-white transition-colors"
            style="text-decoration: none"
            >Forgot Password?</a
          >
        </div>

        <q-btn
          label="Sign In"
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
        Don't have an account?
        <router-link
          to="/register"
          class="text-white text-weight-bold hover-underline q-ml-xs"
          style="text-decoration: none"
          >Create Account</router-link
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

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const $q = useQuasar()

const handleLogin = async () => {
  loading.value = true
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error

    $q.notify({
      type: 'positive',
      message: 'Successfully logged in!',
      position: 'top',
      color: 'green-9',
      icon: 'check_circle',
    })

    router.push('/dashboard')
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Error logging in',
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
.hover-text-white:hover {
  color: white !important;
}
.transition-colors {
  transition: color 0.3s ease;
}
</style>
