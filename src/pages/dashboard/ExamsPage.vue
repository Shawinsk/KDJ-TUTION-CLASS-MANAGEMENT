<template>
  <q-page class="q-pa-lg text-grey-9">
    <div class="row items-center justify-between q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-my-none">Exams & Results</h1>
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
        <q-tab name="exams" label="Manage Exams" no-caps />
        <q-tab name="marks" label="Enter Marks" no-caps />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Exams Tab -->
        <q-tab-panel name="exams" class="q-pa-md">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6 text-weight-regular text-grey-7">Exam Schedule</div>
            <q-btn
              color="black"
              icon="add"
              label="Create Exam"
              no-caps
              unelevated
              @click="openCreateExam"
            />
          </div>

          <q-table :rows="exams" :columns="examColumns" row-key="id" flat>
            <template v-slot:body-cell-class="props">
              <q-td :props="props">
                <div>{{ props.row.class?.subject?.name }}</div>
                <div class="text-caption text-grey">{{ props.row.class?.grade }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" auto-width>
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="red-5"
                  size="sm"
                  @click="deleteExam(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- Marks Tab -->
        <q-tab-panel name="marks" class="q-pa-md">
          <div class="row q-col-gutter-md items-top q-mb-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="selectedExam"
                :options="exams"
                option-label="name"
                label="Select Exam To Mark"
                outlined
                dense
                @update:model-value="fetchExamStudents"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.name }}</q-item-label>
                      <q-item-label caption
                        >{{ scope.opt.class?.subject?.name }} -
                        {{ new Date(scope.opt.date).toLocaleDateString() }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <div v-if="selectedExam">
            <div class="text-subtitle1 q-mb-sm text-weight-bold">
              Student Marks (Max: {{ selectedExam.total_marks }})
            </div>

            <q-markup-table flat bordered>
              <thead>
                <tr>
                  <th class="text-left">Student Name</th>
                  <th class="text-left">Student ID</th>
                  <th class="text-right" style="width: 150px">Marks</th>
                  <th class="text-center" style="width: 100px">Absent</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="stu in students" :key="stu.profile_id">
                  <td>{{ stu.profile?.full_name }}</td>
                  <td>
                    <q-badge color="grey-3" text-color="black">{{ stu.student_number }}</q-badge>
                  </td>
                  <td class="text-right">
                    <q-input
                      v-model.number="stu.marks"
                      type="number"
                      dense
                      outlined
                      :disable="stu.is_absent"
                      style="max-width: 100px; margin-left: auto"
                    />
                  </td>
                  <td class="text-center">
                    <q-toggle v-model="stu.is_absent" color="red" dense />
                  </td>
                </tr>
                <tr v-if="students.length === 0">
                  <td colspan="4" class="text-center text-grey q-pa-md">
                    No students enrolled in this class.
                  </td>
                </tr>
              </tbody>
            </q-markup-table>

            <div class="row justify-end q-mt-md">
              <q-btn color="black" label="Save Results" @click="saveResults" :loading="saving" />
            </div>
          </div>

          <div v-else class="text-center q-pa-xl text-grey-6">Select an exam to enter marks.</div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Create Exam Dialog -->
    <q-dialog v-model="createDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Create New Exam</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input v-model="newExam.name" label="Exam Name (e.g. Term Test 1)" outlined dense />
          <q-select
            v-model="newExam.class"
            :options="classes"
            option-label="subject_display"
            label="Class"
            outlined
            dense
          />
          <q-input v-model="newExam.date" type="date" label="Date" outlined dense />
          <q-input
            v-model.number="newExam.total_marks"
            type="number"
            label="Total Marks"
            outlined
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="black" label="Create" @click="createExam" :loading="creating" />
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
const tab = ref('exams')
const exams = ref([])
const classes = ref([])
const students = ref([]) // For Marks view
const selectedExam = ref(null)

const createDialog = ref(false)
const creating = ref(false)
const saving = ref(false)

const newExam = ref({ name: '', class: null, date: '', total_marks: 100 })

const examColumns = [
  { name: 'name', label: 'Exam Name', field: 'name', align: 'left', sortable: true },
  { name: 'class', label: 'Class / Subject', field: 'class', align: 'left', sortable: true },
  {
    name: 'date',
    label: 'Date',
    field: (row) => new Date(row.date).toLocaleDateString(),
    align: 'left',
    sortable: true,
  },
  { name: 'total_marks', label: 'Total Marks', field: 'total_marks', align: 'center' },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const fetchData = async () => {
  // Fetch Exams
  const { data: exData } = await supabase
    .from('exams')
    .select(`*, class:classes(*, subject:subjects(*))`)
    .order('date', { ascending: false })
  exams.value = exData || []

  // Fetch Classes (for dropdown)
  const { data: clData } = await supabase
    .from('classes')
    .select(`*, subject:subjects(*)`)
    .order('created_at', { ascending: false })
  if (clData) {
    classes.value = clData.map((c) => ({
      ...c,
      subject_display: `${c.subject?.name} - ${c.grade}`,
    }))
  }
}

const openCreateExam = () => {
  newExam.value = { name: '', class: null, date: '', total_marks: 100 }
  createDialog.value = true
}

const createExam = async () => {
  if (!newExam.value.name || !newExam.value.class || !newExam.value.date) {
    return $q.notify({ type: 'warning', message: 'Please fill all details' })
  }

  creating.value = true
  const { error } = await supabase.from('exams').insert([
    {
      name: newExam.value.name,
      class_id: newExam.value.class.id,
      date: newExam.value.date,
      total_marks: newExam.value.total_marks,
    },
  ])

  if (error) {
    $q.notify({ type: 'negative', message: 'Error creating exam' })
  } else {
    $q.notify({ type: 'positive', message: 'Exam created' })
    createDialog.value = false
    fetchData()
  }
  creating.value = false
}

const deleteExam = async (exam) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Delete this exam and all results?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const { error } = await supabase.from('exams').delete().eq('id', exam.id)
    if (!error) {
      $q.notify({ type: 'positive', message: 'Exam deleted' })
      fetchData()
    }
  })
}

// Marks Entry
const fetchExamStudents = async () => {
  if (!selectedExam.value) return

  const classId = selectedExam.value.class_id

  // 1. Fetch Enrolled Students for this Class
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('student_id')
    .eq('class_id', classId)
  const studentIds = enrollments?.map((e) => e.student_id) || []

  if (studentIds.length === 0) {
    students.value = []
    return
  }

  // 2. Fetch Student Profiles & Details
  const { data: stuDatas } = await supabase
    .from('students')
    .select(`*, profile:profiles(*)`)
    .in('profile_id', studentIds)

  // 3. Fetch Existing Results
  const { data: results } = await supabase
    .from('exam_results')
    .select('*')
    .eq('exam_id', selectedExam.value.id)

  // 4. Merge
  students.value = stuDatas.map((s) => {
    const res = results?.find((r) => r.student_id === s.profile_id)
    return {
      profile_id: s.profile_id,
      profile: s.profile,
      student_number: s.student_number,
      marks: res ? res.marks : '',
      is_absent: res ? res.is_absent : false,
    }
  })
}

const saveResults = async () => {
  if (!selectedExam.value) return
  saving.value = true

  const upsertData = students.value.map((s) => ({
    exam_id: selectedExam.value.id,
    student_id: s.profile_id,
    marks: s.is_absent ? 0 : s.marks === '' ? null : s.marks,
    is_absent: s.is_absent,
  }))

  const { error } = await supabase
    .from('exam_results')
    .upsert(upsertData, { onConflict: 'exam_id, student_id' })

  if (error) {
    $q.notify({ type: 'negative', message: 'Error saving results: ' + error.message })
  } else {
    $q.notify({ type: 'positive', message: 'Results saved successfully' })
  }
  saving.value = false
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
