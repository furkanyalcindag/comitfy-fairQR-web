<template>
  <CRow>
    <CCol class="justify-content-start">
      <CCard>
        <CCardHeader>
          <!-- <CIcon icon="cil-user" /> -->
          <CRow>
            <CCol lg="3" class="text-left mt-3">
              <h2>Etiket Listesi</h2>
            </CCol>
            <CCol lg="9" class="text-right mt-3">
              <CButton
                color="primary"
                class="float-end"
                shape="rounded-pill"
                @click="showModal('addTagModal')"
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
            v-model:server-options="tagTable.serverOptions"
            :server-items-length="tagTable.serverItemsLength"
            :headers="headers"
            :items="items"
            :theme-color="themeColor"
            buttons-pagination
            :loading="tagTable.loading"
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
                    @click="showModal('updateTagModal', item)"
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
                    @click="showModal('deleteTagModal', item)"
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
    <!-- Add tag -->
    <CModal
      backdrop="static"
      size="lg"
      :visible="openedModals.addTagModal"
      @close="closeModal('addTagModal')"
    >
      <CModalHeader>
        <CModalTitle>Etiket Ekle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'addTagModal', addedItem.data)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <CCol md="6">
            <CFormLabel for="add-tag-name"
              >Etiket Adı<span class="text-danger">*</span></CFormLabel
            >
            <CFormInput
              id="add-tag-name"
              required
              feedbackInvalid="Lütfen bir etiket adı giriniz"
              v-model="addedItem.data.name"
              autocomplete="off"
            />
          </CCol>

          <!-- For language selection -->
          <CFormLabel for="add-language-to-tag"
            >Etiket Dili<span class="text-danger">*</span></CFormLabel
          >
          <v-select
            id="add-language-to-tag"
            v-model="addedItem.data.language"
            :options="languageList.options"
            label="name"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                Sonuç bulunamadı:
                <em>{{ search }}</em
                >.
              </template>
              <em v-else style="opacity: 0.5">Seçmene gerek yok.</em>
            </template>
            <template #search="{ attributes, events }">
              <input
                class="form-control vs__search"
                feedbackInvalid="Lütfen bir etiket adı giriniz"
                :required="!addedItem.data.language"
                v-bind="attributes"
                v-on="events"
              />
            </template>
          </v-select>

          <CModalFooter class="pe-0">
            <CButton color="secondary" @click="closeModal('addTagModal', true)"
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
    <!-- Delete tag -->
    <CModal
      size="lg"
      :visible="openedModals.deleteTagModal"
      @close="closeModal('deleteTagModal')"
    >
      <CModalHeader>
        <CModalTitle>Etiket <span class="text-danger">Sil</span></CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h5>
          Bu işlemi geri alamazsınız. Etiket bilgilerini
          <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
        </h5>
        <CModalFooter class="pe-0">
          <CButton color="secondary" @click="closeModal('deleteTagModal')"
            >Kapat</CButton
          >
          <CButton
            color="danger"
            @click="isAbleToPushButton ? deleteTag(selectedTag.uuid) : null"
            >SİL</CButton
          >
        </CModalFooter>
      </CModalBody>
    </CModal>
    <!-- Update tag -->
    <CModal
      size="lg"
      :visible="openedModals.updateTagModal"
      @close="closeModal('updateTagModal')"
    >
      <CModalHeader>
        <CModalTitle>Etiket Düzenle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'updateTagModal', editedItem.data)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <CCol md="6">
            <CFormLabel for="update-tag-name">Etiket Adı</CFormLabel>
            <CFormInput
              id="update-tag-name"
              required
              feedbackInvalid="Lütfen bir etiket adı giriniz"
              v-model="editedItem.data.name"
            />
          </CCol>

          <!-- For language selection -->
          <CFormLabel for="update-language-to-tag">Dil Seçenekleri</CFormLabel>
          <v-select
            id="update-language-to-tag"
            v-model="editedItem.data.language"
            :options="languageList.options"
            label="name"
            :loading="languageList.loading"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                Sonuç bulunamadı:
                <em>{{ search }}</em
                >.
              </template>
              <em v-else style="opacity: 0.5">Bir daha dene.</em>
            </template>
            <template #search="{ attributes, events }">
              <input
                class="form-control vs__search"
                feedbackInvalid="Lütfen bir etiket adı giriniz"
                :required="!editedItem.data.language"
                v-bind="attributes"
                v-on="events"
              />
            </template>
          </v-select>
          <CModalFooter class="pe-0">
            <CButton color="secondary" @click="closeModal('updateTagModal')"
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
import tagDTO from '@/models/TagDTO'
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
        { text: 'Etiket Adı', value: 'name', sortable: true },
        { text: 'Toplam Makale Sayısı', value: 'articleCount' },
        { text: 'İşlemler', value: 'operations' },
      ],
      items: [],
      addedItem: {
        // Real data
        data: new tagDTO(null, null),
      },
      editedItem: {
        // Real data
        data: new tagDTO(null, null),
      },

      // Language Selection
      languageList: {
        // The language list inside selection in addTag
        options: ['TR', 'EN'],
        // Language Selection server options for getting options in selection in addTag
        languageSearcherDefaultServerOptions: {
          page: 1,
          rowsPerPage: 10,
        },
        loading: true,
      },
      themeColor: '#321fdb',
      itemsSelected: [],
      openedModals: {
        addTagModal: false,
        deleteTagModal: false,
        updateTagModal: false,
      },
      tagTable: {
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
      selectedTag: {},
    }
  },
  watch: {
    'tagTable.serverOptions'(newvalue) {
      this.getTag(newvalue)
    },
  },
  created() {
    this.getTag(this.tagTable.serverOptions)
  },
  methods: {
    ...mapActions({
      getAllTag: 'tag/getTag',
      getAllLanguages: 'language/getLanguages',
      addTagAPI: 'tag/addTag',
      deleteTagAPI: 'tag/deleteTag',
      updateTagAPI: 'tag/updateTag',
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
        case 'addTagModal':
          {
            this.addTag(JSON.parse(JSON.stringify(data)))
          }
          break
        case 'updateTagModal':
          {
            this.updateTag(JSON.parse(JSON.stringify(data)))
          }
          break
      }
    },
    // This is For to filter the selection list by search value

    async get_Filtered_Language_Options_Data(searched) {
      this.languageList.loading = true
      if (searched) {
        let filterBy = [
          {
            key: 'title',
            operation: ':',
            type: 'title',
            value: searched,
          },
        ]
        const response = await this.getAllLanguages(
          this.languageList.languageSearcherDefaultServerOptions,
          filterBy,
        )
        this.languageList.options = response.data
      } else {
        const response = await this.getAllLanguages(
          this.languageList.languageSearcherDefaultServerOptions,
        )
        this.languageList.options = response.data
      }
      this.languageList.loading = false
    },
    async showModal(modalname, data) {
      this.selectedTag = data ? JSON.parse(JSON.stringify(data)) : {}
      switch (modalname) {
        case 'addTagModal':
          {
            this.languageList.loading = true

            //this.get_Filtered_Language_Options_Data()

            this.languageList.loading = false
          }
          break
        case 'updateTagModal':
          {
            this.editedItem.data = JSON.parse(JSON.stringify(data))
            this.languageList.loading = true
            this.languageList.loading = false
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
          case 'addTagModal':
            {
              // Restore added item on clicking "No/Deny"
              this.addedItem = {
                data: new tagDTO(null, 'TR'),
              }
            }
            break
          case 'deleteTagModal':
            {
              this.selectedTag = {}
            }
            break
        }
      }
      this.queueEnableSendButton()
    },
    async getTag(pageOptions) {
      this.tagTable.loading = true
      const response = await this.getAllTag({
        pageOptions: pageOptions,
        filter: null,
      })
      this.items = response.data
      this.tagTable.serverItemsLength = response.totalElements
      this.tagTable.loading = false
    },
    async addTag(data) {
      const response = await this.addTagAPI(data)
      if (response == true) {
        new Toast(
          'Tag added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getTag(this.tagTable.serverOptions)
        this.closeModal('addTagModal', true)
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
    async updateTag(newTagData) {
      const response = await this.updateTagAPI(newTagData)
      if (response === true) {
        new Toast(
          'Tag updated successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getTag(this.tagTable.serverOptions)
        this.closeModal('updateTagModal')
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
    async deleteTag(uuid) {
      this.isAbleToPushButton = false
      const response = await this.deleteTagAPI(uuid)
      if (response === true) {
        new Toast(
          'Tag deleted successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getTag(this.tagTable.serverOptions)
        this.closeModal('deleteTagModal', true)
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
