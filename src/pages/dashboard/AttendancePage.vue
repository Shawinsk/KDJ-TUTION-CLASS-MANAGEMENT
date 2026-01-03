<template>
  <q-page class="q-pa-lg text-grey-9">
    <div class="row items-center justify-between q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-my-none">Attendance</h1>
      <div class="text-grey-7">{{ new Date(selectedDate).toDateString() }}</div>
    </div>

    <!-- Filters -->
    <q-card flat class="bg-white rounded-lg q-pa-md q-mb-md shadow-sm">
      <div class="row q-col-gutter-md items-center justify-between">
        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedClass"
            :options="classes"
            option-label="subject_display"
            label="Select Class"
            outlined
            dense
            @update:model-value="fetchAttendanceData"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input
            v-model="selectedDate"
            type="date"
            label="Date"
            outlined
            dense
            @update:model-value="fetchAttendanceData"
          />
        </div>
        <div class="col-12 col-md-auto text-right">
          <div v-if="selectedClass && students.length > 0" class="text-h6 text-weight-bold">
            {{ presentCount }} / {{ students.length }} Present
          </div>
        </div>
      </div>
    </q-card>

    <!-- Student List -->
    <div v-if="loading" class="row justify-center q-py-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="!selectedClass" class="text-center q-pa-xl text-grey-6 text-h6">
      Please select a class to mark attendance.
    </div>

    <div v-else-if="students.length === 0" class="text-center q-pa-xl text-grey-6 text-h6">
      No students enrolled in this class.
    </div>

    <q-card v-else flat class="bg-white rounded-lg shadow-sm">
      <q-list separator>
        <!-- Header -->
        <q-item class="bg-grey-1 text-weight-bold">
          <q-item-section avatar>#</q-item-section>
          <q-item-section>Student Name</q-item-section>
          <q-item-section>ID</q-item-section>
          <q-item-section side>Status</q-item-section>
        </q-item>

        <q-item v-for="(student, index) in students" :key="student.profile_id" v-ripple>
          <q-item-section avatar class="text-grey">{{ index + 1 }}</q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ student.profile?.full_name }}</q-item-label>
            <q-item-label caption>{{ student.profile?.email }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-chip size="sm" color="grey-2">{{ student.student_number || 'N/A' }}</q-chip>
          </q-item-section>
          <q-item-section side>
            <div class="row q-gutter-sm">
              <q-btn
                :color="student.status === 'present' ? 'green' : 'grey-3'"
                :text-color="student.status === 'present' ? 'white' : 'grey-8'"
                label="Present"
                unelevated
                size="sm"
                @click="markStatus(student, 'present')"
              />
              <q-btn
                :color="student.status === 'absent' ? 'red' : 'grey-3'"
                :text-color="student.status === 'absent' ? 'white' : 'grey-8'"
                label="Absent"
                unelevated
                size="sm"
                @click="markStatus(student, 'absent')"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />

      <div class="q-pa-md row justify-between">
        <q-btn flat label="Mark All Present" color="indigo" @click="markAllPresent" />
        <q-btn
          color="black"
          label="Save Attendance"
          unelevated
          class="q-px-xl"
          @click="saveAttendance"
          :loading="saving"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const classes = ref([])
const students = ref([])
const selectedClass = ref(null)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const loading = ref(false)
const saving = ref(false)

const presentCount = computed(() => students.value.filter((s) => s.status === 'present').length)

const fetchClasses = async () => {
  const { data } = await supabase
    .from('classes')
    .select(`*, subject:subjects(*)`)
    .order('created_at', { ascending: false })
  if (data) {
    classes.value = data.map((c) => ({
      ...c,
      subject_display: `${c.subject?.name} - ${c.grade} (${c.day_of_week})`,
    }))
  }
}

const fetchAttendanceData = async () => {
  if (!selectedClass.value) return
  loading.value = true

  // 1. Fetch Enrolled Students for this Class
  // Join enrollments -> students (get student_number) -> profiles (get name)
  // Note: Supabase deep joins can represent this.
  // enrollments contains student_id (profile_id).
  // We need student details from 'students' table too.

  const { data: enrollmentData, error: enrollError } = await supabase.from('enrollments').select(`
            student_id,
            profile:profiles(*),
            student_details:students(*)
        `) // Note: enrollments.student_id FK to profiles. enrollments doesn't FK to students directly but students has profile_id.
  // Usually we join profiles. 'students' table is linked to profile.
  // Let's rely on profiles. If we need student number, we check if 'students' table lookup is needed.
  // Actually, let's fetch 'students' table where profile_id matches.

  // Better Query: Fetch from 'students' table where profile_id is in Enrollments list?
  // Or, Fetch Enrollments, then fetch Students.

  if (enrollError) {
    $q.notify({ type: 'negative', message: 'Error fetching enrollments' })
    loading.value = false
    return
  }

  // 2. Fetch Existing Attendance for Date & Class
  const { data: attendanceData, error: attError } = await supabase
    .from('attendance')
    .select('*')
    .eq('class_id', selectedClass.value.id)
    .eq('date', selectedDate.value)

  if (attError) console.error(attError)

  // 3. Merge Data
  // enrollmentData items: { student_id: 'uuid', profile: {...} }
  // We also need student_number from 'students' table.
  // Let's do a second query for student numbers to be safe/easy.
  const studentIds = enrollmentData.map((e) => e.student_id)
  const { data: studentDetails } = await supabase
    .from('students')
    .select('*')
    .in('profile_id', studentIds)

  students.value = enrollmentData.map((e) => {
    const att = attendanceData?.find((a) => a.student_id === e.student_id)
    const det = studentDetails?.find((s) => s.profile_id === e.student_id)

    return {
      profile_id: e.student_id,
      profile: e.profile,
      student_number: det?.student_number,
      status: att ? att.status : 'absent', // Default to Absent if not marked? Or 'present'? Standard is Absent until marked.
      attendance_id: att?.id, // To Update
    }
  })

  loading.value = false
}

const markStatus = (student, status) => {
  student.status = status
}

const markAllPresent = () => {
  students.value.forEach((s) => (s.status = 'present'))
}

const saveAttendance = async () => {
  saving.value = true

  // Check if we already have rows or need insert
  // Upsert is best. But unique constraint (class_id, student_id, date) handles it.

  const upsertData = students.value.map((s) => ({
    class_id: selectedClass.value.id,
    student_id: s.profile_id,
    date: selectedDate.value,
    status: s.status,
  }))

  const { error } = await supabase
    .from('attendance')
    .upsert(upsertData, { onConflict: 'class_id, student_id, date' })

  if (error) {
    $q.notify({ type: 'negative', message: 'Error saving: ' + error.message })
  } else {
    $q.notify({ type: 'positive', message: 'Attendance saved successfully' })
    fetchAttendanceData() // Refresh
  }
  saving.value = false
}

onMounted(fetchClasses)
</script>

<style scoped>
.rounded-lg {
  border-radius: 12px;
}
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
