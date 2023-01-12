<template>
  <CRow>
    <CRow v-if="isLoadingFair" class="justify-content-center">
      <CSpinner color="dark" />
    </CRow>
    <CCol v-else-if="isLoadingFair === false" class="justify-content-start">
      <CRow class="mb-2">
        <CForm
          @submit.prevent="
            isAbleToPushButton ? handleParticipantSearch() : null
          "
          class="position-relative"
        >
          <CInputGroup class="position-relative end-0">
            <CFormInput
              id="exampleColorInput"
              class="mb-1 me-2"
              style="padding-right: 44px"
              placeholder="E-posta ile  katılımcı  Ara.."
              shape="rounded-pill"
              v-model="searchText"
            />
            <CButton
              color="primary"
              class="float-end position-absolute end-0 bottom-0"
              style="z-index: 10"
              shape="rounded-pill"
              size="lg"
              :type="isAbleToPushButton ? 'submit' : null"
              ><CIcon icon="cil-Search"
            /></CButton>
          </CInputGroup>
        </CForm>
      </CRow>
      <CCard>
        <CCardHeader>
          <CRow class="align-content-start">
            <CCol xs="10" md="10" sm="10">
              {{ selectedFair.name }} | {{ selectedFair.place }} |
              {{ selectedFair.startDate }} - {{ selectedFair.endDate }} |
              <span v-if="selectedFair.active" class="text-success">Aktif</span>
              <span v-else class="text-danger">Aktif Değil</span>
            </CCol>
            <CCol>
              <CButton
                style="height: 20px"
                class="d-flex float-end align-items-center"
                color="primary"
                shape="rounded-pill"
                @click="showModal('addParticipantModal')"
                ><small>Ekle</small></CButton
              >
              <CButton
                style="height: 20px"
                shape="rounded-pill"
                color="primary"
                class="d-flex float-end align-items-center px-2 mx-1"
                @click="
                  isAbleToPushButton
                    ? handleParticipantListExcelDownload()
                    : null
                "
                ><small>Excel</small></CButton
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
            v-model:server-options="fairParticipantsTable.serverOptions"
            :server-items-length="fairParticipantsTable.serverItemsLength"
            :headers="headers"
            :items="items"
            :theme-color="themeColor"
            buttons-pagination
            :loading="fairParticipantsTable.loading"
            :rows-items="fairParticipantsTable.rowsItem"
            rows-per-page-message="sayfa"
          >
            <template #item-name="{ firstName, lastName }">
              <div>{{ firstName }} | {{ lastName }}</div>
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
                    @click="showModal('updateParticipantModal', item)"
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
                    @click="showModal('deleteParticipantModal', item)"
                  >
                    <CIcon icon="cil-trash" />
                  </CButton>
                  <CButton
                    color="primary"
                    class="ms-2 text-white align-items-center"
                    shape="rounded-pill"
                    size="sm"
                    v-c-tooltip="{
                      content: 'PDF',
                      placement: 'top',
                    }"
                    @click="getParticipantPDF({ participant: item })"
                  >
                    <CIcon icon="cil-address-book" />
                  </CButton>
                </CButtonGroup>
              </div>
            </template>
          </easy-data-table>
        </CCardBody>
      </CCard>
    </CCol>
    <h2 v-else class="text-center">Fuar Bulunamadı</h2>
    <!-- Add FairParticipant -->
    <CModal
      backdrop="static"
      size="lg"
      :visible="openedModals.addParticipantModal"
      @close="closeModal('addParticipantModal')"
    >
      <CModalHeader>
        <CModalTitle>Katılımcı Ekle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'addParticipantModal', addedItem.data)
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
              type="email"
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
              @click="closeModal('addParticipantModal', true)"
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
    <!-- Delete FairParticipant -->
    <CModal
      backdrop="static"
      size="lg"
      :visible="openedModals.deleteParticipantModal"
      @close="closeModal('deleteParticipantModal')"
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
          <CButton
            color="secondary"
            @click="closeModal('deleteParticipantModal')"
            >Kapat</CButton
          >
          <CButton
            color="danger"
            @click="
              isAbleToPushButton
                ? deleteParticipant({
                    participantUUID: selectedParticipant.uuid,
                  })
                : null
            "
            >SİL</CButton
          >
        </CModalFooter>
      </CModalBody>
    </CModal>
    <!-- Update FairParticipant -->
    <CModal
      backdrop="static"
      size="lg"
      :visible="openedModals.updateParticipantModal"
      @close="closeModal('updateParticipantModal')"
    >
      <CModalHeader>
        <CModalTitle>Katılımcı Düzenle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'updateParticipantModal', editedItem.data)
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
              type="email"
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
            <CButton
              color="secondary"
              @click="closeModal('updateParticipantModal')"
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
import { mapActions } from 'vuex'
import fairClientDTO from '@/models/fairParticipantDTO'
import fairDTO from '@/models/fairDTO'
import Toast from '@/models/create_TOAST_dto'
import FairParticipantDTO from '@/models/fairParticipantDTO'

export default {
  name: 'Fair Clients List',
  components: {
    EasyDataTable: window['vue3-easy-data-table'],
  },
  props: ['uuid'],
  data() {
    return {
      headers: [
        { text: 'İsim', value: 'name', sortable: true },
        { text: 'Firma Adı', value: 'companyName' },
        { text: 'Telefon', value: 'mobilePhone' },
        { text: 'Email', value: 'email' },
        { text: 'İşlemler', value: 'operations' },
      ],
      items: [],
      searchText: '',
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
        addParticipantModal: false,
        deleteParticipantModal: false,
        updateParticipantModal: false,
      },
      fairParticipantsTable: {
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
      selectedParticipant: {},
      selectedFair: fairDTO.createEmpty(),
      isLoadingFair: true,
    }
  },
  watch: {
    'fairParticipantsTable.serverOptions'(newvalue) {
      this.getFairParticipants({ pageOptions: newvalue, fairUUID: this.uuid })
    },
  },
  created() {
    this.getFair({ uuid: this.uuid })
  },
  methods: {
    ...mapActions({
      getFairAPI: 'fair/getFair',
      getParticipantsByFairAPI: 'fairParticipant/getParticipantsByFair',
      getParticipantBySearchAPI: 'fairParticipant/getParticipantsBySearch',
      addParticipantToFairAPI: 'fairParticipant/addParticipantToFair',
      deletePaticipantAPI: 'fairParticipant/deleteParticipant',
      updateParticipantAPI: 'fairParticipant/updateParticipant',
      getParticipantPDFAPI: 'fairParticipant/getParticipantPDF',
      getParticipantListExcelAPI: 'fairParticipant/getParticipantListExcel',
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
        case 'addParticipantModal':
          {
            this.addParticipantToFair({
              participant: JSON.parse(JSON.stringify(data)),
              fairUUID: this.uuid,
            })
          }
          break
        case 'updateParticipantModal':
          {
            this.updateParticipant({
              newParticipantData: JSON.parse(JSON.stringify(data)),
            })
          }
          break
      }
    },
    // Setting selectedParticipant every showmodal trigger is not correct idea. It can cause failures due to this. ------------------IMPORTANT
    async showModal(modalname, data) {
      switch (modalname) {
        case 'addParticipantModal':
          break
        case 'updateParticipantModal':
          {
            this.selectedParticipant = data
              ? JSON.parse(JSON.stringify(data))
              : {}
            let cachedItemData = JSON.parse(JSON.stringify(data))
            this.editedItem.data = cachedItemData
          }
          break
        case 'deleteParticipantModal':
          {
            this.selectedParticipant = data
              ? FairParticipantDTO.createFromJson(
                  JSON.parse(JSON.stringify(data)),
                )
              : {}
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
          case 'addParticipantModal':
            {
              // Restore added item on clicking "No/Deny"
              this.addedItem = {
                data: fairClientDTO.createEmpty(),
              }
            }
            break
          case 'deleteParticipantModal':
            {
              this.selectedParticipant = FairParticipantDTO.createEmpty()
            }
            break
        }
      }
      this.queueEnableSendButton()
    },
    // NAMED PARAMETER NEEDED FOR API ---------IMPORTANT
    async getFair({ uuid = null }) {
      this.fairParticipantsTable.loading = true
      const response = await this.getFairAPI(uuid)
      if (response == null) {
        this.isLoadingFair = null
      } else {
        this.isLoadingFair = false
        this.selectedFair = response
          ? fairDTO.createFromJson(JSON.parse(JSON.stringify(response)))
          : null
        this.getFairParticipants({
          pageOptions: this.fairParticipantsTable.serverOptions,
          fairUUID: this.uuid,
        })
      }
    },
    async getFairParticipants({ pageOptions, fairUUID }) {
      this.fairParticipantsTable.loading = true
      const response = await this.getParticipantsByFairAPI({
        page: pageOptions,
        fairUUID: fairUUID,
      })
      this.items = response ? response.data : []
      this.fairParticipantsTable.serverItemsLength = response.totalElements
      this.fairParticipantsTable.loading = false
    },
    async addParticipantToFair({ participant, fairUUID }) {
      const response = await this.addParticipantToFairAPI({
        participant: participant,
        fairUUID: fairUUID,
      })
      if (response == true) {
        new Toast(
          'Yeni Katılımcı ' + participant.firstName + ' ekleme Başarılı!',
          'success',
          true,
          'text-white align-items-center',
        )
        this.closeModal('addParticipantModal', true)
        this.getFairParticipants({
          pageOptions: this.fairParticipantsTable.serverOptions,
          fairUUID: this.uuid,
        })
      } else {
        new Toast(
          'Bir şeyler ters gitti',
          'danger',
          true,
          'text-white align-items-center',
        )
        this.queueEnableSendButton()
      }
    },
    async updateParticipant({ newParticipantData }) {
      const response = await this.updateParticipantAPI({
        participantData: newParticipantData,
      })
      if (response === true) {
        new Toast(
          'Fuar Katılımcısı Başarıyla Güncellendi',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getFairParticipants({
          pageOptions: this.fairParticipantsTable.serverOptions,
          fairUUID: this.uuid,
        })
        this.closeModal('updateParticipantModal')
      } else {
        new Toast(
          'Bir şeyler ters gitti!',
          'danger',
          true,
          'text-white align-items-center',
        )
        this.queueEnableSendButton()
      }
    },
    async deleteParticipant({ participantUUID = null }) {
      this.isAbleToPushButton = false
      const response = await this.deletePaticipantAPI({
        participantUUID: participantUUID,
      })
      if (response === true) {
        new Toast(
          'Silme işlemi Başarılı',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getFairParticipants({
          pageOptions: this.fairParticipantsTable.serverOptions,
          fairUUID: this.uuid,
        })
        this.closeModal('deleteParticipantModal', true)
      } else {
        new Toast(
          'Bir şeyler ters gitti!',
          'danger',
          true,
          'text-white -align-items-center',
        )
        this.queueEnableSendButton()
      }
    },
    async getParticipantPDF({ participant }) {
      const response = await this.getParticipantPDFAPI({
        participant: participant,
      })
      if (response == true) {
        new Toast(
          'PDF indiriliyor...',
          'success',
          true,
          'text-white align-items-center',
        )
      } else {
        new Toast(
          'Bir şeyler ters gitti!',
          'danger',
          true,
          'text-white align-items-center',
        )
      }
      this.queueEnableSendButton()
    },
    async handleParticipantSearch() {
      this.isAbleToPushButton = false
      this.fairParticipantsTable.loading = true
      const response = await this.getParticipantBySearchAPI({
        searchText: this.searchText,
        pageOptions: this.fairParticipantsTable.serverOptions,
        id: this.uuid,
      })
      this.fairParticipantsTable.loading = false
      this.items = response ? (response.data ? response.data : []) : []
      this.queueEnableSendButton()
    },

    async handleParticipantListExcelDownload() {
      this.isAbleToPushButton = false
      const response = await this.getParticipantListExcelAPI({
        fair: this.selectedFair,
      })
      if (response == true) {
        new Toast(
          'Excel indiriliyor...',
          'success',
          true,
          'text-white align-items-center',
        )
      } else {
        new Toast(
          'Bir şeyler ters gitti!',
          'danger',
          true,
          'text-white align-items-center',
        )
      }
      this.queueEnableSendButton()
    },

    // eslint-disable-next-line no-unused-vars
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
