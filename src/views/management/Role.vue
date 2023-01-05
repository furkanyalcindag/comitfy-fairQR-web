/* eslint-disable */
<template>
  <div>
    <CRow>
      <CCol class="justify-content-start">
        <CCard>
          <CCardHeader>
            <!-- <CIcon icon="cil-user" /> -->
            <CRow>
              <CCol lg="3" class="text-left mt-3">
                <h2>Rol Listesi</h2>
              </CCol>
              <CCol lg="9" class="text-right mt-3">
                <CButton
                  color="primary"
                  class="float-end"
                  shape="rounded-pill"
                  @click="showModal('addRoleModal')"
                  >Ekle
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody class="p-0">
            <easy-data-table
              class="m-4"
              show-index
              v-model:itemsSelected="itemsSelected"
              v-model:server-options="roleTable.serverOptions"
              :server-items-length="roleTable.serverItemsLength"
              :headers="headers"
              :items="items"
              :theme-color="themeColor"
              buttons-pagination
              :loading="roleTable.loading"
              :rows-items="roleTable.rowsItem"
            >
              <template #item-operations="item">
                <div>
                  <CButtonGroup role="group" size="sm">
                    <CButton
                      color="warning"
                      class="ms-2 text-white align-items-center"
                      shape="rounded-pill"
                      size="sm"
                      v-c-tooltip="{
                        content: 'Düzenle',
                        placement: 'top',
                      }"
                      @click="showModal('updateRoleModal', item)"
                    >
                      <CIcon icon="cil-pencil" />
                    </CButton>
                    <CButton
                      color="danger"
                      class="ms-2 text-white align-items-center"
                      shape="rounded-pill"
                      size="sm"
                      v-c-tooltip="{
                        content: 'Sil',
                        placement: 'top',
                      }"
                      @click="
                        showModal('deleteRoleModal', item),
                          (openedModals.deleteRoleModal = true)
                      "
                    >
                      <CIcon icon="cil-trash" />
                    </CButton>
                    <CButton
                      color="success"
                      class="ms-2 text-white align-items-center"
                      shape="rounded-pill"
                      size="sm"
                      v-c-tooltip="{
                        content: 'Kullanıcılar',
                        placement: 'top',
                      }"
                      @click="showModal('showUserModal', item)"
                    >
                      <CIcon icon="cil-user" />
                    </CButton>
                    <CButton
                      color="info"
                      class="ms-2 text-white align-items-center"
                      shape="rounded-pill"
                      size="sm"
                      v-c-tooltip="{
                        content: 'Kullanıcı Ekle',
                        placement: 'top',
                      }"
                      @click="showModal('addUserModal', item)"
                    >
                      <CIcon icon="cil-user-plus" />
                    </CButton>
                  </CButtonGroup>
                </div>
              </template>
            </easy-data-table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Add Role -->
    <CModal
      size="lg"
      backdrop="static"
      :visible="openedModals.addRoleModal"
      @close="closeModal('addRoleModal')"
    >
      <CModalHeader>
        <CModalTitle>Rol Ekle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'addRoleModal', addedItem)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          {{ isAbleToPushButton }}
          <CCol md="6">
            <CFormLabel for="add-rol-name">Rol adı</CFormLabel>
            <CFormInput
              id="add-rol-name"
              required
              v-model="addedItem.name"
              feedbackInvalid="Lütfen bir rol adı giriniz"
            />
          </CCol>

          <CModalFooter class="pe-0">
            <CButton color="secondary" @click="closeModal('addRoleModal', true)"
              >İptal</CButton
            >
            <CButton
              color="success"
              :type="isAbleToPushButton ? 'submit' : null"
              >Kaydet</CButton
            >
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
    <!-- Delete Role -->
    <CModal
      size="lg"
      :visible="openedModals.deleteRoleModal"
      @close="closeModal('deleteRoleModal')"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>Rol <span class="text-danger">Sil</span></CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h5>
          Bu işlemi geri alamazsınız. Rol bilgilerini
          <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
        </h5>
        <CModalFooter class="pe-0">
          <CButton
            color="secondary"
            @click="closeModal('deleteRoleModal', true)"
            >İptal</CButton
          >
          <CButton
            color="danger"
            @click="isAbleToPushButton ? deleteRole(selectedRole.uuid) : null"
            >SİL</CButton
          >
        </CModalFooter>
      </CModalBody>
    </CModal>
    <!-- Update Role -->
    <CModal
      size="lg"
      :visible="openedModals.updateRoleModal"
      @close="closeModal('updateRoleModal')"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>Rol Bilgilerini Düzenle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI(
                  $event,
                  'updateRoleModal',
                  JSON.parse(JSON.stringify(editedItem)),
                )
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <CCol md="6">
            <CFormLabel for="update-rol-name">Rol İsmi</CFormLabel>
            <CFormInput
              id="update-rol-name"
              required
              feedbackInvalid="Lütfen bir rol ismi giriniz"
              v-model="editedItem.name"
            />
          </CCol>

          <CModalFooter class="pe-0">
            <CButton color="secondary" @click="closeModal('updateRoleModal')"
              >İptal</CButton
            >
            <CButton
              color="success"
              :type="isAbleToPushButton ? 'submit' : null"
              >Değişiklikleri Kaydet
            </CButton>
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
    <!-- Add user from role modal -->
    <CModal
      size="lg"
      :visible="openedModals.addUserModal"
      @close="closeModal('addUserModal')"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>Kullanıcı Ekle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'addUserModal', addedItem)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <CCol md="6">
            <CFormLabel for="add-user-userName">Kullanıcı İsmi</CFormLabel>
            <CFormInput
              id="add-user-userName"
              required
              v-model="addedItem.userName"
              feedbackInvalid="Lütfen bir kullanıcı ismi giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-firstName">İsim</CFormLabel>
            <CFormInput
              id="add-user-firstname"
              required
              v-model="addedItem.firstName"
              feedbackInvalid="Lütfen bir isim giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-lastName">Soyisim</CFormLabel>
            <CFormInput
              id="add-user-lastName"
              required
              v-model="addedItem.lastName"
              feedbackInvalid="Lütfen bir soyisim giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-email">Email</CFormLabel>
            <CFormInput
              id="add-user-email"
              required
              v-model="addedItem.email"
              feedbackInvalid="Lütfen bir Email adresi giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-password">Şifre</CFormLabel>
            <CFormInput
              id="add-user-password"
              required
              v-model="addedItem.password"
              feedbackInvalid="Lütfen bir şifre giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-ageRangeEnum">Yaş Aralığı</CFormLabel>
            <CFormSelect
              id="add-user-age"
              required
              v-model="addedItem.ageRangeEnum"
              feedbackInvalid="Lütfen yaş aralığı seçiniz"
            >
              <option selected="" disabled="" value="">Seçiniz...</option>
              <option value="_UNSPECIFIED">Belirtmek İstemiyorum</option>
            </CFormSelect>
          </CCol>

          <CCol md="6">
            <CFormLabel for="add-user-genderEnum">Cinsiyet</CFormLabel>
            <CFormSelect
              id="add-user-genderEnum"
              required
              v-model="addedItem.genderEnum"
              feedbackInvalid="Lütfen Cinsiyet seçiniz"
            >
              <option selected="" disabled="" value="">Seçiniz...</option>
              <option value="FEMALE">Kadın</option>
            </CFormSelect>
          </CCol>

          <CModalFooter class="pe-0">
            <CButton color="secondary" @click="closeModal('addUserModal', true)"
              >İptal</CButton
            >
            <CButton
              color="success"
              :type="isAbleToPushButton ? 'submit' : null"
              >Kaydet</CButton
            >
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
    <!-- Show user from role modal -->
    <CModal
      size="lg"
      :visible="openedModals.showUserModal"
      @close="closeModal('showUserModal')"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>Kullanıcı Bilgilerini Göster</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCardBody class="p-0">
          <easy-data-table
            class="m-4"
            show-index
            v-model:itemsSelected="itemsSelected"
            v-model:server-options="userTable.serverOptions"
            :server-items-length="userTable.serverItemsLength"
            :headers="headers2"
            :items="items2"
            :theme-color="themeColor"
            buttons-pagination
            :loading="userTable.loading"
            :rows-items="userTable.rowsItem"
          >
            <template #item-operations="item">
              <div>
                <CButtonGroup role="group" size="sm">
                  <CButton
                    color="danger"
                    class="ms-2 text-white align-items-center"
                    shape="rounded-pill"
                    size="sm"
                    v-c-tooltip="{
                      content: 'Sil',
                      placement: 'top',
                    }"
                    @click="showModal('deleteUserModal', item)"
                  >
                    <CIcon icon="cil-trash" />
                  </CButton>
                </CButtonGroup>
              </div>
            </template>
          </easy-data-table>

          <CButton
            color="secondary"
            class="float-md-end"
            @click="closeModal('showUserModal')"
            >İptal
          </CButton>
        </CCardBody>
      </CModalBody>
    </CModal>
    <!-- Delete user from role modal -->
    <CModal
      size="lg"
      v-model:visible="openedModals.deleteUserModal"
      @close="closeModal('deleteUserModal')"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>User <span class="text-danger">Sil</span></CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h5>
          Bu işlemi geri alamazsınız. Kullanıcı bilgilerini
          <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
        </h5>
        <CModalFooter class="pe-0">
          <CButton
            color="secondary"
            @click="closeModal('deleteUserModal', true)"
            >İptal</CButton
          >
          <CButton
            color="danger"
            @click="isAbleToPushButton ? deleteUser(selectedUser.uuid) : null"
            >SİL</CButton
          >
        </CModalFooter>
      </CModalBody>
    </CModal>
  </div>
</template>

<script>
import avatar from '@/assets/images/avatars/8.jpg'
import { mapActions } from 'vuex'
import Toast from '@/models/create_TOAST_dto'

export default {
  name: 'Colors',
  components: {
    EasyDataTable: window['vue3-easy-data-table'],
  },
  data() {
    return {
      avatar: avatar,
      headers: [
        { text: 'Rol Adı', value: 'name', sortable: true },
        { text: 'İşlemler', value: 'operations' },
      ],
      items: [],
      editedItem: {
        uuid: null,
        name: null,
      },
      addedItem: {
        name: null,
      },
      headers2: [
        { text: 'İsim', value: 'firstName', sortable: true },
        { text: 'Soyisim', value: 'lastName', sortable: true },
        { text: 'Email', value: 'email', sortable: true },
        { text: 'İşlemler', value: 'operations' },
      ],
      items2: [],

      themeColor: '#321fdb',
      itemsSelected: [],
      openedModals: {
        addRoleModal: false,
        deleteRoleModal: false,
        updateRoleModal: false,
        addUserModal: false,
        showUserModal: false,
        deleteUserModal: false,
      },
      validationChecked: false,
      roleTable: {
        serverItemsLength: 0,
        serverOptions: {
          page: 1,
          rowsPerPage: 10,
          language: 'TR',
        },
        rowsItem: [10, 20, 50],
        loading: true,
      },
      userTable: {
        serverItemsLength: 0,
        serverOptions: {
          page: 1,
          rowsPerPage: 10,
        },
        rowsItem: [10, 20, 50],
        loading: true,
      },
      isAbleToPushButton: true,
      toasts: [],
      selectedUser: {},
      selectedRole: {},
    }
  },
  created() {
    this.getRoles(this.roleTable.serverOptions)
  },
  watch: {
    'roleTable.serverOptions'(newvalue) {
      this.getRoles(newvalue)
    },
    'userTable.serverOptions'(newvalue) {
      console.log('userTable.serverOptions CHANGEDDDDDDDDDDDd')
      console.log(this.selectedRole)
      this.getUser(newvalue, this.selectedRole)
    },
  },
  methods: {
    ...mapActions({
      getAllRoles: 'role/getRoles',
      deleteRoleAPI: 'role/deleteRole',
      addRoleAPI: 'role/addRole',
      updateRoleAPI: 'role/updateRole',
      addUserAPI: 'user/addUserByRole',
      getUsersByRoleAPI: 'user/getUserByRole',
      deleteUserFromRoleAPI: 'user/deleteUser',
    }),
    submitToAPI(event, modalname, data) {
      // Response
      this.isAbleToPushButton = false
      this.validationChecked = true
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
        this.isAbleToPushButton = true
        return
      }
      switch (modalname) {
        case 'addRoleModal':
          {
            this.addRole(data)
          }
          break
        case 'updateRoleModal':
          {
            this.updateRole(data)
          }
          break
        case 'addUserModal':
          {
            this.addUser(data)
          }
          break
      }
    },
    showModal(modalname, data) {
      switch (modalname) {
        case 'deleteRoleModal':
          {
            this.selectedRole = data ? JSON.parse(JSON.stringify(data)) : {}
          }
          break
        case 'updateRoleModal':
          {
            this.selectedRole = data ? JSON.parse(JSON.stringify(data)) : {}
            let cachedItemData = JSON.parse(JSON.stringify(data))
            this.editedItem = cachedItemData
          }
          break
        case 'addUserModal':
          {
            let cachedItemData = JSON.parse(JSON.stringify(data))
            this.addedItem = cachedItemData
          }
          break
        case 'showUserModal':
          {
            this.selectedRole = data ? JSON.parse(JSON.stringify(data)) : {}
            this.getUser(this.userTable.serverOptions, data)
          }
          break
        case 'deleteUserModal': {
          this.selectedUser = data
        }
      }
      this.openedModals[modalname] = true
    },
    closeModal(modalname, resetData) {
      this.openedModals[modalname] = false
      this.validationChecked = false
      if (resetData) {
        switch (modalname) {
          case 'addRoleModal':
            {
              let cachedAddedItemData = { name: null }
              this.addedItem = cachedAddedItemData
            }
            break
          case 'addUserModal':
            {
              let cachedAddedItemData = {
                username: null,
                firstName: null,
                lastName: null,
                email: null,
                password: null,
                ageRangeEnum: null,
                genderEnum: null,
              }
              this.addedItem = cachedAddedItemData
            }
            break
          case 'deleteUserModal':
            {
              this.selectedUser = {}
            }
            break
          case 'updateRoleModal':
            {
              this.editedItem = {}
            }
            break
          case 'deleteRoleModal':
            {
              this.selectedRole = {}
            }
            break
        }
      }
      this.queueEnableSendButton()
    },
    async getRoles(pageOptions) {
      this.roleTable.loading = true
      const response = await this.getAllRoles(pageOptions)
      this.items = response.data
      this.roleTable.serverItemsLength = response.totalElements
      this.roleTable.loading = false
    },
    async getUser(pageOptions, data) {
      this.userTable.loading = true
      console.log('getUser INVOKED', pageOptions)
      let pageAndData = { pageOptions: pageOptions, roleData: data }
      const response = await this.getUsersByRoleAPI(pageAndData)
      this.items2 = response.data
      this.userTable.serverItemsLength = response.totalElements
      this.userTable.loading = false
    },
    async addRole(data) {
      const response = await this.addRoleAPI(data)
      if (response === true) {
        new Toast(
          'New role ' + data.name + ' added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.closeModal('addRoleModal', true)
        this.getRoles(this.roleTable.serverOptions)
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
        this.queueEnableSendButton()
      }
    },
    async updateRole(newroleData) {
      const response = await this.updateRoleAPI(newroleData)
      if (response === true) {
        new Toast(
          'Role updated successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getRoles(this.roleTable.serverOptions)
        this.closeModal('updateRoleModal', true)
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
        this.queueEnableSendButton()
      }
    },
    async deleteRole(uuid) {
      const response = await this.deleteRoleAPI(uuid)
      if (response === true) {
        new Toast(
          'Succesfully deleted',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getRoles(this.roleTable.serverOptions)
        this.closeModal('deleteRoleModal', true)
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
        this.queueEnableSendButton()
      }
    },
    async addUser(data) {
      const response = await this.addUserAPI(data)
      if (response === true) {
        new Toast(
          'New role ' + data.name + ' added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        // SECOND ARGUMENT DATA SHOULDNT BE NULL -------IMPORTANT
        this.getUser(this.userTable.serverOptions, this.selectedRole)
        this.closeModal('addUserModal', true)
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
        this.queueEnableSendButton()
      }
    },
    async deleteUser(uuid) {
      this.isAbleToPushButton = false
      console.log(uuid)
      const response = await this.deleteUserFromRoleAPI(uuid)
      if (response === true) {
        new Toast('Silindi', 'success', true, 'text-white align-items-center')
        this.getUser(this.userTable.serverOptions, this.selectedRole)
        this.closeModal('deleteUserModal', true)
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
        this.queueEnableSendButton()
      }
    },
    async queueEnableSendButton() {
      await this.$store.dispatch('invokeSendButtonDelay')
      this.isAbleToPushButton = true
    },
  },
}
</script>

<style lang="css" scoped>
.rounder {
  border-radius: 50%;
}
</style>
