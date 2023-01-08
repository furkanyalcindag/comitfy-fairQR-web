<template>
  <CRow>
    <CCol class="justify-content-start">
      <CCard>
        <CCardHeader>
          <!-- <CIcon icon="cil-user" /> -->
          <CRow>
            <CCol lg="3" class="text-left mt-3">
              <h2>Fuar Listesi</h2>
            </CCol>
            <CCol lg="9" class="text-right mt-3">
              <CButton
                color="primary"
                class="float-end"
                shape="rounded-pill"
                @click="showModal('addFairModal')"
                >Ekle</CButton
              >
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody class="p-0">
          <easy-data-table
            show-index
            v-model:itemsSelected="itemsSelected"
            v-model:server-options="fairTable.serverOptions"
            :server-items-length="fairTable.serverItemsLength"
            :headers="headers"
            :items="items"
            :theme-color="themeColor"
            buttons-pagination
            :loading="fairTable.loading"
            :rows-items="fairTable.rowsItem"
          >
            <template #item-name="{ name }">
              <div class="position-relative d-inline-block">
                <CTooltip :content="name" placement="top">
                  <template #toggler="{ on }">
                    <div
                      v-on="on"
                      style="max-width: 200px"
                      class="d-inline-block text-truncate"
                    >
                      {{ name }}
                    </div>
                  </template>
                </CTooltip>
              </div>
            </template>
            <template #item-place="{ place }">
              <div class="position-relative d-inline-block">
                <CTooltip :content="place" placement="top">
                  <template #toggler="{ on }">
                    <div
                      v-on="on"
                      style="max-width: 200px"
                      class="d-inline-block text-truncate"
                    >
                      {{ place }}
                    </div>
                  </template>
                </CTooltip>
              </div>
            </template>
            <template #item-active="{ active }">
              <CIcon v-if="active" icon="cil-check-alt" />
              <CIcon v-else icon="cil-x" />
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
                    @click="showModal('updateFairModal', item)"
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
                    @click="showModal('deleteFairModal', item)"
                  >
                    <CIcon icon="cil-trash" />
                  </CButton>
                  <CButton
                    color="success"
                    class="ms-2 text-white align-items-center"
                    shape="rounded-pill"
                    size="sm"
                    v-c-tooltip="{
                      content: 'Müşterileri',
                      placement: 'top',
                    }"
                    @click="
                      $router.push({
                        name: 'FairClientList',
                        params: { uuid: item.uuid },
                      })
                    "
                  >
                    <CIcon icon="cil-list" />
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
      :visible="openedModals.addFairModal"
      @close="closeModal('addFairModal')"
    >
      <CModalHeader>
        <CModalTitle>Fuar Ekle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'addFairModal', addedItem.data)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <CCol md="12">
            <CFormLabel for="add-fair-name"
              >Fuar Adı<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="add-fair-name"
              required
              feedbackInvalid="Lütfen bir Fuar adı giriniz"
              v-model="addedItem.data.name"
              autocomplete="off"
            />
          </CCol>
          <CCol md="12">
            <CFormLabel for="add-fair-place"
              >Fuar Yeri<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="add-fair-place"
              required
              feedbackInvalid="Lütfen bir Fuar yeri giriniz"
              v-model="addedItem.data.place"
              autocomplete="off"
            />
          </CCol>
          <!-- Start Date and Time -->
          <CCol md="6">
            <CFormLabel for="add-fair-time-start">Başlangıç Tarihi</CFormLabel>
            <VueCtkDateTimePicker
              id="add-fair-time-start-value"
              v-model="addedItem.data.startDate"
              locale="tr"
              only-date
              :minDate="new Date().toISOString()"
              format="YYYY-MM-DD"
              formatted="ll"
              label="Başlangıç zamanını seçiniz"
              buttonNowTranslation="Şimdiki Zaman"
              @is-hidden="validateAddedItemDateRange()"
            />
            <CFormInput
              id="add-fair-time-start"
              required
              style="display: none"
              v-model="addedItem.data.startDate"
              autocomplete="off"
              feedbackInvalid="Lütfen bir tarih giriniz"
            ></CFormInput>
          </CCol>
          <!-- End Date and Time -->
          <CCol md="6">
            <CFormLabel for="add-fair-time-end">Bitiş Tarihi</CFormLabel>
            <VueCtkDateTimePicker
              id="add-fair-time-end-value"
              v-model="addedItem.data.endDate"
              locale="tr"
              only-date
              :minDate="addedItem.data.startDate"
              format="YYYY-MM-DD"
              formatted="ll"
              label="Bitiş zamanını seçiniz"
              buttonNowTranslation="Şimdiki Zaman"
              @is-hidden="validateAddedItemDateRange()"
            />
            <CFormInput
              id="add-fair-time-end"
              required
              style="display: none"
              v-model="addedItem.data.endDate"
              autocomplete="off"
              feedbackInvalid="Lütfen bir tarih giriniz"
            ></CFormInput>
            <!--              <CFormInput
                id="add-chat-room-start-time"
                required
                feedbackInvalid="Lütfen bir başlangıç zamanı giriniz"
                v-model="addedItem.data.startTime"
                autocomplete="off"
              />-->
            <!-- <VueCtkDateTimePicker
                id="EnabledDisabledDatesPicker"
                v-model="addedItem.data.endDate.endHalf"
                locale="tr"
                format="hh:mm:ss.mss"
                formatted="hh:mm"
                only-time
                no-label
              /> -->
          </CCol>
          <!-- Active State -->
          <CCol md="12">
            <CFormSwitch
              label="Aktif mi?"
              id="add-fair-active"
              v-model="addedItem.data.active"
            />
          </CCol>

          <CModalFooter class="pe-0">
            <CButton color="secondary" @click="closeModal('addFairModal', true)"
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
      :visible="openedModals.deleteFairModal"
      @close="closeModal('deleteFairModal')"
    >
      <CModalHeader>
        <CModalTitle>Fuar <span class="text-danger">Sil</span></CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h5>
          Bu işlemi geri alamazsınız. Fuar bilgilerini
          <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
        </h5>
        <CModalFooter class="pe-0">
          <CButton
            color="secondary"
            @click="closeModal('deleteFairModal', true)"
            >Kapat</CButton
          >
          <CButton
            color="danger"
            @click="isAbleToPushButton ? deleteFair(selectedFair.uuid) : null"
            >SİL</CButton
          >
        </CModalFooter>
      </CModalBody>
    </CModal>
    <!-- Update Fair -->
    <CModal
      backdrop="static"
      size="lg"
      :visible="openedModals.updateFairModal"
      @close="closeModal('updateFairModal')"
    >
      <CModalHeader>
        <CModalTitle>Fuar Düzenle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'updateFairModal', editedItem.data)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <CCol md="12">
            <CFormLabel for="edit-fair-name"
              >Fuar Adı<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="edit-fair-name"
              required
              feedbackInvalid="Lütfen bir Fuar adı giriniz"
              v-model="editedItem.data.name"
              autocomplete="off"
            />
          </CCol>

          <CCol md="12">
            <CFormLabel for="edit-fair-place"
              >Fuar Yeri<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="edit-fair-place"
              required
              feedbackInvalid="Lütfen bir Fuar yeri giriniz"
              v-model="editedItem.data.place"
              autocomplete="off"
            />
          </CCol>

          <CCol md="6">
            <CFormLabel for="edit-fair-time-start">Başlangıç Tarihi</CFormLabel>
            <VueCtkDateTimePicker
              id="edit-fair-time-start-value"
              v-model="editedItem.data.startDate"
              locale="tr"
              only-date
              :minDate="new Date().toISOString()"
              format="YYYY-MM-DD"
              formatted="ll"
              label="Başlangıç zamanını seçiniz"
              buttonNowTranslation="Şimdiki Zaman"
              @is-hidden="validateEditedItemDateRange()"
            />
            <CFormInput
              id="edit-fair-time-start"
              required
              style="display: none"
              v-model="editedItem.data.startDate"
              autocomplete="off"
              feedbackInvalid="Lütfen bir tarih giriniz"
            ></CFormInput>
          </CCol>
          <!-- End Date and Time -->
          <CCol md="6">
            <CFormLabel for="edit-fair-time-end">Bitiş Tarihi</CFormLabel>
            <VueCtkDateTimePicker
              id="edit-fair-time-end-value"
              v-model="editedItem.data.endDate"
              locale="tr"
              only-date
              :minDate="editedItem.data.startDate"
              format="YYYY-MM-DD"
              formatted="ll"
              label="Bitiş zamanını seçiniz"
              buttonNowTranslation="Şimdiki Zaman"
              @is-hidden="validateEditedItemDateRange()"
            />
            <CFormInput
              id="edit-fair-time-end"
              required
              style="display: none"
              v-model="editedItem.data.endDate"
              autocomplete="off"
              feedbackInvalid="Lütfen bir tarih giriniz"
            ></CFormInput>
          </CCol>

          <!-- Active State -->
          <CCol md="12">
            <CFormSwitch
              label="Aktif mi?"
              id="edit-fair-active"
              v-model="editedItem.data.active"
            />
          </CCol>

          <CModalFooter class="pe-0">
            <CButton color="secondary" @click="closeModal('updateFairModal')"
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
import fairDTO from '@/models/fairDTO'
import Toast from '@/models/create_TOAST_dto'
// import router from '@/router'
export default {
  name: 'Colors',
  components: {
    EasyDataTable: window['vue3-easy-data-table'],
  },
  data() {
    return {
      headers: [
        { text: 'Adı', value: 'name', sortable: true },
        { text: 'Yeri', value: 'place' },
        { text: 'Başlangıç Tarihi', value: 'startDate' },
        { text: 'Bitiş Tarihi', value: 'endDate' },
        { text: 'Aktiv', value: 'active' },
        { text: 'İşlemler', value: 'operations' },
      ],
      items: [],
      addedItem: {
        // Real data
        data: fairDTO.createEmpty(),
      },
      editedItem: {
        // Real data
        data: fairDTO.createEmpty(),
      },
      themeColor: '#321fdb',
      itemsSelected: [],
      openedModals: {
        addFairModal: false,
        deleteFairModal: false,
        updateFairModal: false,
      },
      fairTable: {
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
      selectedFair: fairDTO.createEmpty(),
    }
  },
  watch: {
    'fairTable.serverOptions'(newvalue) {
      this.getFairs(newvalue)
    },
  },
  created() {
    this.getFairs(this.fairTable.serverOptions)
  },
  methods: {
    ...mapActions({
      getAllFairsAPI: 'fair/getFairs',
      addFairAPI: 'fair/addFair',
      deleteFairAPI: 'fair/deleteFair',
      updateFairAPI: 'fair/updateFair',
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
        case 'addFairModal':
          {
            this.addFair(JSON.parse(JSON.stringify(data)))
          }
          break
        case 'updateFairModal':
          {
            this.updateFair(JSON.parse(JSON.stringify(data)))
          }
          break
      }
    },
    // Setting selectedFair every showmodal trigger is not correct idea. It can cause failures due to this. ------------------IMPORTANT
    async showModal(modalname, data) {
      switch (modalname) {
        case 'deleteFairModal':
          {
            this.selectedFair = data
              ? fairDTO.createFromJson(JSON.parse(JSON.stringify(data)))
              : {}
          }
          break
        case 'addFairModal':
          {
            // If the modal is reseted then reassign current date
            if (this.addedItem.data.startDate == null) {
              this.addedItem.data.startDate = new Date()
                .toISOString()
                .split('T')[0]
              this.addedItem.data.endDate = null
            }
          }
          break
        case 'updateFairModal':
          {
            this.selectedFair = data
              ? fairDTO.createFromJson(JSON.parse(JSON.stringify(data)))
              : {}
            let cachedItemData = this.selectedFair
            this.editedItem.data = cachedItemData
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
          case 'addFairModal':
            {
              // Restore added item on clicking "No/Deny"
              this.addedItem = {
                data: fairDTO.createEmpty(),
              }
            }
            break
          case 'deleteFairModal':
            {
              this.selectedFair = fairDTO.createEmpty()
            }
            break
        }
      }
      this.queueEnableSendButton()
    },
    // eslint-disable-next-line no-unused-vars
    async getFairs(pageOptions) {
      this.fairTable.loading = true
      const response = await this.getAllFairsAPI(pageOptions)
      this.items = response ? response.data : []
      this.fairTable.serverItemsLength = response.totalElements
      this.fairTable.loading = false
    },
    async addFair(fairData) {
      const response = await this.addFairAPI(fairData)
      if (response == true) {
        new Toast(
          'New Fair ' + fairData.name + ' added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.closeModal('addFairModal', true)
        this.getFairs(this.fairTable.serverOptions)
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
    async updateFair(newFairData) {
      const response = await this.updateFairAPI(newFairData)
      if (response === true) {
        new Toast(
          'Fair updated successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getFairs(this.fairTable.serverOptions)
        this.closeModal('updateFairModal', true)
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
    async deleteFair(uuid) {
      this.isAbleToPushButton = false
      const response = await this.deleteFairAPI(uuid)
      if (response === true) {
        new Toast(
          'Succesfully deleted',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getFairs(this.fairTable.serverOptions)
        this.closeModal('deleteFairModal', true)
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
    // Checks if start time is lesser than end time or equal then validate it false
    async validateAddedItemDateRange() {
      if (
        this.addedItem.data.startDate |
        (this.addedItem.data.endDate != null)
      ) {
        // Formatting dates to ISO format
        if (
          Date.parse(this.addedItem.data.startDate) >
          Date.parse(this.addedItem.data.endDate)
        ) {
          this.addedItem.data.endDate = null
          new Toast(
            'Cant select EndTime lesser than StartTime',
            'danger',
            true,
            'text-white -align-items-center',
          )
        }
      }
    },
    async validateEditedItemDateRange() {
      if (
        this.editedItem.data.startDate |
        (this.editedItem.data.endDate != null)
      ) {
        // Formatting dates to ISO format
        if (
          Date.parse(this.editedItem.data.startDate) >
          Date.parse(this.editedItem.data.endDate)
        ) {
          this.editedItem.data.endDate = null
          new Toast(
            'Cant select EndTime lesser than StartTime',
            'danger',
            true,
            'text-white -align-items-center',
          )
        }
      }
    },
    // Keep in mind that this only works for our system. This wont work globally. --------------IMPORTANT
    formatDateToISO(date) {
      let splittedTime = date.split(' ')
      return splittedTime[0] + 'T' + splittedTime[1] + 'Z'
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
