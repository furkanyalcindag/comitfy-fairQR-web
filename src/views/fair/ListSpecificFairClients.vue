<template>
  <CRow>
    <CCol class="justify-content-start">
      <CCard>
        <CCardHeader>
          <CRow class="align-content-start">
            <CCol xs="10" md="10" sm="10">
              Fuar İsmi Fuar Yeri Fuar Başlama Saati Fuar Bitiş Saati
            </CCol>
            <CCol>
              <CButton
                style="height: 20px"
                class="d-flex float-end align-items-center"
                color="primary"
                shape="rounded-pill"
                @click="showModal('addClientModal')"
                ><small>Ekle</small></CButton
              >
            </CCol>
          </CRow>

          <CRow>
            <CCol class="text-center mt-1">
              <h4>Katılımcı Listesi</h4>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody class="p-0">
          <easy-data-table
            show-index
            v-model:itemsSelected="itemsSelected"
            v-model:server-options="fairClientsTable.serverOptions"
            :server-items-length="fairClientsTable.serverItemsLength"
            :headers="headers"
            :items="items"
            :theme-color="themeColor"
            buttons-pagination
            :loading="fairClientsTable.loading"
            :rows-items="fairClientsTable.rowsItem"
          >
            <template #item-name="{ firstName, lastName }">
              <div>{{ firstName }} {{ lastName }}</div>
            </template>

            <template #item-companyName="{ companyName }">
              <div class="position-relative d-inline-block">
                <CTooltip :content="companyName" placement="top">
                  <template #toggler="{ on }">
                    <div
                      v-on="on"
                      style="max-width: 200px"
                      class="d-inline-block text-truncate"
                    >
                      {{ companyName }}
                    </div>
                  </template>
                </CTooltip>
              </div>
            </template>
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
                    @click="showModal('updateClientModal', item)"
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
                    @click="showModal('deleteClientModal', item)"
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
    <!-- Add Fair -->
    <CModal
      backdrop="static"
      size="lg"
      :visible="openedModals.addClientModal"
      @close="closeModal('addClientModal')"
    >
      <CModalHeader>
        <CModalTitle>Katılımcı Ekle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'addClientModal', addedItem.data)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <!-- Firstname -->
          <CCol md="6">
            <CFormLabel for="add-fair-client-firstname"
              >Katılımcı Adı<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="add-fair-client-firstname"
              required
              feedbackInvalid="Lütfen isim giriniz"
              v-model="addedItem.data.firstName"
              autocomplete="off"
            />
          </CCol>
          <!-- Lastname -->
          <CCol md="6">
            <CFormLabel for="add-fair-client-lastname"
              >Katılımcı Soyadı<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="add-fair-client-lastname"
              required
              feedbackInvalid="Lütfen soyisim giriniz"
              v-model="addedItem.data.lastName"
              autocomplete="off"
            />
          </CCol>
          <!-- Mobile Phone -->
          <CCol md="6">
            <CFormLabel for="add-fair-client-mobilephone"
              >Telefon Numarası<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="add-fair-client-mobilephone"
              required
              feedbackInvalid="Lütfen bir telefon numarası giriniz"
              v-model="addedItem.data.mobilePhone"
              autocomplete="off"
            />
          </CCol>
          <!-- Email -->
          <CCol md="6">
            <CFormLabel for="add-fair-client-email"
              >Email<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="add-fair-client-email"
              required
              feedbackInvalid="Lütfen bir email giriniz"
              v-model="addedItem.data.email"
              autocomplete="off"
            />
          </CCol>
          <!-- Company Name -->
          <CCol md="12">
            <CFormLabel for="add-fair-client-companyname"
              >Firma Adı<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="add-fair-client-companyname"
              required
              feedbackInvalid="Lütfen bir firma adı giriniz"
              v-model="addedItem.data.companyName"
              autocomplete="off"
            />
          </CCol>

          <CModalFooter class="pe-0">
            <CButton
              color="secondary"
              @click="closeModal('addClientModal', true)"
              >İptal</CButton
            >
            <CButton
              color="success"
              :type="isAbleToPushButton ? 'submit' : null"
            >
              Ekle</CButton
            >
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
    <!-- Delete Fair -->
    <CModal
      backdrop="static"
      size="lg"
      :visible="openedModals.deleteClientModal"
      @close="closeModal('deleteClientModal')"
    >
      <CModalHeader>
        <CModalTitle
          >Katılımcı <span class="text-danger">Sil</span></CModalTitle
        >
      </CModalHeader>
      <CModalBody>
        <h5>
          Bu işlemi geri alamazsınız. Katılımcı bilgilerini
          <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
        </h5>
        <CModalFooter class="pe-0">
          <CButton color="secondary" @click="closeModal('deleteClientModal')"
            >Kapat</CButton
          >
          <CButton
            color="danger"
            @click="
              isAbleToPushButton ? deleteCategory(selectedClient.uuid) : null
            "
            >SİL</CButton
          >
        </CModalFooter>
      </CModalBody>
    </CModal>
    <!-- Update Fair -->
    <CModal
      backdrop="static"
      size="lg"
      :visible="openedModals.updateClientModal"
      @close="closeModal('updateClientModal')"
    >
      <CModalHeader>
        <CModalTitle>Katılımcı Düzenle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'updateClientModal', editedItem.data)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <!-- Firstname -->
          <CCol md="6">
            <CFormLabel for="edit-fair-client-firstname"
              >Katılımcı Adı<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="edit-fair-client-firstname"
              required
              feedbackInvalid="Lütfen isim giriniz"
              v-model="editedItem.data.firstName"
              autocomplete="off"
            />
          </CCol>
          <!-- Lastname -->
          <CCol md="6">
            <CFormLabel for="edit-fair-client-lastname"
              >Katılımcı Soyadı<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="edit-fair-client-lastname"
              required
              feedbackInvalid="Lütfen soyisim giriniz"
              v-model="editedItem.data.lastName"
              autocomplete="off"
            />
          </CCol>
          <!-- Mobile Phone -->
          <CCol md="6">
            <CFormLabel for="edit-fair-client-mobilephone"
              >Telefon Numarası<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="edit-fair-client-mobilephone"
              required
              feedbackInvalid="Lütfen bir telefon numarası giriniz"
              v-model="editedItem.data.mobilePhone"
              autocomplete="off"
            />
          </CCol>
          <!-- Email -->
          <CCol md="6">
            <CFormLabel for="edit-fair-client-email"
              >Email<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="edit-fair-client-email"
              required
              feedbackInvalid="Lütfen bir email giriniz"
              v-model="editedItem.data.email"
              autocomplete="off"
            />
          </CCol>
          <!-- Company Name -->
          <CCol md="12">
            <CFormLabel for="edit-fair-client-companyname"
              >Firma Adı<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="edit-fair-client-companyname"
              required
              feedbackInvalid="Lütfen bir firma adı giriniz"
              v-model="editedItem.data.companyName"
              autocomplete="off"
            />
          </CCol>

          <CModalFooter class="pe-0">
            <CButton color="secondary" @click="closeModal('updateClientModal')"
              >Kapat</CButton
            >
            <CButton
              color="success"
              :type="isAbleToPushButton ? 'submit' : null"
              >Değişiklikleri Kaydet</CButton
            >
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
  </CRow>
</template>

<script>
import avatar from '@/assets/images/avatars/8.jpg'
import { mapActions } from 'vuex'
import fairClientDTO from '@/models/fairClientDTO'
import axios from 'axios'
// import Toast from '@/models/create_TOAST_dto'
export default {
  name: 'Colors',
  components: {
    EasyDataTable: window['vue3-easy-data-table'],
  },
  props: ['id'],

  data() {
    return {
      avatar: avatar,
      headers: [
        { text: 'İsim', value: 'name', sortable: true },
        { text: 'Firma Adı', value: 'companyName' },
        { text: 'Telefon', value: 'mobilePhone' },
        { text: 'Email', value: 'email' },
        { text: 'İşlemler', value: 'operations' },
      ],
      items: [],
      addedItem: {
        // Real data
        data: fairClientDTO.createEmpty(),
      },
      editedItem: {
        // Real data
        data: fairClientDTO.createEmpty(),
      },
      themeColor: '#321fdb',
      itemsSelected: [],
      openedModals: {
        addClientModal: false,
        deleteClientModal: false,
        updateClientModal: false,
      },
      fairClientsTable: {
        serverItemsLength: 0,
        serverOptions: {
          page: 1,
          rowsPerPage: 10,
        },
        rowsItem: [10, 20, 50],
        loading: true,
      },
      validationChecked: false,
      isAbleToPushButton: true,
      selectedClient: {},
    }
  },
  watch: {
    'fairClientsTable.serverOptions'(newvalue) {
      this.getFairs(newvalue)
    },
  },
  mounted() {
    ;(this.isMounted = true), this.login()
  },
  created() {
    this.getFairs(this.fairClientsTable.serverOptions)
  },
  methods: {
    ...mapActions({
      getAllCategoryAPI: 'fair/getFairClients',
      deleteCategoryAPI: 'fair/deleteFairClient',
      updateCategoryAPI: 'fair/updateFairClient',
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
        case 'addClientModal':
          {
            this.addCategory(JSON.parse(JSON.stringify(data)))
          }
          break
        case 'updateClientModal':
          {
            this.updateCategory(JSON.parse(JSON.stringify(data)))
          }
          break
      }
    },
    // Setting selectedClient every showmodal trigger is not correct idea. It can cause failures due to this. ------------------IMPORTANT
    async showModal(modalname, data) {
      switch (modalname) {
        case 'addClientModal':
          {
            // If the modal is reseted then reassign current date
            if (this.addedItem.startTime == null) {
              this.addedItem.startTime = new Date().toISOString()
              this.addedItem.endTime = null
            }
          }
          break
        case 'updateClientModal':
          {
            this.selectedClient = data ? JSON.parse(JSON.stringify(data)) : {}
          }
          break
      }
      this.openedModals[modalname] = true
    },
    async closeModal(modalname, resetData) {
      this.openedModals[modalname] = false
      this.validationChecked = false
      if (resetData) {
        switch (modalname) {
          case 'addClientModal':
            {
              // Restore added item on clicking "No/Deny"
              this.addedItem = {
                data: fairClientDTO.createEmpty(),
              }
            }
            break
          case 'deleteClientModal':
            {
              this.selectedClient = {}
            }
            break
        }
      }
      this.queueEnableSendButton()
    },
    // eslint-disable-next-line no-unused-vars
    async getFairs(pageOptions) {
      this.fairClientsTable.loading = true
      this.data = [
        fairClientDTO.createFromJson({
          uuid: 'UUID',
          firstName: 'İSİM',
          lastName: 'SOYİSİM',
          mobilePhone: 'MOBILE PHONE',
          companyName: 'COMPANY NAME',
          email: 'EMAIL',
        }),
      ]
      this.items = this.data
      this.fairClientsTable.loading = false
    },
    login() {
      axios.get('https://jsonplaceholder.typicode.com/posts/1').catch(() => {})
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
