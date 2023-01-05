<template>
  <CRow>
    <CCol class="justify-content-start">
      <CCard>
        <CCardHeader>
          <!-- <CIcon icon="cil-user" /> -->
          <CRow>
            <CCol lg="3" class="text-left mt-3">
              <h2>Chat Odaları</h2>
            </CCol>
            <CCol lg="9" class="text-right mt-3">
              <CButton
                color="primary"
                class="float-end"
                shape="rounded-pill"
                @click="showModal('addChatRoomModal')"
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
            v-model:server-options="chatRoomTable.serverOptions"
            :server-items-length="chatRoomTable.serverItemsLength"
            :headers="headers"
            :items="items"
            :theme-color="themeColor"
            buttons-pagination
            :loading="chatRoomTable.loading"
          >
            <template #item-approved="item">
              <CIcon v-if="item.approved" icon="cil-check-alt" />
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
                    @click="showModal('updateChatRoomModal', item)"
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
                    @click="showModal('deleteChatRoomModal', item)"
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
                </CButtonGroup>
              </div>
            </template>
          </easy-data-table>
        </CCardBody>
      </CCard>
      <!-- Add ChatRoom -->
      <CModal
        backdrop="static"
        size="lg"
        :visible="openedModals.addChatRoomModal"
        @close="closeModal('addChatRoomModal')"
      >
        <CModalHeader>
          <CModalTitle>Chat Odası Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            class="row g-3"
            @submit.prevent="
              isAbleToPushButton
                ? submitToAPI($event, 'addChatRoomModal', addedItem.data)
                : null
            "
            needs-validation
            novalidate
            :validated="validationChecked"
          >
            <CCol md="6">
              <CFormLabel for="add-chat-room-key">Oda İsmi</CFormLabel>
              <CFormInput
                id="add-chat-room-key"
                required
                feedbackInvalid="Lütfen bir isim giriniz"
                v-model="addedItem.data.name"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="add-chat-room-userLimit"
                >Katılımcı Limiti</CFormLabel
              >
              <CFormInput
                id="add-chat-room-userLimit"
                required
                feedbackInvalid="Lütfen bir sayı giriniz"
                v-model="addedItem.data.userLimit"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="add-chat-room-color-code">Renk Kodu</CFormLabel>
              <CFormInput
                id="add-chat-room-color-code"
                required
                type="color"
                feedbackInvalid="Lütfen bir renk kodu giriniz"
                v-model="addedItem.data.colorCode"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="add-chat-room-status-enum"
                >Statü Durumu</CFormLabel
              >
              <CFormSelect
                id="add-chat-room-status-enum"
                required
                feedbackInvalid="Lütfen bir statü durumu seçiniz"
                v-model="addedItem.data.chatRoomStatusEnum"
              >
                <option selected="" disabled="" value="">Seçiniz...</option>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </CFormSelect>
            </CCol>
            <!-- Start Date and Time -->
            <CCol md="6">
              <CFormLabel for="add-chat-room-start-time"
                >Başlangıç Tarihi</CFormLabel
              >
              <VueCtkDateTimePicker
                id="EnabledDisabledDatesPicker"
                v-model="addedItem.startTime"
                locale="tr"
                :minDate="new Date().toISOString()"
                format="YYYY-MM-DD HH:mm:ss.SSSS"
                label="Başlangıç zamanını seçiniz"
                buttonNowTranslation="Şimdiki Zaman"
                @is-hidden="validateAddedItemDateRange()"
              />
              <CFormInput
                required
                style="display: none"
                v-model="addedItem.startTime"
                autocomplete="off"
                feedbackInvalid="Lütfen bir tarih giriniz"
              ></CFormInput>
            </CCol>
            <!-- Start Time -->
            <!-- <CCol md="6">
              {{ addedItem.startTime.endHalf }}
              <CFormLabel for="add-chat-room-start-time"
                >Başlangıç Saati</CFormLabel
              >
              <VueCtkDateTimePicker
                id="EnabledDisabledDatesPicker"
                v-model="addedItem.startTime.endHalf"
                locale="tr"
                format="hh:mm:ss"
                formatted="hh:mm"
                only-time
                no-label
              />
            </CCol> -->
            <!-- <CCol md="6">
              <CFormLabel for="add-chat-room-end-time">Bitiş Zamanı</CFormLabel>

              <VueCtkDateTimePicker
                id="EnabledDisabledDatesPicker"
                v-model="addedItem.endTime.firstHalf"
                locale="tr"
                format="YYYY-MM-DD"
                formatted="ll"
                only-date
                no-label
              />
            </CCol> -->
            <!-- End Time -->
            <CCol md="6">
              <CFormLabel for="add-chat-room-end-time">Bitiş Tarihi</CFormLabel>
              <VueCtkDateTimePicker
                id="EnabledDisabledDatesPicker"
                v-model="addedItem.endTime"
                locale="tr"
                :minDate="addedItem.startTime"
                format="YYYY-MM-DD HH:mm:ss.SSSS"
                label="Bitiş zamanını seçiniz"
                buttonNowTranslation="Şimdiki Zaman"
                @is-hidden="validateAddedItemDateRange()"
              />
              <CFormInput
                required
                style="display: none"
                v-model="addedItem.endTime"
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
                v-model="addedItem.endTime.endHalf"
                locale="tr"
                format="hh:mm:ss.mss"
                formatted="hh:mm"
                only-time
                no-label
              /> -->
            </CCol>

            <CCol md="12">
              <CFormLabel for="add-chat-room-doctor-uuid"
                >Doktor UUID</CFormLabel
              >
              <CFormInput
                id="add-chat-room-doctor-uuid"
                feedbackInvalid="Lütfen bir doktor id'si giriniz"
                v-model="addedItem.data.doctorUUID"
                autocomplete="off"
              />
            </CCol>

            <!--            <CCol md="12">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  v-model="addedItem.data.approved"
                />
                <label class="form-check-label" for="flexSwitchCheckDefault"
                  >Onaylandı mı?</label
                >
              </div>
            </CCol>-->
            <CModalFooter class="pe-0">
              <CButton
                color="secondary"
                @click="closeModal('addChatRoomModal', true)"
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
      <!-- Update ChatRoom -->
      <CModal
        size="lg"
        :visible="openedModals.updateChatRoomModal"
        @close="closeModal('updateChatRoomModal')"
      >
        <CModalHeader>
          <CModalTitle> Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            class="row g-3"
            @submit.prevent="
              isAbleToPushButton
                ? submitToAPI($event, 'updateChatRoomModal', editedItem)
                : null
            "
            needs-validation
            novalidate
            :validated="validationChecked"
          >
            <CCol md="6">
              <CFormLabel for="update-chat-room-name">Oda İsmi</CFormLabel>
              <CFormInput
                id="update-chat-room-name"
                required
                feedbackInvalid="Lütfen bir isim giriniz"
                v-model="editedItem.name"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="update-chat-room-userLimit"
                >Katılımcı Limiti</CFormLabel
              >
              <CFormInput
                id="update-chat-room-userLimit"
                required
                feedbackInvalid="Lütfen bir sayı giriniz"
                v-model="editedItem.userLimit"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="update-chat-room-color-code"
                >Renk Kodu</CFormLabel
              >
              <CFormInput
                id="update-chat-room-color-code"
                required
                type="color"
                feedbackInvalid="Lütfen bir renk kodu giriniz"
                v-model="editedItem.colorCode"
                autocomplete="off"
              />
            </CCol>
            <CCol md="6">
              <CFormLabel for="update-chat-room-status-enum"
                >Statü Durumu</CFormLabel
              >
              <CFormSelect
                id="update-chat-room-status-enum"
                required
                feedbackInvalid="Lütfen bir statü durumu seçiniz"
                v-model="editedItem.chatRoomStatusEnum"
              >
                <option selected="" disabled="" value="">Seçiniz...</option>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </CFormSelect>
            </CCol>
            <!-- Start time -->
            <CCol md="6">
              <CFormLabel for="update-chat-room-start-time"
                >Başlangıç Tarihi</CFormLabel
              >
              <VueCtkDateTimePicker
                id="EnabledDisabledDatesPicker"
                v-model="editedItem.startTime"
                locale="tr"
                :minDate="new Date().toISOString()"
                format="YYYY-MM-DD HH:mm:ss.SSSS"
                label="Başlangıç zamanını seçiniz"
                buttonNowTranslation="Şimdiki Zaman"
                @is-hidden="validateEditedItemDateRange()"
              />
              <CFormInput
                required
                style="display: none"
                v-model="editedItem.startTime"
                autocomplete="off"
                feedbackInvalid="Lütfen bir tarih giriniz"
              ></CFormInput>
            </CCol>
            <!-- End time -->
            <CCol md="6">
              <CFormLabel for="update-chat-room-end-time"
                >Bitiş Tarihi</CFormLabel
              >
              <VueCtkDateTimePicker
                id="EnabledDisabledDatesPicker"
                v-model="editedItem.endTime"
                locale="tr"
                :minDate="editedItem.startTime"
                format="YYYY-MM-DD HH:mm:ss.SSSS"
                label="Bitiş zamanını seçiniz"
                buttonNowTranslation="Şimdiki Zaman"
                @is-hidden="validateEditedItemDateRange()"
              />
              <CFormInput
                required
                style="display: none"
                v-model="editedItem.endTime"
                autocomplete="off"
                feedbackInvalid="Lütfen bir tarih giriniz"
              ></CFormInput>
            </CCol>
            <CCol md="12">
              <CFormLabel for="update-chat-room-doctor-uuid"
                >Doktor UUID</CFormLabel
              >
              <CFormInput
                id="update-chat-room-doctor-uuid"
                feedbackInvalid="Lütfen bir doktor id'si giriniz"
                v-model="editedItem.doctorUUID"
                autocomplete="off"
              />
            </CCol>

            <!--            <CCol md="12">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  v-model="editedItem.approved"
                />
                <label class="form-check-label" for="flexSwitchCheckDefault"
                  >Onaylandı mı?</label
                >
              </div>
            </CCol>-->
            <CModalFooter class="pe-0">
              <CButton
                color="secondary"
                @click="closeModal('updateChatRoomModal')"
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
      <!-- Delete ChatRoom -->
      <CModal
        size="lg"
        :visible="openedModals.deleteChatRoomModal"
        @close="closeModal('deleteChatRoomModal')"
      >
        <CModalHeader>
          <CModalTitle>Ayarı <span class="text-danger">Sil</span></CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h5>
            Bu işlemi geri alamazsınız. Chat odası bilgilerini
            <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
          </h5>
          <CModalFooter class="pe-0">
            <CButton
              color="secondary"
              @click="closeModal('deleteChatRoomModal')"
              >Kapat</CButton
            >
            <CButton
              color="danger"
              @click="
                isAbleToPushButton
                  ? deleteChatRoom(selectedChatRoom.uuid)
                  : null
              "
              >SİL</CButton
            >
          </CModalFooter>
        </CModalBody>
      </CModal>
      <!-- Show User -->
      <CModal
        size="lg"
        :visible="openedModals.showUserModal"
        @close="closeModal('showUserModal')"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Kullanıcı Bilgilerini Göster </CModalTitle>
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
            </easy-data-table>
            <CNav
              variant="tabs"
              class="float-start align-bottom justify-content-center"
              style="transform: translateY(1px)"
            >
              <CNavItem>
                <CNavLink
                  class="text-secondary"
                  role="button"
                  @click="
                    getRoomUsersApiBySituation(
                      userTable.serverOptions,
                      selectedChatRoom,
                      1,
                    )
                  "
                >
                  Onaylananlar
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  class="text-secondary"
                  role="button"
                  @click="
                    getRoomUsersApiBySituation(
                      userTable.serverOptions,
                      selectedChatRoom,
                      2,
                    )
                  "
                  >Beklemedekiler</CNavLink
                >
              </CNavItem>
              <CNavItem>
                <CNavLink class="text-secondary" role="button"
                  >Reddedilenler</CNavLink
                >
              </CNavItem>
            </CNav>
            <CButton
              color="secondary"
              class="float-md-end"
              @click="closeModal('showUserModal')"
              >İptal
            </CButton>
          </CCardBody>
        </CModalBody>
      </CModal>
    </CCol>
  </CRow>
</template>

<script>
import avatar from '@/assets/images/avatars/8.jpg'
import chatRoomDTO from '@/models/ChatRoomDTO'
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
        { text: 'Chat Odası Adı', value: 'name', sortable: true },
        { text: 'Katılımcı Limiti', value: 'userLimit' },
        { text: 'Mesaj Sayısı', value: 'messageCount' },
        { text: 'Statü Durumu', value: 'chatRoomStatusEnum' },

        /*  { text: 'Onay Durumu', value: 'approved' },*/
        { text: 'Başlangıç Saati', value: 'startTime' },
        { text: 'Bitiş Saati', value: 'endTime' },
        { text: 'İşlemler', value: 'operations' },
      ],
      items: [],
      headers2: [
        { text: 'İsim', value: 'firstName', sortable: true },
        { text: 'Soyisim', value: 'lastName', sortable: true },
        { text: 'Email', value: 'email', sortable: true },
        //  { text: 'Onay Durumu', value: 'approved', sortable: true },
        //   { text: 'İşlemler', value: 'operations' },
      ],
      items2: [],
      addedItem: {
        // Real data
        data: new chatRoomDTO(null, null, null, null, null, null, null, null),
        startTime: new Date().toISOString(),
        endTime: null,
      },
      editedItem: {
        // Real data
        data: new chatRoomDTO(null, null, null, null, null, null, null, null),
      },
      themeColor: '#321fdb',
      itemsSelected: [],
      openedModals: {
        addChatRoomModal: false,
        deleteChatRoomModal: false,
        updateChatRoomModal: false,
        showUserModal: false,
      },
      chatRoomTable: {
        serverItemsLength: 0,
        serverOptions: {
          page: 1,
          rowsPerPage: 10,
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
      validationChecked: false,
      isAbleToPushButton: true,
      toasts: [],
      selectedChatRoom: {},
      selectedUser: {},
    }
  },
  watch: {
    'chatRoomTable.serverOptions'(newvalue) {
      this.getChatRoom(newvalue)
    },
    'userTable.serverOptions'(newvalue) {
      this.getUser(newvalue)
    },
  },
  created() {
    this.getChatRoom(this.chatRoomTable.serverOptions)
    console.log(new Date().toString())
  },
  methods: {
    // Checks if start time is lesser than end time or equal then validate it false
    async validateAddedItemDateRange() {
      if (this.addedItem.startTime | (this.addedItem.endTime != null)) {
        // Formatting dates to ISO format
        if (
          Date.parse(this.formatDateToISO(this.addedItem.startTime)) >=
          Date.parse(this.formatDateToISO(this.addedItem.endTime))
        ) {
          this.addedItem.endTime = null
          new Toast(
            'Cant select EndTime equal-lesser than StartTime',
            'danger',
            true,
            'text-white -align-items-center',
          )
        }
      }
    },
    async validateEditedItemDateRange() {
      if (this.editedItem.startTime | (this.editedItem.endTime != null)) {
        // Formatting dates to ISO format
        if (
          Date.parse(this.formatDateToISO(this.editedItem.startTime)) >=
          Date.parse(this.formatDateToISO(this.editedItem.endTime))
        ) {
          this.editedItem.endTime = null
          new Toast(
            'Cant select EndTime equal-lesser than StartTime',
            'danger',
            true,
            'text-white -align-items-center',
          )
        }
      }
    },
    ...mapActions({
      getAllChatRoom: 'chatRoom/getChatRoom',
      addChatRoomAPI: 'chatRoom/addChatRoom',
      deleteChatRoomAPI: 'chatRoom/deleteChatRoom',
      updateChatRoomAPI: 'chatRoom/updateChatRoom',
      showUserByAPI: 'user/getUserByChatRoom',
      showApprovedUserAPI: 'user/getApprovedUserByChatRoom',
      showNonApprovedUserAPI: 'user/getNonApprovedUserByChatRoom',
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
        case 'addChatRoomModal':
          {
            console.log(data)
            this.addChatRoom(JSON.parse(JSON.stringify(data)))
          }
          break
        case 'updateChatRoomModal':
          {
            this.updateChatRoom(JSON.parse(JSON.stringify(data)))
          }
          break
      }
    },
    async showModal(modalname, data) {
      console.log(modalname)
      switch (modalname) {
        case 'deleteChatRoomModal':
          {
            this.selectedChatRoom = data ? JSON.parse(JSON.stringify(data)) : {}
          }
          break
        case 'updateChatRoomModal':
          {
            let cachedItemData = JSON.parse(JSON.stringify(data))
            this.editedItem = cachedItemData
            // this.editedItem.data = JSON.parse(JSON.stringify(data))
          }
          break
        case 'showUserModal':
          {
            this.selectedChatRoom = data ? JSON.parse(JSON.stringify(data)) : {}
            await this.getRoomUsersApiBySituation(
              this.userTable.serverOptions,
              data,
              3,
            )
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
          case 'addChatRoomModal':
            {
              // Restore added item on clicking "No/Deny"
              this.addedItem = {
                data: new chatRoomDTO(
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                ),
                startTime: new Date().toISOString(),
                endTime: null,
              }
            }
            break
          case 'deleteChatRoomModal':
            {
              this.selectedChatRoom = {}
            }
            break
        }
      }
      this.queueEnableSendButton()
    },
    async getChatRoom(pageOptions) {
      this.chatRoomTable.loading = true
      const response = await this.getAllChatRoom(
        pageOptions,
        //  {pageOptions: pageOptions filter: null,}
      )

      this.items = response.data
      this.chatRoomTable.serverItemsLength = response.totalElements
      this.chatRoomTable.loading = false
    },
    async addChatRoom(data) {
      data.startTime = this.formatDateToISO(this.addedItem.startTime)
      data.endTime = this.formatDateToISO(this.addedItem.endTime)
      const response = await this.addChatRoomAPI(data)

      if (response === true) {
        new Toast(
          'ChatRoom added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getChatRoom(this.chatRoomTable.serverOptions)
        this.closeModal('addChatRoomModal', true)
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
    async updateChatRoom(newChatRoomData) {
      newChatRoomData.language = 'TR'
      // Check date if not updated then conver the value to ISO format
      if (!this.editedItem.startTime.includes('T')) {
        newChatRoomData.startTime = this.formatDateToISO(
          this.editedItem.startTime,
        )
      }
      if (!this.editedItem.endTime.includes('T')) {
        newChatRoomData.endTime = this.formatDateToISO(this.editedItem.endTime)
      }
      const response = await this.updateChatRoomAPI(newChatRoomData)
      if (response === true) {
        new Toast(
          'ChatRoom updated successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getChatRoom(this.chatRoomTable.serverOptions)
        this.closeModal('updateChatRoomModal')
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
    async deleteChatRoom(uuid) {
      this.isAbleToPushButton = false
      const response = await this.deleteChatRoomAPI(uuid)
      if (response === true) {
        new Toast(
          'ChatRoom deleted successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getChatRoom(this.chatRoomTable.serverOptions)
        this.closeModal('deleteChatRoomModal', true)
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
    async getUser(pageOptions, data) {
      this.userTable.loading = true
      let pageAndData = { pageOptions: pageOptions, chatRoomData: data }
      const response = await this.showUserByAPI(pageAndData)
      this.items2 = response.data
      this.userTable.serverItemsLength = response.totalElements
      this.userTable.loading = false
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
    /*
    async getApprovedUser(pageOptions, data) {
      this.approvedUserTable.loading = true
      let pageAndData = { pageOptions: pageOptions, chatRoomData: data }
      const response = await this.showApprovedUserAPI(pageAndData)
      this.items2 = response.data
      this.approvedUserTable.serverItemsLength = response.totalElements
      this.approvedUserTable.loading = false
    },
    async getNonApprovedUser(pageOptions, data) {
      this.nonApprovedUserTable.loading = true
      let pageAndData = { pageOptions: pageOptions, chatRoomData: data }
      const response = await this.showNonApprovedUserAPI(pageAndData)
      this.items2 = response.data
      this.nonApprovedUserTable.serverItemsLength = response.totalElements
      this.nonApprovedUserTable.loading = false
    },
*/

    //situation=1 approved situation=2 unapproved
    async getRoomUsersApiBySituation(pageOptions, data, situation) {
      this.userTable.loading = true

      let pageAndData = {
        pageOptions: pageOptions,
        chatRoomData: data,
      }
      let response = null

      // debugger
      if (situation === 1) {
        response = await this.showApprovedUserAPI(pageAndData)
      } else if (situation === 2) {
        response = await this.showNonApprovedUserAPI(pageAndData)
      } else {
        response = await this.showUserByAPI(pageAndData)
      }

      this.items2 = response.data
      this.userTable.serverItemsLength = response.totalElements
      this.userTable.loading = false
    },
  },
}
</script>

<style lang="css" scoped>
.rounder {
  border-radius: 50%;
}
</style>
