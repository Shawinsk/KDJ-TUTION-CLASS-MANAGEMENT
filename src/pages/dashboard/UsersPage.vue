<template>
  <q-page class="q-pa-lg text-grey-9">
    <div class="row items-center justify-between q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-my-none">User Management</h1>

      <div class="row q-gutter-sm items-center">
        <q-input
          v-model="search"
          dense
          outlined
          placeholder="Search users..."
          class="bg-white"
          style="min-width: 250px"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-grey-5" />
          </template>
        </q-input>

        <q-btn
          color="black"
          icon="add"
          label="Add User"
          no-caps
          unelevated
          @click="addUserDialog = true"
        />
      </div>
    </div>

    <q-card flat class="bg-white rounded-lg shadow-sm">
      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :filter="search"
        class="text-grey-9"
      >
        <template v-slot:body-cell-email="props">
          <q-td :props="props" class="text-grey-7">
            {{ props.value }}
          </q-td>
        </template>

        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <q-badge :color="getRoleColor(props.value)" class="q-px-sm q-py-xs text-capitalize">
              {{ props.value }}
            </q-badge>
            <!-- Quick inline edit -->
            <q-popup-edit
              v-model="props.row.role"
              v-slot="scope"
              @save="(val) => updateRole(props.row.id, val)"
            >
              <q-select
                v-model="scope.value"
                :options="roleOptions"
                dense
                autofocus
                @update:model-value="scope.set"
              />
            </q-popup-edit>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn
              flat
              round
              dense
              icon="edit"
              size="sm"
              color="grey-7"
              @click="openEditUser(props.row)"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              size="sm"
              color="red-5"
              @click="deleteUser(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Add User Dialog -->
    <q-dialog v-model="addUserDialog">
      <q-card style="min-width: 400px" class="q-pa-sm">
        <q-card-section>
          <div class="text-h6 text-weight-bold">Add New User</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-md">
          <q-input v-model="newUser.email" label="Email" dense autofocus />
          <q-input v-model="newUser.password" label="Password" type="password" dense />
          <q-select v-model="newUser.role" :options="roleOptions" label="Role" dense />
        </q-card-section>

        <q-card-actions align="right" class="q-mt-md">
          <q-btn flat label="CANCEL" color="grey-8" v-close-popup class="text-weight-bold" />
          <q-btn
            unelevated
            label="ADD USER"
            color="grey-2"
            text-color="black"
            class="text-weight-bold q-px-md"
            @click="addNewUser"
            :loading="creating"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit User Dialog -->
    <q-dialog v-model="editUserDialog">
      <q-card style="min-width: 400px" class="q-pa-sm">
        <q-card-section>
          <div class="text-h6 text-weight-bold">Edit User</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-md" v-if="editingUser">
          <q-input v-model="editingUser.full_name" label="Full Name" dense autofocus />
          <q-select v-model="editingUser.role" :options="roleOptions" label="Role" dense />
          <div class="text-caption text-grey-6 q-mt-sm">Note: Email cannot be changed here.</div>
        </q-card-section>

        <q-card-actions align="right" class="q-mt-md">
          <q-btn flat label="CANCEL" color="grey-8" v-close-popup class="text-weight-bold" />
          <q-btn
            unelevated
            label="SAVE CHANGES"
            color="black"
            text-color="white"
            class="text-weight-bold q-px-md"
            @click="saveEditUser"
            :loading="saving"
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
import { createClient } from '@supabase/supabase-js'

const $q = useQuasar()
const users = ref([])
const loading = ref(true)
const search = ref('')
const creating = ref(false)
const saving = ref(false)

const addUserDialog = ref(false)
const newUser = ref({ email: '', password: '', role: 'student' })

const editUserDialog = ref(false)
const editingUser = ref(null)

const roleOptions = ['admin', 'tutor', 'student']

const columns = [
  { name: 'full_name', label: 'Name', align: 'left', field: 'full_name', sortable: true },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
  { name: 'role', label: 'Role', align: 'left', field: 'role', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const getRoleColor = (role) => {
  if (role === 'admin') return 'black'
  if (role === 'tutor') return 'purple'
  return 'blue'
}

const fetchUsers = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    $q.notify({ type: 'negative', message: 'Error fetching users' })
  } else {
    users.value = data
  }
  loading.value = false
}

const updateRole = async (id, newRole) => {
  const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id)
  if (error) {
    $q.notify({ type: 'negative', message: 'Failed to update role' })
    await fetchUsers() // Revert
  } else {
    $q.notify({ type: 'positive', message: 'Role updated successfully' })
  }
}

const addNewUser = async () => {
  if (!newUser.value.email || !newUser.value.password) {
    $q.notify({ type: 'warning', message: 'Please fill all fields' })
    return
  }

  creating.value = true
  try {
    const tempClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })

    const { error } = await tempClient.auth.signUp({
      email: newUser.value.email,
      password: newUser.value.password,
      options: {
        data: {
          role: newUser.value.role,
          full_name: newUser.value.email.split('@')[0],
        },
      },
    })

    if (error) throw error

    $q.notify({ type: 'positive', message: 'User created successfully' })
    addUserDialog.value = false
    newUser.value = { email: '', password: '', role: 'student' }
    setTimeout(fetchUsers, 1500)
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message || 'Failed to create user' })
  } finally {
    creating.value = false
  }
}

// Edit User Logic
const openEditUser = (user) => {
  editingUser.value = { ...user }
  editUserDialog.value = true
}

const saveEditUser = async () => {
  if (!editingUser.value) return
  saving.value = true

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: editingUser.value.full_name,
      role: editingUser.value.role,
    })
    .eq('id', editingUser.value.id)

  if (error) {
    $q.notify({ type: 'negative', message: 'Error updating user' })
  } else {
    $q.notify({ type: 'positive', message: 'User updated successfully' })
    editUserDialog.value = false
    fetchUsers() // Refresh list
  }
  saving.value = false
}

// Delete User Logic
const deleteUser = (user) => {
  $q.dialog({
    title: 'Delete User',
    message: `Are you sure you want to delete ${user.email}? This action removes their profile.`,
    persistent: true,
    ok: { label: 'Delete', color: 'red', flat: true },
    cancel: { label: 'Cancel', color: 'black', flat: true },
  }).onOk(async () => {
    const { error } = await supabase.from('profiles').delete().eq('id', user.id)
    if (error) {
      $q.notify({ type: 'negative', message: 'Error deleting user' })
    } else {
      $q.notify({ type: 'positive', message: 'User deleted' })
      fetchUsers()
    }
  })
}

onMounted(fetchUsers)
</script>

<style scoped>
.rounded-lg {
  border-radius: 12px;
}
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
