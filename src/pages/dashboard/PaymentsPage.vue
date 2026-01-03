<template>
  <q-page class="q-pa-lg text-grey-9">
    <div class="row items-center justify-between q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-my-none">Payments</h1>
      <q-btn
        color="black"
        icon="add"
        label="New Payment"
        no-caps
        unelevated
        @click="openNewPayment"
      />
    </div>

    <!-- Payments Table -->
    <q-card flat class="bg-white rounded-lg shadow-sm">
      <q-table
        :rows="payments"
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

        <template v-slot:body-cell-student="props">
          <q-td :props="props">
            <div class="text-weight-bold">{{ props.row.student?.full_name || 'Unknown' }}</div>
            <div class="text-caption text-grey">{{ props.row.student?.email }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-class="props">
          <q-td :props="props">
            <div v-if="props.row.class">
              {{ props.row.class.subject?.name }} - {{ props.row.class.grade }}
            </div>
            <div v-else class="text-grey">Deleted Class</div>
          </q-td>
        </template>

        <template v-slot:body-cell-amount="props">
          <q-td :props="props" class="text-right">
            <div class="text-weight-bold">Rs. {{ props.row.amount }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge color="green-1" text-color="green-9" class="q-px-sm">Paid</q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- New Payment Dialog -->
    <q-dialog v-model="paymentDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Record New Payment</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <!-- Step 1: Select Student -->
          <q-select
            v-model="newPayment.student"
            :options="studentOptions"
            option-label="full_name"
            label="Select Student"
            outlined
            dense
            use-input
            @filter="filterStudents"
            @update:model-value="loadStudentClasses"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.full_name }}</q-item-label>
                  <q-item-label caption>{{
                    scope.opt.student_number || scope.opt.email
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Step 2: Select Class -->
          <q-select
            v-model="newPayment.class"
            :options="enrolledClasses"
            option-label="display_name"
            label="Select Class"
            outlined
            dense
            :disable="!newPayment.student"
            @update:model-value="setClassFee"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{
                    newPayment.student
                      ? 'Student not enrolled in any classes'
                      : 'Select a student first'
                  }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Step 3: Details -->
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input v-model="newPayment.month" type="month" label="For Month" outlined dense />
            </div>
            <div class="col-6">
              <q-select
                v-model="newPayment.method"
                :options="['Cash', 'Card', 'Transfer']"
                label="Method"
                outlined
                dense
              />
            </div>
          </div>

          <q-input
            v-model="newPayment.amount"
            label="Amount (LKR)"
            type="number"
            outlined
            dense
            class="text-h6"
            prefix="Rs."
          />

          <q-input v-model="newPayment.remarks" label="Remarks (Optional)" outlined dense />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="black" label="Confirm Payment" @click="savePayment" :loading="saving" />
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
const payments = ref([])
const loading = ref(true)
const saving = ref(false)
const filter = ref('')

const paymentDialog = ref(false)
const allStudents = ref([]) // Cache for search
const studentOptions = ref([])
const enrolledClasses = ref([])

const newPayment = ref({
  student: null,
  class: null,
  month: new Date().toISOString().slice(0, 7), // YYYY-MM
  amount: '',
  method: 'Cash',
  remarks: '',
})

const columns = [
  {
    name: 'date',
    label: 'Date',
    field: (row) => new Date(row.payment_date).toLocaleDateString(),
    align: 'left',
    sortable: true,
  },
  { name: 'student', label: 'Student', field: 'student', align: 'left' },
  { name: 'class', label: 'Class', field: 'class', align: 'left' },
  { name: 'month', label: 'Month', field: 'month', align: 'left' },
  { name: 'method', label: 'Method', field: 'payment_method', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
]

const fetchPayments = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('payments')
    .select(
      `
            *,
            student:profiles!student_id(*),
            class:classes!class_id(*, subject:subjects(*))
        `,
    )
    .order('payment_date', { ascending: false })

  if (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error fetching payments' })
  } else {
    payments.value = data
  }
  loading.value = false
}

// Dialog Logic
const openNewPayment = async () => {
  // Fetch students list for dropdown
  const { data } = await supabase.from('students').select(`*, profile:profiles(*)`)
  // Map to flat object for dropdown
  allStudents.value = data.map((s) => ({
    id: s.profile_id, // Use profile_id as value
    full_name: s.profile?.full_name,
    email: s.profile?.email,
    student_number: s.student_number,
  }))
  studentOptions.value = allStudents.value

  newPayment.value = {
    student: null,
    class: null,
    month: new Date().toISOString().slice(0, 7),
    amount: '',
    method: 'Cash',
    remarks: '',
  }
  enrolledClasses.value = []
  paymentDialog.value = true
}

const filterStudents = (val, update) => {
  if (val === '') {
    update(() => {
      studentOptions.value = allStudents.value
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    studentOptions.value = allStudents.value.filter(
      (v) =>
        v.full_name?.toLowerCase().includes(needle) ||
        v.student_number?.toLowerCase().includes(needle),
    )
  })
}

const loadStudentClasses = async (val) => {
  if (!val) {
    enrolledClasses.value = []
    return
  }
  // Fetch enrollments for student
  const { data } = await supabase
    .from('enrollments')
    .select(
      `
            class:classes(*, subject:subjects(*))
        `,
    )
    .eq('student_id', val.id)

  if (data) {
    enrolledClasses.value = data.map((e) => ({
      ...e.class,
      display_name: `${e.class.subject?.name} - ${e.class.grade}`,
    }))
  }
}

const setClassFee = (val) => {
  if (val) {
    newPayment.value.amount = val.monthly_fee || 0
  }
}

const savePayment = async () => {
  if (!newPayment.value.student || !newPayment.value.class || !newPayment.value.amount) {
    return $q.notify({ type: 'warning', message: 'Please details' })
  }

  saving.value = true
  const { error } = await supabase.from('payments').insert([
    {
      student_id: newPayment.value.student.id,
      class_id: newPayment.value.class.id,
      month: newPayment.value.month,
      amount: newPayment.value.amount,
      payment_method: newPayment.value.method,
      remarks: newPayment.value.remarks,
    },
  ])

  if (error) {
    $q.notify({ type: 'negative', message: 'Error saving: ' + error.message })
  } else {
    $q.notify({ type: 'positive', message: 'Payment recorded' })
    paymentDialog.value = false
    fetchPayments()
  }
  saving.value = false
}

onMounted(fetchPayments)
</script>

<style scoped>
.rounded-lg {
  border-radius: 12px;
}
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
