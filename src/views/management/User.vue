<template>
  <div>
    <CRow>
      <CCol class="justify-content-start">
        <CCard>
          <CCardHeader>
            <!-- <CIcon icon="cil-user" /> -->
            <CRow>
              <CCol lg="3" class="text-left mt-3">
                <h2>Kullanıcı Listesi</h2>
              </CCol>
              <CCol lg="9" class="text-right mt-3">
                <CButton
                  color="primary"
                  class="float-end"
                  shape="rounded-pill"
                  @click="showModal('addUserModal')"
                  >Ekle</CButton
                >
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody class="p-0">
            <easy-data-table
              class="m-4"
              show-index
              v-model:itemsSelected="itemsSelected"
              v-model:server-options="userTable.serverOptions"
              :server-items-length="userTable.serverItemsLength"
              :headers="headers"
              :items="items"
              :theme-color="themeColor"
              buttons-pagination
              :loading="userTable.loading"
              :rows-items="userTable.rowsItem"
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
                      @click="showModal('updateUserModal', item)"
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
                      @click="showModal('deleteUserModal', item)"
                    >
                      <CIcon icon="cil-trash" />
                    </CButton>
                  </CButtonGroup>
                </div>
              </template>
            </easy-data-table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <!-- Add user modal -->
    <CModal
      size="lg"
      backdrop="static"
      :visible="openedModals.addUserModal"
      @close="closeModal('addUserModal')"
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
            <CFormLabel for="add-user-userName">Kullanıcı Adı</CFormLabel>
            <CFormInput
              id="add-user-userName"
              required
              v-model="addedItem.userName"
              feedbackInvalid="Lütfen bir kullanıcı adı giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-firstName">İsim</CFormLabel>
            <CFormInput
              id="add-user-firstName"
              required
              v-model="addedItem.firstName"
              feedbackInvalid="Lütfen bir isim giriniz"
            />
          </CCol>
          <CCol xs="6">
            <CFormLabel for="add-user-lastName">Soyisim</CFormLabel>
            <CFormInput
              id="add-user-lastName"
              required
              v-model="addedItem.lastName"
              feedbackInvalid="Lütfen bir soyisim giriniz"
            />
          </CCol>
          <CCol xs="6">
            <CFormLabel for="add-user-email">Email</CFormLabel>
            <CFormInput
              id="add-user-email"
              type="email"
              required
              v-model="addedItem.email"
              feedbackInvalid="Lütfen bir email giriniz"
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
            <CFormLabel for="add-user-password">Şifre Tekrarı</CFormLabel>
            <CFormInput
              id="add-user-confirmPassword"
              required
              v-model="addedItem.confirmPassword"
              feedbackInvalid="Lütfen tekrar şifre giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-ageRangeEnum">Yaş Aralığı</CFormLabel>
            <CFormSelect
              id="add-user-age"
              required
              feedbackInvalid="Lütfen yaş aralığı seçiniz"
              v-model="addedItem.ageRangeEnum"
            >
              <option selected="" disabled="" value="">Seçiniz...</option>
              <option value="_UNSPECIFIED">Belirtmek istemiyorum</option>
            </CFormSelect>
          </CCol>

          <CCol md="6">
            <CFormLabel for="add-user-genderEnum">Cinsiyet</CFormLabel>
            <CFormSelect
              id="add-user-genderEnum"
              required
              feedbackInvalid="Lütfen Cinsiyet seçiniz"
              v-model="addedItem.genderEnum"
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
    <!-- Update user modal -->
    <CModal
      size="lg"
      :visible="openedModals.updateUserModal"
      @close="closeModal('updateUserModal')"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>Kullanıcı Düzenle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI(
                  $event,
                  'updateUserModal',
                  JSON.parse(JSON.stringify(editedItem)),
                )
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <!-- username -->
          <CCol md="6">
            <CFormLabel for="update-user-userName">İsim</CFormLabel>
            <CFormInput
              id="update-user-userName"
              required
              feedbackInvalid="Lütfen bir kullanıcı ismi giriniz"
              v-model="editedItem.userName"
            />
          </CCol>
          <!-- firstname -->
          <CCol md="6">
            <CFormLabel for="update-user-firstName">İsim</CFormLabel>
            <CFormInput
              id="update-user-firstName"
              required
              feedbackInvalid="Lütfen bir isim giriniz"
              v-model="editedItem.firstName"
            />
          </CCol>
          <!-- lastname -->
          <CCol xs="6">
            <CFormLabel for="update-user-lastName">Soyisim</CFormLabel>
            <CFormInput
              id="update-user-lastName"
              required
              feedbackInvalid="Lütfen bir soyisim giriniz"
              v-model="editedItem.lastName"
            />
          </CCol>
          <!-- email -->
          <CCol xs="6">
            <CFormLabel for="add-user-email">Email</CFormLabel>
            <CFormInput
              id="add-user-email"
              type="email"
              required
              v-model="editedItem.email"
              feedbackInvalid="Lütfen bir email giriniz"
            />
          </CCol>
          <!-- age enum -->
          <CCol md="6">
            <CFormLabel for="add-user-ageRangeEnum">Yaş Aralığı</CFormLabel>
            <CFormSelect
              id="add-user-age"
              required
              feedbackInvalid="Lütfen yaş aralığı seçiniz"
              v-model="editedItem.ageRangeEnum"
            >
              <option selected="" disabled="" value="">Seçiniz...</option>
              <option value="_UNSPECIFIED">Belirtmek istemiyorum</option>
            </CFormSelect>
          </CCol>
          <!-- gender enum -->
          <CCol md="6">
            <CFormLabel for="add-doctor-branch">Cinsiyet</CFormLabel>
            <CFormSelect
              id="add-user-gender"
              required
              feedbackInvalid="Lütfen Cinsiyet seçiniz"
              v-model="editedItem.genderEnum"
            >
              <option selected="" disabled="" value="">Seçiniz...</option>
              <option value="FEMALE">Kadın</option>
              <option value="MALE">Erkek</option>
            </CFormSelect>
          </CCol>
          <CModalFooter class="pe-0">
            <CButton color="secondary" @click="closeModal('updateUserModal')"
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
    <!-- Delete user modal -->
    <CModal
      size="lg"
      :visible="openedModals.deleteUserModal"
      @close="closeModal('deleteUserModal')"
    >
      <CModalHeader>
        <CModalTitle
          >Kullanıcı <span class="text-danger">Sil</span></CModalTitle
        >
      </CModalHeader>
      <CModalBody>
        <h5>
          Bu işlemi geri alamazsınız. Kullanıcı bilgilerini
          <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
        </h5>
        <CModalFooter class="pe-0">
          <CButton color="secondary" @click="closeModal('deleteUserModal')"
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
import userInfoDTO from '@/models/userInfoDTO'
export default {
  name: 'Colors',
  components: {
    EasyDataTable: window['vue3-easy-data-table'],
  },
  data() {
    return {
      avatar: avatar,
      headers: [
        { text: 'İsim', value: 'firstName', sortable: true },
        { text: 'Soyisim', value: 'lastName', sortable: true },
        { text: 'Kullanıcı Adı', value: 'userName' },
        { text: 'Yaş Aralığı', value: 'ageRangeEnum' },
        { text: 'Cinsiyet', value: 'genderEnum' },
        { text: 'Email', value: 'email' },
        { text: 'Makale Sayısı', value: 'articleCount' },
        { text: 'Beğenme Sayısı', value: 'likedCount' },
        { text: 'Kaydetme Sayısı', value: 'savedCount' },
        { text: 'İşlemler', value: 'operations' },
      ],
      editedItem: userInfoDTO.createEmpty(),
      addedItem: userInfoDTO.createEmpty(),
      items: [],
      themeColor: '#321fdb',
      itemsSelected: [],
      rowsPerPage: 10,
      openedModals: {
        addUserModal: false,
        deleteUserModal: false,
        updateUserModal: false,
      },
      validationChecked: false,
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
    }
  },
  created() {
    this.getUsers(this.userTable.serverOptions)
  },
  watch: {
    'userTable.serverOptions'(newvalue) {
      this.getUsers(newvalue)
    },
  },
  methods: {
    ...mapActions({
      getUserAPI: 'user/getUsers',
      deleteUserAPI: 'user/deleteUser',
      addUserAPI: 'user/addUser',
      updateUserAPI: 'user/updateUser',
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
        case 'addUserModal':
          {
            this.addUser(data)
          }
          break
        case 'updateUserModal':
          {
            this.updateUser(data)
          }
          break
      }
    },
    showModal(modalname, data) {
      this.selectedUser = data ? JSON.parse(JSON.stringify(data)) : {}
      switch (modalname) {
        case 'updateUserModal':
          {
            let cachedItemData = JSON.parse(JSON.stringify(data))
            this.editedItem = cachedItemData
          }
          break
        case 'showUserModal':
          {
            this.getUser(this.userTable.serverOptions, data)
            console.log(data)
          }
          break
        case 'deleteUserModal': {
          console.log(data)
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
          case 'addUserModal':
            {
              this.addedItem = userInfoDTO.createEmpty()
            }
            break
          case 'deleteUserModal':
            {
              this.selectedUser = {}
            }
            break
          case 'updateUserModal':
            {
              this.editedItem = userInfoDTO.createEmpty()
            }
            break
        }
      }
      this.queueEnableSendButton()
    },
    async getUsers(pageOptions) {
      this.userTable.loading = true
      const response = await this.getUserAPI(pageOptions)
      this.items = response.data
      this.userTable.serverItemsLength = response.totalElements
      this.userTable.loading = false
    },
    async addUser(data) {
      const response = await this.addUserAPI(data)
      if (response === true) {
        new Toast(
          'New user ' + data.userName + ' added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getUsers(this.userTable.serverOptions)
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
    async updateUser(newuserData) {
      const response = await this.updateUserAPI(newuserData)
      if (response === true) {
        new Toast(
          'User updated successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getUsers(this.userTable.serverOptions)
        this.closeModal('updateUserModal')
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
      const response = await this.deleteUserAPI(uuid)
      if (response === true) {
        new Toast('Silindi', 'success', true, 'text-white align-items-center')
        this.getUsers(this.userTable.serverOptions)
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
