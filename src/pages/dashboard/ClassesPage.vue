<template>
  <q-page class="q-pa-lg text-grey-9">
    <div class="row items-center justify-between q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-my-none">Class Management</h1>
    </div>

    <q-card flat class="bg-white rounded-lg shadow-sm">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="black"
        indicator-color="black"
        align="left"
        narrow-indicator
      >
        <q-tab name="classes" label="Active Classes" no-caps />
        <q-tab name="subjects" label="Subjects" no-caps />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Classes Tab -->
        <q-tab-panel name="classes" class="q-pa-md">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6 text-weight-regular text-grey-7">Manage tuition classes</div>
            <q-btn
              color="black"
              icon="add"
              label="Create Class"
              no-caps
              @click="openAddClass"
              unelevated
            />
          </div>

          <q-table
            :rows="classes"
            :columns="classColumns"
            row-key="id"
            flat
            :loading="loadingClasses"
          >
            <template v-slot:body-cell-tutor="props">
              <q-td :props="props">
                <div class="row items-center">
                  <q-avatar size="sm" color="grey-2" icon="person" class="q-mr-sm text-grey-7" />
                  {{ props.row.tutor?.full_name || 'N/A' }}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-subject="props">
              <q-td :props="props">
                <q-badge color="blue-1" text-color="blue-9" class="q-px-sm">
                  {{ props.row.subject?.name }}
                </q-badge>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" auto-width>
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="grey-7"
                  size="sm"
                  @click="openEditClass(props.row)"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="red-5"
                  size="sm"
                  @click="deleteClass(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Subjects Tab -->
        <q-tab-panel name="subjects" class="q-pa-md">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6 text-weight-regular text-grey-7">Manage subjects</div>
            <q-btn
              color="black"
              icon="add"
              label="Add Subject"
              no-caps
              @click="openAddSubject"
              unelevated
            />
          </div>

          <q-list separator bordered class="rounded-borders">
            <q-item v-for="sub in subjects" :key="sub.id" class="q-py-md">
              <q-item-section avatar>
                <q-avatar color="indigo-1" text-color="indigo" icon="book" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ sub.name }}</q-item-label>
                <q-item-label caption>Code: {{ sub.code || 'N/A' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="grey-7"
                  size="sm"
                  @click="openEditSubject(sub)"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="red-5"
                  size="sm"
                  @click="deleteSubject(sub.id)"
                />
              </q-item-section>
            </q-item>
            <div v-if="subjects.length === 0" class="text-center q-pa-lg text-grey-5">
              No subjects found.
            </div>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Add/Edit Subject Dialog -->
    <q-dialog v-model="addSubjectDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editingSubject ? 'Edit Subject' : 'Add Subject' }}</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="newSubject.name"
            label="Subject Name (e.g. Mathematics)"
            outlined
            dense
            autofocus
          />
          <q-input v-model="newSubject.code" label="Subject Code (Optional)" outlined dense />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="black"
            :label="editingSubject ? 'Update' : 'Save'"
            @click="saveSubject"
            :loading="submitting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Create/Edit Class Dialog -->
    <q-dialog v-model="addClassDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ editingClass ? 'Edit Class' : 'Create New Class' }}</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-select
            v-model="newClass.subject"
            :options="subjects"
            option-label="name"
            label="Subject"
            outlined
            dense
          />

          <q-select
            v-model="newClass.tutor"
            :options="tutors"
            option-label="full_name"
            label="Tutor"
            outlined
            dense
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">No tutors found</q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input v-model="newClass.grade" label="Grade (e.g. Grade 10)" outlined dense />
          <q-input
            v-model="newClass.monthly_fee"
            label="Monthly Fee (LKR)"
            type="number"
            outlined
            dense
          />

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-select v-model="newClass.day_of_week" :options="days" label="Day" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="newClass.hall" label="Hall (Optional)" outlined dense />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                v-model="newClass.start_time"
                label="Start Time"
                outlined
                dense
                type="time"
                stack-label
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="newClass.end_time"
                label="End Time"
                outlined
                dense
                type="time"
                stack-label
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            color="black"
            :label="editingClass ? 'Update Class' : 'Create Class'"
            @click="saveClass"
            :loading="submitting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const tab = ref('classes')
const loadingClasses = ref(false)
const submitting = ref(false)

// Data Refs
const subjects = ref([])
const classes = ref([])
const tutors = ref([])

// Dialog Refs & Editing States
const addSubjectDialog = ref(false)
const addClassDialog = ref(false)
const editingSubject = ref(null)
const editingClass = ref(null)

// Forms
const newSubject = ref({ name: '', code: '' })
const newClass = ref({
  subject: null,
  tutor: null,
  grade: '',
  monthly_fee: '',
  day_of_week: 'Sunday',
  start_time: '',
  end_time: '',
  hall: '',
})

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Columns
const classColumns = [
  { name: 'subject', label: 'Subject', align: 'left', field: 'subject' },
  { name: 'grade', label: 'Grade', align: 'left', field: 'grade' },
  { name: 'tutor', label: 'Tutor', align: 'left', field: 'tutor' },
  { name: 'day_of_week', label: 'Day', align: 'left', field: 'day_of_week' },
  {
    name: 'time',
    label: 'Time',
    align: 'left',
    field: (row) => `${row.start_time?.substring(0, 5)} - ${row.end_time?.substring(0, 5)}`,
  },
  { name: 'monthly_fee', label: 'Fee', align: 'right', field: (row) => `Rs. ${row.monthly_fee}` },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

// --- Methods ---

const fetchData = async () => {
  loadingClasses.value = true
  await Promise.all([fetchSubjects(), fetchTutors(), fetchClasses()])
  loadingClasses.value = false
}

const fetchSubjects = async () => {
  const { data } = await supabase.from('subjects').select('*').order('created_at')
  subjects.value = data || []
}

const fetchTutors = async () => {
  const { data } = await supabase.from('profiles').select('*').eq('role', 'tutor')
  tutors.value = data || []
}

const fetchClasses = async () => {
  const { data, error } = await supabase
    .from('classes')
    .select(
      `
            *,
            subject:subjects(*),
            tutor:profiles(*)
        `,
    )
    .order('created_at', { ascending: false })

  if (error) console.error(error)
  classes.value = data || []
}

// Subject Actions
const openAddSubject = () => {
  editingSubject.value = null
  newSubject.value = { name: '', code: '' }
  addSubjectDialog.value = true
}

const openEditSubject = (sub) => {
  editingSubject.value = sub
  newSubject.value = { name: sub.name, code: sub.code }
  addSubjectDialog.value = true
}

const saveSubject = async () => {
  if (!newSubject.value.name) return $q.notify({ type: 'warning', message: 'Name is required' })
  submitting.value = true

  let error
  if (editingSubject.value) {
    const { error: err } = await supabase
      .from('subjects')
      .update(newSubject.value)
      .eq('id', editingSubject.value.id)
    error = err
  } else {
    const { error: err } = await supabase.from('subjects').insert([newSubject.value])
    error = err
  }

  if (error) {
    $q.notify({ type: 'negative', message: 'Error saving subject' })
  } else {
    $q.notify({ type: 'positive', message: 'Subject saved' })
    addSubjectDialog.value = false
    fetchSubjects()
  }
  submitting.value = false
}

const deleteSubject = async (id) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Delete this subject?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (!error) {
      $q.notify({ type: 'positive', message: 'Subject deleted' })
      fetchSubjects()
      fetchClasses()
    }
  })
}

// Class Actions
const openAddClass = () => {
  editingClass.value = null
  fetchSubjects()
  fetchTutors()
  newClass.value = {
    subject: null,
    tutor: null,
    grade: '',
    monthly_fee: '',
    day_of_week: 'Sunday',
    start_time: '',
    end_time: '',
    hall: '',
  }
  addClassDialog.value = true
}

const openEditClass = (cls) => {
  editingClass.value = cls
  fetchSubjects()
  fetchTutors()

  // Populate form
  newClass.value = {
    subject: cls.subject, // Assumes subject object is present
    tutor: cls.tutor,
    grade: cls.grade,
    monthly_fee: cls.monthly_fee,
    day_of_week: cls.day_of_week,
    start_time: cls.start_time,
    end_time: cls.end_time,
    hall: cls.hall,
  }
  addClassDialog.value = true
}

const saveClass = async () => {
  if (!newClass.value.subject || !newClass.value.tutor || !newClass.value.grade) {
    return $q.notify({ type: 'warning', message: 'Subject, Tutor and Grade are required' })
  }
  submitting.value = true

  const payload = {
    subject_id: newClass.value.subject.id,
    tutor_id: newClass.value.tutor.id,
    grade: newClass.value.grade,
    monthly_fee: newClass.value.monthly_fee || 0,
    day_of_week: newClass.value.day_of_week,
    start_time: newClass.value.start_time,
    end_time: newClass.value.end_time,
    hall: newClass.value.hall,
  }

  let error
  if (editingClass.value) {
    const { error: err } = await supabase
      .from('classes')
      .update(payload)
      .eq('id', editingClass.value.id)
    error = err
  } else {
    const { error: err } = await supabase.from('classes').insert([payload])
    error = err
  }

  if (error) {
    $q.notify({ type: 'negative', message: 'Error saving class' })
  } else {
    $q.notify({ type: 'positive', message: 'Class saved successfully' })
    addClassDialog.value = false
    fetchClasses()
  }
  submitting.value = false
}

const deleteClass = async (id) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Delete this class?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const { error } = await supabase.from('classes').delete().eq('id', id)
    if (!error) {
      $q.notify({ type: 'positive', message: 'Class deleted' })
      fetchClasses()
    }
  })
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
.rounded-borders {
  border-radius: 8px;
}
</style>
