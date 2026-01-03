<template>
  <q-page class="q-pa-lg text-grey-9">
    <div class="row items-center justify-between q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-my-none">Student Management</h1>
      <q-btn
        color="black"
        icon="add"
        label="Register Student"
        no-caps
        unelevated
        @click="openRegister"
      />
    </div>

    <q-card flat class="bg-white rounded-lg shadow-sm">
      <q-table
        :rows="students"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :filter="filter"
      >
        <template v-slot:top-right>
          <q-input
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
            outlined
            class="q-mr-md"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="text-weight-bold">{{ props.row.profile?.full_name || 'N/A' }}</div>
            <div class="text-caption text-grey">{{ props.row.profile?.email }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn
              flat
              round
              dense
              icon="class"
              color="indigo"
              size="sm"
              @click="openEnrollments(props.row)"
            >
              <q-tooltip>Manage Classes</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="grey-7"
              size="sm"
              @click="openEdit(props.row)"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="red-5"
              size="sm"
              @click="deleteStudent(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Register Student Dialog -->
    <q-dialog v-model="registerDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Register New Student</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-md">
          <div class="text-subtitle2 text-grey-7">Account Details</div>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input v-model="newStudent.email" label="Email" dense outlined />
            </div>
            <div class="col-6">
              <q-input
                v-model="newStudent.password"
                label="Password"
                type="password"
                dense
                outlined
              />
            </div>
          </div>
          <q-input v-model="newStudent.full_name" label="Full Name" dense outlined />

          <q-separator class="q-my-sm" />

          <div class="text-subtitle2 text-grey-7">Student Details</div>
          <q-input v-model="newStudent.school" label="School" dense outlined />
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input v-model="newStudent.parent_name" label="Parent Name" dense outlined />
            </div>
            <div class="col-6">
              <q-input v-model="newStudent.contact_number" label="Contact No" dense outlined />
            </div>
          </div>
          <q-input v-model="newStudent.address" label="Address" dense outlined />
          <q-input
            v-model="newStudent.date_of_birth"
            label="Date of Birth"
            type="date"
            stack-label
            dense
            outlined
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="black" label="Register" @click="registerStudent" :loading="submitting" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Enrollments Dialog -->
    <q-dialog v-model="enrollmentDialog" full-height position="right">
      <q-card class="column" style="width: 400px">
        <q-card-section class="bg-grey-1">
          <div class="text-h6">Enrollments</div>
          <div class="text-caption" v-if="selectedStudent">
            {{ selectedStudent.profile?.full_name }} ({{ selectedStudent.student_number }})
          </div>
        </q-card-section>

        <q-card-section class="col q-pa-none scroll">
          <q-list separator>
            <q-item v-for="cls in allClasses" :key="cls.id">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ cls.subject?.name }}</q-item-label>
                <q-item-label caption
                  >{{ cls.grade }} - {{ cls.day_of_week }} {{ cls.start_time }}</q-item-label
                >
                <q-item-label caption class="text-indigo"
                  >Fee: Rs. {{ cls.monthly_fee }}</q-item-label
                >
              </q-item-section>
              <q-item-section side>
                <q-btn
                  :icon="isEnrolled(cls.id) ? 'check_circle' : 'add_circle'"
                  :color="isEnrolled(cls.id) ? 'green' : 'grey-4'"
                  flat
                  round
                  @click="toggleEnrollment(cls)"
                  :loading="enrollLoading === cls.id"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1">
          <q-btn flat label="Close" v-close-popup color="black" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'
import { createClient } from '@supabase/supabase-js'

const $q = useQuasar()
const students = ref([])
const allClasses = ref([])
const enrollments = ref([]) // Current student enrollments
const loading = ref(true)
const submitting = ref(false)
const filter = ref('')

const registerDialog = ref(false)
const enrollmentDialog = ref(false)
const selectedStudent = ref(null)
const enrollLoading = ref(null)

const newStudent = ref({
  email: '',
  password: 'password123', // Default
  full_name: '',
  school: '',
  parent_name: '',
  contact_number: '',
  address: '',
  date_of_birth: '',
})

const columns = [
  {
    name: 'student_number',
    label: 'Student ID',
    field: 'student_number',
    align: 'left',
    sortable: true,
  },
  { name: 'name', label: 'Name / Email', field: 'id', align: 'left', sortable: true },
  { name: 'school', label: 'School', field: 'school', align: 'left' },
  { name: 'parent_name', label: 'Parent', field: 'parent_name', align: 'left' },
  { name: 'contact_number', label: 'Contact', field: 'contact_number', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const fetchData = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('students')
    .select(`*, profile:profiles(*)`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error fetching students' })
  } else {
    students.value = data
  }
  loading.value = false
}

const openRegister = () => {
  newStudent.value = {
    email: '',
    password: 'password123',
    full_name: '',
    school: '',
    parent_name: '',
    contact_number: '',
    address: '',
    date_of_birth: '',
  }
  registerDialog.value = true
}

const registerStudent = async () => {
  if (!newStudent.value.email || !newStudent.value.full_name) {
    return $q.notify({ type: 'warning', message: 'Email and Name are required' })
  }

  submitting.value = true

  try {
    // 1. Create Auth User (Using Temp Client)
    const tempClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })

    const { data: authData, error: authError } = await tempClient.auth.signUp({
      email: newStudent.value.email,
      password: newStudent.value.password,
      options: {
        data: {
          role: 'student',
          full_name: newStudent.value.full_name,
        },
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('User creation failed')

    // 2. Wait for Profile Trigger (Short delay to ensure profile exists)
    await new Promise((r) => setTimeout(r, 1500))

    // 3. Insert Student Details
    const { error: stuError } = await supabase.from('students').insert([
      {
        profile_id: authData.user.id,
        school: newStudent.value.school,
        parent_name: newStudent.value.parent_name,
        contact_number: newStudent.value.contact_number,
        address: newStudent.value.address,
        date_of_birth: newStudent.value.date_of_birth || null,
      },
    ])

    if (stuError) {
      // If this fails, we have an orphan profile.
      // Ideally we should rollback (delete user), but for now just notify.
      console.error('Student details insert failed', stuError)
      throw new Error('Created user but failed to save student details: ' + stuError.message)
    }

    $q.notify({ type: 'positive', message: 'Student registered successfully' })
    registerDialog.value = false
    fetchData()
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  } finally {
    submitting.value = false
  }
}

// Enrollments
const openEnrollments = async (student) => {
  selectedStudent.value = student
  enrollmentDialog.value = true

  // Fetch all classes
  const { data: cls } = await supabase
    .from('classes')
    .select(`*, subject:subjects(*)`)
    .order('created_at')
  allClasses.value = cls || []

  // Fetch existing enrollments
  refreshEnrollments()
}

const refreshEnrollments = async () => {
  if (!selectedStudent.value) return
  const { data } = await supabase
    .from('enrollments')
    .select('class_id')
    .eq('student_id', selectedStudent.value.profile_id)
  enrollments.value = data ? data.map((e) => e.class_id) : []
}

const isEnrolled = (classId) => enrollments.value.includes(classId)

const toggleEnrollment = async (cls) => {
  if (!selectedStudent.value) return
  enrollLoading.value = cls.id

  const enrolled = isEnrolled(cls.id)

  if (enrolled) {
    // Unenroll
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .match({ student_id: selectedStudent.value.profile_id, class_id: cls.id })

    if (!error) $q.notify({ type: 'positive', message: 'Unenrolled' })
  } else {
    // Enroll
    const { error } = await supabase.from('enrollments').insert([
      {
        student_id: selectedStudent.value.profile_id,
        class_id: cls.id,
      },
    ])

    if (!error) $q.notify({ type: 'positive', message: 'Enrolled' })
  }

  await refreshEnrollments()
  enrollLoading.value = null
}

const deleteStudent = (student) => {
  $q.dialog({
    title: 'Delete Student',
    message: 'This will delete the student profile and login access. Confirm?',
    cancel: true,
    persistent: true,
    ok: { color: 'red', flat: true, label: 'Delete' },
  }).onOk(async () => {
    // Delete from profiles (Cascades to students table and auth via trigger)
    const { error } = await supabase.from('profiles').delete().eq('id', student.profile_id)
    if (!error) {
      $q.notify({ type: 'positive', message: 'Student deleted' })
      fetchData()
    } else {
      $q.notify({ type: 'negative', message: 'Error deleting: ' + error.message })
    }
  })
}

const openEdit = () => {
  // Todo: Implement edit
  $q.notify({ message: 'Edit feature coming soon', icon: 'info' })
}

onMounted(fetchData)
</script>

<style scoped>
.rounded-lg {
  border-radius: 12px;
}
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
