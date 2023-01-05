<template>
  <CRow>
    <CCol class="justify-content-start">
      <CCard>
        <CCardHeader>
          <!-- <CIcon icon="cil-user" /> -->
          <CRow>
            <CCol lg="3" class="text-left mt-3">
              <h2>Hastalarım</h2>
            </CCol>
            <CCol lg="9" class="text-right mt-3">
              <CButton
                color="primary"
                class="float-end"
                shape="rounded-pill"
                @click="showModal('addPatientModal')"
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
            v-model:server-options="patientTable.serverOptions"
            :server-items-length="patientTable.serverItemsLength"
            :headers="headers"
            :items="items"
            :theme-color="themeColor"
            buttons-pagination
            :loading="patientTable.loading"
            :rows-items="patientTable.rowsItem"
          >
            <template #item-name="{ firstName, lastName }">
              <div>{{ firstName }} {{ lastName }}</div>
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
                      content: 'Raporlar',
                      placement: 'top',
                    }"
                    @click="$router.push({ name: 'Patient Sick Report' })"
                  >
                    <CIcon icon="cil-address-book" />
                  </CButton>
                  <CButton
                    color="warning"
                    class="ms-2 text-white align-items-center"
                    shape="rounded-pill"
                    size="sm"
                    v-c-tooltip="{
                      content: 'Düzenle',
                      placement: 'top',
                    }"
                    @click="showModal('updatePatientModal', item)"
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
                    @click="showModal('deletePatientModal', item)"
                  >
                    <CIcon icon="cil-trash" />
                  </CButton>
                </CButtonGroup>
              </div>
            </template>
            <template #item-description="{ description }">
              <div class="position-relative d-inline-block">
                <CTooltip :content="description" placement="top">
                  <template #toggler="{ on }">
                    <div
                      v-on="on"
                      style="max-width: 200px"
                      class="d-inline-block text-truncate"
                    >
                      {{ description }}
                    </div>
                  </template>
                </CTooltip>
              </div>
            </template>
          </easy-data-table>
        </CCardBody>
      </CCard>
    </CCol>
    <!-- Add Patient Appointment -->
    <CModal
      backdrop="static"
      size="lg"
      :visible="openedModals.addPatientModal"
      @close="closeModal('addPatientModal')"
    >
      <CModalHeader>
        <CModalTitle>Hasta Ekle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'addPatientModal', addedItem.data)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          ADD

          <CModalFooter class="pe-0">
            <CButton
              color="secondary"
              @click="closeModal('addPatientModal', true)"
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
    <!-- Delete Patient Appointment -->
    <CModal
      size="lg"
      :visible="openedModals.deletePatientModal"
      @close="closeModal('deletePatientModal')"
    >
      <CModalHeader>
        <CModalTitle>Hasta <span class="text-danger">Sil</span></CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h5>
          Bu işlemi geri alamazsınız. Hasta bilgilerini
          <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
        </h5>
        <CModalFooter class="pe-0">
          <CButton color="secondary" @click="closeModal('deletePatientModal')"
            >Kapat</CButton
          >
          <CButton
            color="danger"
            @click="
              isAbleToPushButton
                ? deletePatient(selectedPatientAppointment.uuid)
                : null
            "
            >SİL</CButton
          >
        </CModalFooter>
      </CModalBody>
    </CModal>
    <!-- Update Patient Appointment -->
    <CModal
      size="lg"
      :visible="openedModals.updatePatientModal"
      @close="closeModal('updatePatientModal')"
    >
      <CModalHeader>
        <CModalTitle>Hasta Düzenle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'updatePatientModal', editedItem.data)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <CModalFooter class="pe-0">
            <CButton color="secondary" @click="closeModal('updatePatientModal')"
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
import patientDTO from '@/models/patientDTO'
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
        { text: 'Hasta Adı Soyadı', value: 'name', sortable: true },
        { text: 'Telefon', value: 'phone' },
        { text: 'Adres', value: 'address' },
        { text: 'Not', value: 'description' },
        { text: 'İşlemler', value: 'operations' },
      ],
      items: [],
      addedItem: {
        // Real data
        data: patientDTO.createEmpty(),
      },
      editedItem: {
        // Real data
        data: patientDTO.createEmpty(),
      },
      themeColor: '#321fdb',
      itemsSelected: [],
      openedModals: {
        addPatientModal: false,
        deletePatientModal: false,
        updatePatientModal: false,
      },
      patientTable: {
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
      selectedPatientAppointment: patientDTO.createEmpty(),
    }
  },
  watch: {
    'patientTable.serverOptions'(newvalue) {
      this.getPatients(newvalue)
    },
  },
  created() {
    this.getPatients(this.patientTable.serverOptions)
  },
  methods: {
    ...mapActions({
      getPatientsAPI: 'doctor/getPatients',
      addPatientAPI: 'doctor/addPatient',
      deletePatientAPI: 'doctor/deletePatient',
      updatePatientAPI: 'doctor/updatePatient',
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
        case 'addPatientModal':
          {
            this.addPatient(JSON.parse(JSON.stringify(data)))
          }
          break
        case 'updatePatientModal':
          {
            this.updatePatient(JSON.parse(JSON.stringify(data)))
          }
          break
      }
    },
    async showModal(modalname, data) {
      switch (modalname) {
        case 'addPatientModal':
          break
        case 'updatePatientModal':
          {
            console.log(patientDTO.createEmpty())
            this.selectedPatientAppointment = data
              ? JSON.parse(
                  JSON.stringify(
                    patientDTO.createFromJson(JSON.parse(JSON.stringify(data))),
                  ),
                )
              : patientDTO.createEmpty()

            if (data) {
              this.editedItem.data = patientDTO.createFromJson(
                JSON.parse(JSON.stringify(data)),
              )
            } else {
              new Toast(
                'Something went wrong',
                'danger',
                true,
                'text-white align-items-center',
              )
            }
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
          case 'addPatientModal':
            {
              // Restore added item on clicking "No/Deny"
              this.addedItem = {
                data: patientDTO.createEmpty(),
              }
            }
            break
        }
      }
      this.queueEnableSendButton()
    },
    // eslint-disable-next-line no-unused-vars
    async getPatients(pageOptions) {
      this.patientTable.loading = true
      /*const response = await this.getPatientsAPI({
        pageOptions: pageOptions,
        filter: null,
      })
      this.items = response.data
      this.patientTable.serverItemsLength = response.totalElements
      */
      this.items = [
        patientDTO.createFromJson({
          uuid: '123',
          firstName: 'firstName',
          lastName: 'lastName',
          address: 'address',
          description: 'description',
          phone: 'phone(telNO)',
        }),
      ]
      this.patientTable.loading = false
    },
    async addPatient(data) {
      const response = await this.addPatientAPI(data)
      if (response === true) {
        new Toast(
          'Category added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.reloadTable()
        this.closeModal('addPatientModal', true)
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
    async updatePatient(newPatientAppointmentData) {
      const response = await this.updatePatientAPI(newPatientAppointmentData)
      if (response === true) {
        new Toast(
          'Category updated successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.reloadTable()
        this.closeModal('updatePatientModal')
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
    async deletePatient(uuid) {
      this.isAbleToPushButton = false
      const response = await this.deletePatientAPI(uuid)
      if (response === true) {
        this.selectedPatientAppointment = patientDTO.createEmpty()
        new Toast(
          'Category deleted successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.reloadTable()
        this.closeModal('deletePatientModal')
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white -align-items-center',
        )
        this.queueEnableSendButton()
      }
    },
    async queueEnableSendButton() {
      await this.$store.dispatch('invokeSendButtonDelay')
      this.isAbleToPushButton = true
    },
    async reloadTable(tableName) {
      switch (tableName) {
        // Main table
        default:
          {
            this.getPatients(this.patientTable.serverOptions)
          }
          break
      }
    },
  },
}
</script>

<style lang="css" scoped>
.rounder {
  border-radius: 50%;
}
</style>
