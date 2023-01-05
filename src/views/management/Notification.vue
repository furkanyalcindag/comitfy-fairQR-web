<template>
  <CRow>
    <CCol class="justify-content-start">
      <CCard>
        <CCardHeader>
          <!-- <CIcon icon="cil-user" /> -->
          <CRow>
            <CCol lg="3" class="text-left mt-3">
              <h2>Bildirimler</h2>
            </CCol>
            <CCol lg="9" class="text-right mt-3">
              <CButton
                color="primary"
                class="float-end"
                shape="rounded-pill"
                @click="showModal('addNotificationModal')"
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
            v-model:server-options="notificationTable.serverOptions"
            :server-items-length="notificationTable.serverItemsLength"
            :headers="headers"
            :items="items"
            :theme-color="themeColor"
            buttons-pagination
            :loading="notificationTable.loading"
          >
            <template #item-send="item">
              <CIcon v-if="item.send" icon="cil-check-alt" />
              <CIcon v-else icon="cil-x" />
            </template>

            <template #item-base64="{ base64 }">
              <CAvatar
                class="image-rounder"
                shape="rounded"
                :src="base64"
                style="margin: 12px"
              />
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
                    @click="showModal('updateNotificationModal', item)"
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
                    @click="showModal('deleteNotificationModal', item)"
                  >
                    <CIcon icon="cil-trash" />
                  </CButton>
                </CButtonGroup>
              </div>
            </template>
          </easy-data-table>
        </CCardBody>
      </CCard>
      <!-- Add Notification -->
      <CModal
        backdrop="static"
        size="lg"
        :visible="openedModals.addNotificationModal"
        @close="closeModal('addNotificationModal')"
      >
        <CModalHeader>
          <CModalTitle>Bildirim Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            class="row g-3"
            @submit.prevent="
              isAbleToPushButton
                ? submitToAPI($event, 'addNotificationModal', addedItem.data)
                : null
            "
            needs-validation
            novalidate
            :validated="validationChecked"
          >
            <CCol md="6">
              <CFormLabel for="add-notification-title">Başlık</CFormLabel>
              <CFormInput
                id="add-notification-title"
                required
                feedbackInvalid="Lütfen bir başlık giriniz"
                v-model="addedItem.data.title"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="add-notification-message">Mesaj</CFormLabel>
              <CFormInput
                id="add-notification-message"
                required
                feedbackInvalid="Lütfen bir mesaj giriniz"
                v-model="addedItem.data.message"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="add-notification-link">Link</CFormLabel>
              <CFormInput
                id="add-notification-link"
                required
                feedbackInvalid="Lütfen bir link giriniz"
                v-model="addedItem.data.link"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="add-notification-base64">Base64</CFormLabel>
              <CFormInput
                id="add-notification-base64"
                required
                feedbackInvalid="Lütfen bir base64 link giriniz"
                v-model="addedItem.data.base64"
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
                  v-model="addedItem.data.send"
                />
                <label class="form-check-label" for="flexSwitchCheckDefault"
                  >Güncel mi? (Gönderildi mi?)</label
                >
              </div>
            </CCol>
            <!-- For GENDER list multiple selection -->
            <CFormLabel for="add-category-parent-category"
              >Cinsiyet Seçimi</CFormLabel
            >
            <v-select
              id="add-category-parent-category"
              v-model="addedItem.data.gendersToSend"
              :options="genderSelectionList.options"
              label="Gender"
              multiple
              :loading="genderSelectionList.loading"
            >
              <template v-slot:no-options="{ search, searching }">
                <template v-if="searching">
                  Sonuç bulunamadı:
                  <em>{{ search }}</em
                  >.
                </template>
                <em v-else style="opacity: 0.5">Seçmene gerek yok.</em>
              </template>
            </v-select>
            <!-- For AGE list multiple selection -->
            <CFormLabel for="add-category-parent-category"
              >Yaş Seçimi</CFormLabel
            >
            <v-select
              id="add-category-parent-category"
              v-model="addedItem.data.agesToSend"
              :options="ageSelectionList.options"
              label="Gender"
              multiple
              :loading="ageSelectionList.loading"
            >
              <template v-slot:no-options="{ search, searching }">
                <template v-if="searching">
                  Sonuç bulunamadı:
                  <em>{{ search }}</em
                  >.
                </template>
                <em v-else style="opacity: 0.5">Seçmene gerek yok.</em>
              </template>
            </v-select>
            <CCol md="6">
              <CFormLabel for="add-notification-image">Resim Yükle</CFormLabel>
              <CInputGroup class="mb-3">
                <CFormInput type="file" id="inputGroupFile02" />
                <CInputGroupText
                  component="label"
                  required
                  for="inputGroupFile02"
                  >Yükle</CInputGroupText
                >
              </CInputGroup>
            </CCol>

            <CModalFooter class="pe-0">
              <CButton
                color="secondary"
                @click="closeModal('addNotificationModal', true)"
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
      <!-- Update Notification -->
      <CModal
        size="lg"
        :visible="openedModals.updateNotificationModal"
        @close="closeModal('updateNotificationModal')"
      >
        <CModalHeader>
          <CModalTitle> Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            class="row g-3"
            @submit.prevent="
              isAbleToPushButton
                ? submitToAPI($event, 'updateNotificationModal', editedItem)
                : null
            "
            needs-validation
            novalidate
            :validated="validationChecked"
          >
            <CCol md="6">
              <CFormLabel for="update-notification-title">Başlık</CFormLabel>
              <CFormInput
                id="update-notification-title"
                required
                feedbackInvalid="Lütfen bir başlık giriniz"
                v-model="editedItem.title"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="update-notification-message">Mesaj</CFormLabel>
              <CFormInput
                id="update-notification-message"
                required
                feedbackInvalid="Lütfen bir mesaj giriniz"
                v-model="editedItem.message"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="update-notification-link">Link</CFormLabel>
              <CFormInput
                id="update-notification-link"
                required
                feedbackInvalid="Lütfen bir link giriniz"
                v-model="editedItem.link"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="update-notification-base64">Base64</CFormLabel>
              <CFormInput
                id="update-notification-base64"
                required
                feedbackInvalid="Lütfen bir base64 link giriniz"
                v-model="editedItem.base64"
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
                  v-model="editedItem.send"
                />
                <label class="form-check-label" for="flexSwitchCheckDefault"
                  >Güncel mi?</label
                >
              </div>
            </CCol>
            <!-- For GENDER list multiple selection -->
            <CFormLabel for="update-gender-selections"
              >Cinsiyet Seçimi</CFormLabel
            >
            <v-select
              id="update-gender-selections"
              v-model="editedItem.gendersToSend"
              :options="genderSelectionList.options"
              label="Gender"
              multiple
              :loading="genderSelectionList.loading"
            >
              <template v-slot:no-options="{ search, searching }">
                <template v-if="searching">
                  Sonuç bulunamadı:
                  <em>{{ search }}</em
                  >.
                </template>
                <em v-else style="opacity: 0.5">Seçmene gerek yok.</em>
              </template>
            </v-select>
            <!-- For AGE list multiple selection -->
            <CFormLabel for="add-category-parent-category"
              >Yaş Seçimi</CFormLabel
            >
            <v-select
              id="add-category-parent-category"
              v-model="editedItem.agesToSend"
              :options="ageSelectionList.options"
              label="Gender"
              multiple
              :loading="ageSelectionList.loading"
            >
              <template v-slot:no-options="{ search, searching }">
                <template v-if="searching">
                  Sonuç bulunamadı:
                  <em>{{ search }}</em
                  >.
                </template>
                <em v-else style="opacity: 0.5">Seçmene gerek yok.</em>
              </template>
            </v-select>
            <CCol md="6">
              <div
                class="rounder d-flex justify-content-center align-items-center"
                style="height: 9rem"
              >
                <CAvatar
                  :src="avatar"
                  status="success"
                  style="transform: scale(4)"
                >
                </CAvatar>
              </div>
            </CCol>
            <CCol md="6">
              <CFormLabel for="add-notification-image">Resim Yükle</CFormLabel>
              <CInputGroup class="mb-3">
                <CFormInput type="file" id="inputGroupFile02" />
                <CInputGroupText
                  component="label"
                  required
                  for="inputGroupFile02"
                  >Yükle</CInputGroupText
                >
              </CInputGroup>
            </CCol>

            <CModalFooter class="pe-0">
              <CButton
                color="secondary"
                @click="closeModal('updateNotificationModal')"
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
      <!-- Delete Notification -->
      <CModal
        size="lg"
        :visible="openedModals.deleteNotificationModal"
        @close="closeModal('deleteNotificationModal')"
      >
        <CModalHeader>
          <CModalTitle
            >Bildirimi <span class="text-danger">Sil</span></CModalTitle
          >
        </CModalHeader>
        <CModalBody>
          <h5>
            Bu işlemi geri alamazsınız. bildirim bilgilerini
            <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
          </h5>
          <CModalFooter class="pe-0">
            <CButton
              color="secondary"
              @click="closeModal('deleteNotificationModal')"
              >Kapat</CButton
            >
            <CButton
              color="danger"
              @click="
                isAbleToPushButton
                  ? deleteNotification(selectedNotification.uuid)
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
import notificationDTO from '@/models/NotificationDTO'
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
        { text: 'Başlık', value: 'title', sortable: true },
        { text: 'Mesaj', value: 'message' },
        { text: 'Gönderildi mi?', value: 'send' },
        { text: 'İşlemler', value: 'operations' },
      ],
      items: [],
      addedItem: {
        // Real data
        data: notificationDTO.createEmpty(),
      },
      editedItem: {
        // Real data
        data: notificationDTO.createEmpty(),
      },
      themeColor: '#321fdb',
      itemsSelected: [],
      openedModals: {
        addNotificationModal: false,
        deleteNotificationModal: false,
        updateNotificationModal: false,
      },
      notificationTable: {
        serverItemsLength: 0,
        serverOptions: {
          page: 1,
          rowsPerPage: 10,
        },
        rowsItem: [10, 20, 50],
        loading: true,
      },
      // Gender Selection
      genderSelectionList: {
        // The language list inside selection in addCategory
        options: ['OTHER', 'MALE', 'FEMALE', 'TRANSGENDER'],
        // Language Selection server options for getting options in selection in addCategory
        genderSearcherDefaultServerOptions: {
          page: 1,
          rowsPerPage: 10,
        },
        loading: true,
      },
      // Gender Selection
      ageSelectionList: {
        // The language list inside selection in addCategory
        options: [
          '_UNSPECIFIED',
          '_0_17',
          '_18_24',
          '_25_34',
          '_35_44',
          '_45_54',
          '_55_64',
          '_65_PLUS',
        ],
        // Language Selection server options for getting options in selection in addCategory
        ageSearcherDefaultServerOptions: {
          page: 1,
          rowsPerPage: 10,
        },
        loading: true,
      },
      validationChecked: false,
      isAbleToPushButton: true,
      toasts: [],
      selectedNotification: {},
    }
  },
  watch: {
    'notificationTable.serverOptions'(newvalue) {
      this.getNotification(newvalue)
    },
  },
  created() {
    this.getNotification(this.notificationTable.serverOptions)
  },
  methods: {
    ...mapActions({
      getAllNotification: 'notification/getNotification',
      addNotificationAPI: 'notification/addNotification',
      deleteNotificationAPI: 'notification/deleteNotification',
      updateNotificationAPI: 'notification/updateNotification',
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
        case 'addNotificationModal':
          {
            this.addNotification(JSON.parse(JSON.stringify(data)))
          }
          break
        case 'updateNotificationModal':
          {
            this.updateNotification(JSON.parse(JSON.stringify(data)))
          }
          break
      }
    },
    async showModal(modalname, data) {
      this.selectedNotification = data ? JSON.parse(JSON.stringify(data)) : {}
      switch (modalname) {
        case 'updateNotificationModal':
          {
            this.genderSelectionList.loading = false
            this.ageSelectionList.loading = false
            let cachedItemData = notificationDTO.createFromJson(
              JSON.parse(JSON.stringify(data)),
            )
            this.editedItem = cachedItemData
          }
          break
        case 'addNotificationModal':
          {
            this.genderSelectionList.loading = false
            this.ageSelectionList.loading = false
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
          case 'addNotificationModal':
            {
              // Restore added item on clicking "No/Deny"
              this.addedItem = {
                data: notificationDTO.createEmpty(),
              }
            }
            break
          case 'deleteNotificationModal':
            this.selectedNotification = {}
            break
        }
      }
      this.queueEnableSendButton()
    },
    async getNotification(pageOptions) {
      this.notificationTable.loading = true
      const response = await this.getAllNotification(
        pageOptions,
        //  {pageOptions: pageOptions filter: null,}
      )

      this.items = response.data
      this.notificationTable.serverItemsLength = response.totalElements
      this.notificationTable.loading = false
    },
    async addNotification(data) {
      const response = await this.addNotificationAPI(data)
      if (response === true) {
        new Toast(
          'Notification added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getNotification(this.notificationTable.serverOptions)
        this.closeModal('addNotificationModal', true)
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
    async updateNotification(newNotificationData) {
      newNotificationData.language = 'TR'
      const response = await this.updateNotificationAPI(newNotificationData)
      if (response === true) {
        new Toast(
          'Notification updated successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getNotification(this.notificationTable.serverOptions)
        this.closeModal('updateNotificationModal')
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
    async deleteNotification(uuid) {
      this.isAbleToPushButton = false
      const response = await this.deleteNotificationAPI(uuid)
      if (response === true) {
        new Toast(
          'Notification deleted successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getNotification(this.notificationTable.serverOptions)
        this.closeModal('deleteNotificationModal', true)
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
.image-rounder {
  min-height: 30px !important;
  min-width: 30px !important;
}
</style>
