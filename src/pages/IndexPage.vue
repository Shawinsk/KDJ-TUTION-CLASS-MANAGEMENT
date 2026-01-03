<template>
  <q-page class="bg-black text-white font-inter">
    <!-- Navbar (Glassy Dark) -->
    <div
      class="fixed-top q-pa-md z-max row justify-between items-center bg-black-translucent blur-effect q-py-lg"
    >
      <div class="row items-center cursor-pointer q-pl-md">
        <q-icon name="school" size="md" color="white" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold tracking-wide">ClassMaster</div>
      </div>

      <div class="q-gutter-xl gt-sm text-grey-4">
        <a href="#" class="nav-link text-weight-medium">Features</a>
        <a href="#" class="nav-link text-weight-medium">Solutions</a>
        <a href="#" class="nav-link text-weight-medium">Open Source</a>
        <a href="#" class="nav-link text-weight-medium">About</a>
      </div>

      <div class="row items-center q-gutter-md q-pr-md" v-if="!user">
        <q-btn flat no-caps label="Log in" class="text-weight-medium text-white" to="/login" />
        <q-btn
          unelevated
          color="white"
          text-color="black"
          label="Get Started"
          no-caps
          to="/register"
          class="q-px-lg rounded-btn text-weight-bold"
        />
      </div>
      <div class="row items-center q-gutter-md q-pr-md" v-else>
        <q-btn
          unelevated
          color="white"
          text-color="black"
          label="Dashboard"
          icon="dashboard"
          no-caps
          to="/dashboard"
          class="q-px-lg rounded-btn text-weight-bold"
        />
      </div>
    </div>

    <!-- Hero Section -->
    <section class="min-h-screen row items-center relative-position overflow-hidden q-pt-xl">
      <div class="container row items-center q-px-md full-width q-pt-xl">
        <!-- Left Content -->
        <div class="col-12 col-md-6 q-pr-md-xl z-1">
          <q-badge
            color="green-9"
            text-color="white"
            label="100% Free & Open Source"
            class="q-mb-lg q-px-sm py-1 shadow-2"
          />

          <h1 class="text-display text-weight-bolder leading-tight q-mb-md animate-fade-up">
            Master Your <br />
            Tuition <br />
            Business
          </h1>

          <p class="text-h6 text-grey-5 q-mb-xl max-w-500 animate-fade-up delay-100">
            Streamline students, payments, and schedules in one unified, high-performance platform.
            Focus on teaching, we handle the rest.
          </p>

          <div class="row q-gutter-md animate-fade-up delay-200">
            <q-btn
              size="lg"
              color="white"
              text-color="black"
              label="Get Started Now"
              no-caps
              to="/register"
              class="q-px-xl rounded-btn hover-scale"
            />
            <q-btn
              size="lg"
              outline
              color="grey-5"
              label="View on GitHub"
              icon="code"
              no-caps
              class="q-px-xl rounded-btn hover-white-border"
            />
          </div>
        </div>

        <!-- Right Visual (Abstract 3D) -->
        <div
          class="col-12 col-md-6 relative-position z-0 flex flex-center animate-fade-in delay-300"
        >
          <!-- Glow Effect behind image -->
          <div class="absolute-center bg-glow-gradient"></div>

          <q-img
            src="~assets/hero-cube.png"
            class="hero-image"
            style="max-width: 100%; width: 600px"
            fit="contain"
          />
        </div>
      </div>
    </section>

    <!-- Brands / Trust Strip -->
    <section class="q-py-lg border-y-dark bg-dark-page">
      <div class="container text-center">
        <div class="text-grey-7 q-mb-md text-caption uppercase tracking-widest">
          Trusted by top institutes
        </div>
        <div
          class="row justify-center q-gutter-xl opacity-50 grayscale hover-grayscale-0 transition-fast"
        >
          <!-- Placeholders for logos -->
          <div class="text-h6 text-grey-6 text-weight-bold">BRAINWORK</div>
          <div class="text-h6 text-grey-6 text-weight-bold">ACADEMY X</div>
          <div class="text-h6 text-grey-6 text-weight-bold">FUTURE LABS</div>
          <div class="text-h6 text-grey-6 text-weight-bold">NEXT GEN</div>
        </div>
      </div>
    </section>

    <!-- Everything in One Place (Grid Section) -->
    <section class="q-py-xl section-pad relative-position">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="text-h3 text-weight-bold q-mb-sm text-white">Everything in One Place</h2>
          <p class="text-grey-5 text-h6 max-w-700 q-mx-auto">
            Replacing multiple fragmented tools with one cohesive operating system.
          </p>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Card 1: Student Management -->
          <div class="col-12 col-md-4">
            <q-card class="bg-black border-dark h-full q-pa-lg hover-border-glow">
              <div class="q-mb-lg">
                <q-icon name="manage_accounts" size="sm" class="text-grey-4" />
              </div>
              <div class="text-h5 text-weight-bold q-mb-sm text-white">Student Management</div>
              <div class="text-grey-5 leading-normal">
                Keep detailed records of student profiles, enrollments, and academic history in one
                secure database.
              </div>
            </q-card>
          </div>

          <!-- Card 2: Smart Scheduling -->
          <div class="col-12 col-md-4">
            <q-card class="bg-black border-dark h-full q-pa-lg hover-border-glow">
              <div class="q-mb-lg">
                <q-icon name="calendar_month" size="sm" class="text-grey-4" />
              </div>
              <div class="text-h5 text-weight-bold q-mb-sm text-white">Smart Scheduling</div>
              <div class="text-grey-5 leading-normal">
                Effortlessly create and manage class timetables, resolving conflicts and handling
                adjustments on the fly.
              </div>
            </q-card>
          </div>

          <!-- Card 3: Automated Payments -->
          <div class="col-12 col-md-4">
            <q-card class="bg-black border-dark h-full q-pa-lg hover-border-glow">
              <div class="q-mb-lg">
                <q-icon name="payments" size="sm" class="text-grey-4" />
              </div>
              <div class="text-h5 text-weight-bold q-mb-sm text-white">Automated Payments</div>
              <div class="text-grey-5 leading-normal">
                Generate invoices, track fee statuses, and send automated reminders to parents via
                SMS and Email.
              </div>
            </q-card>
          </div>

          <!-- Card 4: Attendance Tracking -->
          <div class="col-12 col-md-4">
            <q-card class="bg-black border-dark h-full q-pa-lg hover-border-glow">
              <div class="q-mb-lg">
                <q-icon name="qr_code_scanner" size="sm" class="text-grey-4" />
              </div>
              <div class="text-h5 text-weight-bold q-mb-sm text-white">Attendance Tracking</div>
              <div class="text-grey-5 leading-normal">
                QR-code based or manual attendance marking that syncs instantly with parent
                reporting.
              </div>
            </q-card>
          </div>

          <!-- Card 5: Exam Results -->
          <div class="col-12 col-md-4">
            <q-card class="bg-black border-dark h-full q-pa-lg hover-border-glow">
              <div class="q-mb-lg">
                <q-icon name="bar_chart" size="sm" class="text-grey-4" />
              </div>
              <div class="text-h5 text-weight-bold q-mb-sm text-white">Exam Results</div>
              <div class="text-grey-5 leading-normal">
                Publish exam marks and detailed performance reports directly to the student portal.
              </div>
            </q-card>
          </div>

          <!-- Card 6: Staff Management -->
          <div class="col-12 col-md-4">
            <q-card class="bg-black border-dark h-full q-pa-lg hover-border-glow">
              <div class="q-mb-lg">
                <q-icon name="badge" size="sm" class="text-grey-4" />
              </div>
              <div class="text-h5 text-weight-bold q-mb-sm text-white">Staff Management</div>
              <div class="text-grey-5 leading-normal">
                Manage tutor assignments, payroll, and access permissions with granular control.
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Data-Driven Insights Section -->
    <section class="q-py-xl section-pad bg-black text-white overflow-hidden">
      <div class="container row items-center q-col-gutter-xl">
        <!-- Text Content -->
        <div class="col-12 col-md-6 z-1">
          <h2 class="text-h3 text-weight-bold q-mb-md">Data-Driven Insights</h2>
          <p class="text-h6 text-grey-5 q-mb-lg leading-normal">
            Visualize your institute's performance in real-time. Track revenue, student attendance,
            and enrollment trends with our powerful analytics engine.
          </p>

          <q-list class="q-mb-xl text-grey-4 text-body1">
            <q-item class="q-pl-none">
              <q-item-section avatar style="min-width: 30px">
                <q-icon name="check_circle" color="white" size="xs" />
              </q-item-section>
              <q-item-section>Real-time financial reporting</q-item-section>
            </q-item>
            <q-item class="q-pl-none">
              <q-item-section avatar style="min-width: 30px">
                <q-icon name="check_circle" color="white" size="xs" />
              </q-item-section>
              <q-item-section>Automated attendance tracking</q-item-section>
            </q-item>
            <q-item class="q-pl-none">
              <q-item-section avatar style="min-width: 30px">
                <q-icon name="check_circle" color="white" size="xs" />
              </q-item-section>
              <q-item-section>Growth trend analysis</q-item-section>
            </q-item>
          </q-list>

          <div class="cursor-pointer row items-center group">
            <span class="text-h6 text-weight-bold q-mr-sm group-hover:text-grey-4 transition-colors"
              >Explore Reporting</span
            >
            <q-icon
              name="arrow_forward"
              size="sm"
              class="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>

        <!-- Visual (Dashboard Mockup) -->
        <div class="col-12 col-md-6 relative-position">
          <!-- Decorative glow -->
          <div
            class="absolute-center bg-glow-gradient opacity-20"
            style="width: 100%; height: 100%"
          ></div>

          <q-img
            src="~assets/analytics-mockup.png"
            class="rounded-xl shadow-2xl relative-position hover-scale-sm transition-slow"
            style="border: 1px solid #333"
          />
        </div>
      </div>
    </section>

    <!-- Mobile App Section -->
    <section class="q-py-xl section-pad bg-dark-page relative-position overflow-hidden">
      <div class="container row items-center">
        <div class="col-12 col-md-6 q-pr-md-xl">
          <h2 class="text-h3 text-weight-bold q-mb-md text-white align-left">
            Learning in Their Pocket
          </h2>
          <p class="text-h6 text-grey-5 q-mb-xl max-w-500">
            Give students and parents the modern experience they expect. A dedicated mobile app for
            assignments, schedules, and fee payments.
          </p>
          <div class="row q-gutter-md">
            <q-btn
              no-caps
              class="bg-grey-9 text-white q-px-lg q-py-sm rounded-lg hover-border-glow"
            >
              <div class="row items-center">
                <q-icon name="apple" size="md" class="q-mr-sm" />
                <div class="text-left">
                  <div class="text-caption text-grey-5" style="line-height: 1">Download on</div>
                  <div class="text-subtitle1 text-weight-bold" style="line-height: 1">
                    App Store
                  </div>
                </div>
              </div>
            </q-btn>
            <q-btn
              no-caps
              class="bg-grey-9 text-white q-px-lg q-py-sm rounded-lg hover-border-glow"
            >
              <div class="row items-center">
                <q-icon name="android" size="md" class="q-mr-sm" />
                <div class="text-left">
                  <div class="text-caption text-grey-5" style="line-height: 1">Get it on</div>
                  <div class="text-subtitle1 text-weight-bold" style="line-height: 1">
                    Google Play
                  </div>
                </div>
              </div>
            </q-btn>
          </div>
        </div>
        <div class="col-12 col-md-6 relative-position q-mt-xl q-mt-md-none flex flex-center">
          <div class="absolute-center bg-glow-gradient opacity-30"></div>
          <q-img
            src="~assets/app-mockup.png"
            class="rounded-xl shadow-2xl relative-position"
            style="max-width: 350px"
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="q-py-xl section-pad relative-position text-center">
      <div class="container">
        <h2 class="text-h2 text-weight-bold text-white q-mb-md">Ready to Get Started?</h2>
        <p class="text-h6 text-grey-5 q-mb-xl max-w-700 q-mx-auto">
          Join hundreds of forward-thinking tuition classes managing their business with
          ClassMaster.
        </p>

        <div class="column items-center">
          <q-btn
            size="xl"
            color="white"
            text-color="black"
            label="Download Now"
            no-caps
            class="q-px-xl rounded-btn text-weight-bold shadow-2 hover-scale"
          />
          <div class="text-caption text-grey-6 q-mt-md tracking-wide">
            100% Free · Open Source · MIT License
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black text-white q-py-xl border-top-dark">
      <div class="container q-pa-md">
        <div class="row justify-between items-start">
          <div class="col-12 col-md-4">
            <div class="row items-center q-mb-md">
              <q-icon name="school" size="sm" color="white" class="q-mr-sm" />
              <span class="text-weight-bold text-h6">ClassMaster</span>
            </div>
            <p class="text-grey-6">Empowering educators with next-gen management tools.</p>
          </div>
          <div class="col-12 col-md-8 row justify-end q-gutter-xl text-grey-5">
            <div class="column q-gutter-sm">
              <div class="text-white text-weight-bold q-mb-sm">Product</div>
              <a href="#" class="footer-link">Features</a>
              <a href="#" class="footer-link">Open Source</a>
            </div>
            <div class="column q-gutter-sm">
              <div class="text-white text-weight-bold q-mb-sm">Company</div>
              <a href="#" class="footer-link">About</a>
              <a href="#" class="footer-link">Careers</a>
            </div>
            <div class="column q-gutter-sm">
              <div class="text-white text-weight-bold q-mb-sm">Legal</div>
              <a href="#" class="footer-link">Privacy</a>
              <a href="#" class="footer-link">Terms</a>
            </div>
          </div>
        </div>
        <div class="q-mt-xl text-center text-grey-8 text-caption">
          &copy; 2026 ClassMaster Systems. All rights reserved.
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'

const user = ref(null)

onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  user.value = session?.user || null

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
})
</script>

<style scoped>
/* Font & Utilities */
.font-inter {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}

.text-display {
  font-size: 5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

@media (max-width: 600px) {
  .text-display {
    font-size: 3rem;
  }
}

.container {
  max-width: 1280px;
  margin: 0 auto;
}

.max-w-500 {
  max-width: 500px;
}

/* Colors & Backgrounds */
.bg-black-translucent {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.bg-dark-page {
  background-color: #0a0a0a;
}

.border-y-dark {
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
}

.border-top-dark {
  border-top: 1px solid #222;
}

/* Effects */
.bg-glow-gradient {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0) 70%);
  border-radius: 50%;
  filter: blur(40px);
}

.hover-border-light {
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}
.hover-border-light:hover {
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.hover-white-border:hover {
  border-color: white !important;
  color: white !important;
}

.hover-scale {
  transition: transform 0.2s;
}
.hover-scale:hover {
  transform: scale(1.05);
}

.rounded-btn {
  border-radius: 50px;
}
.rounded-xl {
  border-radius: 24px;
}

/* Navigation */
.nav-link {
  color: #a1a1aa;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-link:hover {
  color: white;
}

.footer-link {
  color: #71717a;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover {
  color: white;
}

/* Animations */
.animate-fade-up {
  animation: fadeUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.animate-fade-in {
  animation: fadeIn 1.2s ease-out forwards;
  opacity: 0;
}

.delay-100 {
  animation-delay: 0.1s;
}
.delay-200 {
  animation-delay: 0.2s;
}
.delay-300 {
  animation-delay: 0.3s;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.hero-image {
  filter: drop-shadow(0 20px 50px rgba(0, 0, 0, 0.5));
}

.border-dark {
  border: 1px solid #222;
}

.hover-border-glow {
  transition: all 0.3s ease;
}
.hover-border-glow:hover {
  border-color: #666;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

.leading-normal {
  line-height: 1.5;
}

.h-full {
  height: 100%;
}

.hover-scale-sm:hover {
  transform: scale(1.02);
}

.transition-slow {
  transition: transform 0.5s ease;
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(5px);
}
</style>
