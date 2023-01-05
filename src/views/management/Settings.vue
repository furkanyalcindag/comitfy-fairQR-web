<template>
  <CRow>
    <CCol class="justify-content-start">
      <CCard>
        <CCardHeader>
          <!-- <CIcon icon="cil-user" /> -->
          <CRow>
            <CCol lg="3" class="text-left mt-3">
              <h2>Ayarlar</h2>
            </CCol>
            <CCol lg="9" class="text-right mt-3">
              <CButton
                color="primary"
                class="float-end"
                shape="rounded-pill"
                @click="showModal('addSettingsModal')"
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
            v-model:server-options="settingsTable.serverOptions"
            :server-items-length="settingsTable.serverItemsLength"
            :headers="headers"
            :items="items"
            :theme-color="themeColor"
            buttons-pagination
            :loading="settingsTable.loading"
          >
            <template #item-isCurrent="item">
              <CIcon v-if="item.isCurrent" icon="cil-check-alt" />
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
                    @click="showModal('updateSettingsModal', item)"
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
                    @click="showModal('deleteSettingsModal', item)"
                  >
                    <CIcon icon="cil-trash" />
                  </CButton>
                </CButtonGroup>
              </div>
            </template>
          </easy-data-table>
        </CCardBody>
      </CCard>
      <!-- Add settings -->
      <CModal
        backdrop="static"
        size="lg"
        :visible="openedModals.addSettingsModal"
        @close="closeModal('addSettingsModal')"
      >
        <CModalHeader>
          <CModalTitle>Ayar Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            class="row g-3"
            @submit.prevent="
              isAbleToPushButton
                ? submitToAPI($event, 'addSettingsModal', addedItem.data)
                : null
            "
            needs-validation
            novalidate
            :validated="validationChecked"
          >
            <CCol md="6">
              <CFormLabel for="add-settings-key">Anahtar Kelime</CFormLabel>
              <CFormInput
                id="add-settings-key"
                required
                feedbackInvalid="Lütfen bir anahtar kelime giriniz"
                v-model="addedItem.data.key"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="add-settings-value">Değer</CFormLabel>
              <CFormInput
                id="add-settings-value"
                required
                feedbackInvalid="Lütfen bir değer giriniz"
                v-model="addedItem.data.value"
                autocomplete="off"
              />
            </CCol>
            <CCol md="12">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  v-model="addedItem.data.current"
                />
                <label class="form-check-label" for="flexSwitchCheckDefault"
                  >Güncel mi?</label
                >
              </div>
            </CCol>
            <CModalFooter class="pe-0">
              <CButton
                color="secondary"
                @click="closeModal('addSettingsModal', true)"
                >Kapat</CButton
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
      <!-- Update settings -->
      <CModal
        size="lg"
        :visible="openedModals.updateSettingsModal"
        @close="closeModal('updateSettingsModal')"
      >
        <CModalHeader>
          <CModalTitle> Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            class="row g-3"
            @submit.prevent="
              isAbleToPushButton
                ? submitToAPI($event, 'updateSettingsModal', editedItem)
                : null
            "
            needs-validation
            novalidate
            :validated="validationChecked"
          >
            <CCol md="6">
              <CFormLabel for="update-settings-key">Anahtar Kelime</CFormLabel>
              <CFormInput
                id="update-settings-key"
                required
                feedbackInvalid="Lütfen bir anahtar kelime giriniz"
                v-model="editedItem.key"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="update-settings-value">Değer</CFormLabel>
              <CFormInput
                id="update-settings-value"
                required
                feedbackInvalid="Lütfen bir değer giriniz"
                v-model="editedItem.value"
              />
            </CCol>
            <CCol md="12">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  v-model="editedItem.current"
                />
                <label class="form-check-label" for="flexSwitchCheckDefault"
                  >Güncel mi?</label
                >
              </div>
            </CCol>
            <CModalFooter class="pe-0">
              <CButton
                color="secondary"
                @click="closeModal('updateSettingsModal')"
                >Kapat</CButton
              >
              <CButton
                color="success"
                :type="isAbleToPushButton ? 'submit' : null"
                >Düzenlemeyi Kaydet</CButton
              >
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
      <!-- Delete settings -->
      <CModal
        size="lg"
        :visible="openedModals.deleteSettingsModal"
        @close="closeModal('deleteSettingsModal')"
      >
        <CModalHeader>
          <CModalTitle>Ayarı <span class="text-danger">Sil</span></CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h5>
            Bu işlemi geri alamazsınız. Ayar bilgilerini
            <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
          </h5>
          <CModalFooter class="pe-0">
            <CButton
              color="secondary"
              @click="closeModal('deleteSettingsModal')"
              >Kapat</CButton
            >
            <CButton
              color="danger"
              @click="
                isAbleToPushButton
                  ? deleteSettings(selectedSettings.uuid)
                  : null
              "
              >SİL</CButton
            >
          </CModalFooter>
        </CModalBody>
      </CModal>
    </CCol>
  </CRow>
</template>

<script>
import avatar from '@/assets/images/avatars/8.jpg'
import settingsDTO from '@/models/SettingsDTO'
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
        { text: 'Anahtar Kelime', value: 'key', sortable: true },
        { text: 'Değer', value: 'value' },
        { text: 'Güncel mi?', value: 'isCurrent' },
        { text: 'İşlemler', value: 'operations' },
      ],
      items: [],
      addedItem: {
        // Real data
        data: new settingsDTO(null, null, null, null),
      },
      editedItem: {
        // Real data
        data: new settingsDTO(null, null, null, null),
      },
      themeColor: '#321fdb',
      itemsSelected: [],
      openedModals: {
        addSettingsModal: false,
        deleteSettingsModal: false,
        updateSettingsModal: false,
      },
      settingsTable: {
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
      toasts: [],
      selectedSettings: {},
    }
  },
  watch: {
    'settingsTable.serverOptions'(newvalue) {
      this.getSettings(newvalue)
    },
  },
  created() {
    this.getSettings(this.settingsTable.serverOptions)
  },
  methods: {
    ...mapActions({
      getAllSettings: 'settings/getSettings',
      addSettingsAPI: 'settings/addSettings',
      deleteSettingsAPI: 'settings/deleteSettings',
      updateSettingsAPI: 'settings/updateSettings',
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
        case 'addSettingsModal':
          {
            this.addSettings(JSON.parse(JSON.stringify(data)))
          }
          break
        case 'updateSettingsModal':
          {
            this.updateSettings(JSON.parse(JSON.stringify(data)))
          }
          break
      }
    },
    async showModal(modalname, data) {
      this.selectedSettings = data ? JSON.parse(JSON.stringify(data)) : {}
      switch (modalname) {
        case 'updateSettingsModal':
          {
            let cachedItemData = JSON.parse(JSON.stringify(data))
            this.editedItem = cachedItemData
            // this.editedItem.data = JSON.parse(JSON.stringify(data))
          }
          break
      }
      this.openedModals[modalname] = true
    },
    closeModal(modalname, resetData) {
      this.openedModals[modalname] = false
      this.validationChecked = false
      if (resetData) {
        switch (modalname) {
          case 'addSettingsModal':
            {
              // Restore added item on clicking "No/Deny"
              this.addedItem = {
                data: new settingsDTO(null, null, null, null),
              }
            }
            break
          case 'deleteSettingsModal':
            {
              this.selectedSettings = {}
            }
            break
        }
      }
      this.queueEnableSendButton()
    },
    async getSettings(pageOptions) {
      this.settingsTable.loading = true
      const response = await this.getAllSettings(
        pageOptions,
        //  {pageOptions: pageOptions filter: null,}
      )
      this.items = response.data
      this.settingsTable.serverItemsLength = response.totalElements
      this.settingsTable.loading = false
    },
    async addSettings(data) {
      const response = await this.addSettingsAPI(data)
      if (response === true) {
        new Toast(
          'Settings added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getSettings(this.settingsTable.serverOptions)
        this.closeModal('addSettingsModal', true)
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
    async updateSettings(newSettingsData) {
      newSettingsData.language = 'TR'
      const response = await this.updateSettingsAPI(newSettingsData)
      if (response === true) {
        new Toast(
          'Settings updated successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getSettings(this.settingsTable.serverOptions)
        this.closeModal('updateSettingsModal')
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
    async deleteSettings(uuid) {
      this.isAbleToPushButton = false
      const response = await this.deleteSettingsAPI(uuid)
      if (response === true) {
        new Toast(
          'Settings deleted successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getSettings(this.settingsTable.serverOptions)
        this.closeModal('deleteSettingsModal', true)
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
  },
}
</script>

<style lang="css" scoped>
.rounder {
  border-radius: 50%;
}
</style>
