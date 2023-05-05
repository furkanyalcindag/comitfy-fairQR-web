<template>
  <CRow>
    <CRow v-if="isLoadingFair" class="justify-content-center">
      <CSpinner color="dark" />
    </CRow>
    <CCol v-else-if="isLoadingFair === false" class="justify-content-start">
      <CRow class="mb-2">
        <Transition appear appear-active-class="fade-enter-active">
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
                placeholder="E-posta ile  Ziyaretçi  Ara.."
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
        </Transition>
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
              <h4>Ziyaretçi Listesi</h4>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody class="p-0">
          <easy-data-table
            show-index
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
            <template #header-index="header">
              <div class="text-center w-100">{{ header.text }}</div>
            </template>
            <template #item-index="{ index }">
              <div class="text-center">{{ index }}</div>
            </template>
            <template #item-name="{ firstName, lastName }">
              <div>{{ firstName }} {{ lastName }}</div>
            </template>
            <template #item-participationDate="{ participationDate }">
              <div class="text-start">
                {{ participationDate.split('T')[0] }}
                <br />
                {{ participationDate.split('T')[1].substring(0, 8) }}
              </div>
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
          </easy-data-table>
        </CCardBody>
      </CCard>
    </CCol>
    <h2 v-else class="text-center">Fuar Bulunamadı</h2>
    <!-- Add FairParticipant -->

    <!-- Delete FairParticipant -->

    <!-- Update FairParticipant -->
  </CRow>
</template>

<script>
import { mapActions } from 'vuex'
import fairClientDTO from '@/models/fairVisitorsDTO'
import fairDTO from '@/models/fairDTO'
import Toast from '@/models/create_TOAST_dto'

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
        { text: 'Şehir', value: 'city' },
        { text: 'Tarih', value: 'participationDate' },
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
      this.getVisitors({ pageOptions: newvalue, fairUUID: this.uuid })
    },
  },
  created() {
    this.getFair({ uuid: this.uuid })
    this.getVisitors({
      pageOptions: this.fairParticipantsTable.serverOptions,
      fairUUID: this.uuid,
    })
  },
  methods: {
    ...mapActions({
      getFairAPI: 'fair/getFair',
      getVisitorsAPI: 'fairParticipant/getVisitorsByFair',
      getParticipantBySearchAPI: 'fairParticipant/getVisitorsBySearch',
      getVisitorsListExcelAPI: 'fairParticipant/getVisitorsListExcel',
    }),
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
      }
    },
    async getVisitors({ pageOptions = null, fairUUID = null }) {
      this.fairParticipantsTable.loading = true
      const response = await this.getVisitorsAPI({
        page: pageOptions,
        fairUUID: fairUUID,
      })
      this.items = response ? response.data : []
      this.fairParticipantsTable.serverItemsLength = response.totalElements
      this.fairParticipantsTable.loading = false
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
      new Toast(
        'İndirme işlemi hazırlanıyor...',
        'info',
        true,
        'text-white align-items-center',
      )
      this.isAbleToPushButton = false
      const response = await this.getVisitorsListExcelAPI({
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

    async convertJavaDateToJSDate(date) {
      if (date) {
        return new Date(date)
      }
      return null
    },
  },
}
</script>

<style lang="css" scoped>
.direction-left {
  text-align: center !important;
}
.rounder {
  border-radius: 50%;
}

.fade-enter-active {
  animation: go 1.25s ease-out;
}

@keyframes go {
  from {
    opacity: 0;
    max-width: 75px;
  }
  to {
    opacity: 1;
    max-width: full;
  }
}
</style>
