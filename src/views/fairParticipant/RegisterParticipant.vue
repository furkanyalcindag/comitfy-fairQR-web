<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm
                @submit.prevent="
                  isAbleToPushButton
                    ? submitToAPI({
                        event: $event,
                        newParticipantData: addedItem.data,
                      })
                    : null
                "
                needs-validation
                novalidate
                :validated="validationChecked"
              >
                <CRow class="text-center">
                  <h1>{{ isAdmin ? 'Kaydet' : 'Kaydol' }}</h1>
                  <p class="text-medium-emphasis">
                    Aktif Fuara Yeni Bir Kayıt Oluştur
                  </p>
                </CRow>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    id="add-participant-firstname"
                    required
                    feedbackInvalid="Lütfen adınızı giriniz"
                    placeholder="Ad"
                    v-model="addedItem.data.firstName"
                    autocomplete="off"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    id="add-participant-lastname"
                    required
                    feedbackInvalid="Lütfen soyadınızı giriniz"
                    placeholder="Soyad"
                    v-model="addedItem.data.lastName"
                    autocomplete="off"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-phone" />
                  </CInputGroupText>
                  <CFormInput
                    id="add-participant-mobilephone"
                    required
                    feedbackInvalid="Lütfen telefon numaranızı giriniz"
                    placeholder="Tel No"
                    v-model="addedItem.data.mobilePhone"
                    autocomplete="off"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    id="add-participant-email"
                    required
                    type="email"
                    feedbackInvalid="Lütfen emailinizi giriniz"
                    placeholder="Email"
                    v-model="addedItem.data.email"
                    autocomplete="off"
                  />
                </CInputGroup>

                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-cog" />
                  </CInputGroupText>
                  <CFormInput
                    id="add-participant-companyname"
                    required
                    feedbackInvalid="Lütfen firmanızın adını giriniz"
                    placeholder="Firmanızın adı"
                    v-model="addedItem.data.companyName"
                    autocomplete="off"
                  />
                </CInputGroup>

                <CInputGroup class="mb-3">
                  <CInputGroupText style="max-height: 39px">
                    <CIcon icon="cilHouse" />
                  </CInputGroupText>

                  <CFormSelect
                    id="edit-fair-client-city"
                    size="sm"
                    class="mb-3 p-2"
                    @change="addedItem.data.city = $event.target.value"
                    required
                    feedbackInvalid="Lütfen bir Şehir Seçiniz"
                  >
                    <option value="">--- Şehir Seçiniz ---</option>
                    <option
                      v-for="city in cityList"
                      :key="city.index"
                      :value="city"
                    >
                      {{ city }}
                    </option>
                  </CFormSelect>
                </CInputGroup>

                <div class="d-grid">
                  <CButton
                    color="secondary"
                    :type="isAbleToPushButton ? 'submit' : null"
                    >{{ isAdmin ? 'Kaydet' : 'Kaydol' }}</CButton
                  >
                  <CButton
                    color="dark"
                    variant="outline"
                    class="mt-3"
                    @click="$router.go(-1)"
                    v-if="isAdmin"
                  >
                    Geri dön
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import FairParticipantDTO from '@/models/fairParticipantDTO'
import Toast from '@/models/create_TOAST_dto'
import { mapActions } from 'vuex'
export default {
  name: 'Register Participant',
  data() {
    return {
      cityList: [],
      addedItem: {
        // Real data
        data: FairParticipantDTO.createEmpty(),
      },
      validationChecked: false,
      isAbleToPushButton: true,
      isAdmin: false,
    }
  },
  created() {
    this.isAdmin = this.$route.name == 'Register Participant Admin'
    this.getParticipantListCity()
  },
  methods: {
    ...mapActions({
      addParticipantToCurrentActiveFairAPI:
        'fairParticipant/addParticipantToCurrentActiveFair',
      getParicipantListCityAPI: 'fairParticipant/getParticipantListCity',
    }),
    // eslint-disable-next-line no-unused-vars
    submitToAPI({ event, newParticipantData }) {
      this.isAbleToPushButton = false
      this.validationChecked = true
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
        this.isAbleToPushButton = true
        return
      }
      this.addNewParticipantToActiveFair({
        participantData: newParticipantData,
      })
      this.queueEnableSendButton()
    },
    async addNewParticipantToActiveFair({ participantData }) {
      const response = await this.addParticipantToCurrentActiveFairAPI({
        participantData: participantData,
      })
      if (response) {
        new Toast(
          'Kayıt ' + participantData.firstName + ' Başarılı',
          'success',
          true,
          'text-white align-items-center',
        )
        // eslint-disable-next-line no-unused-vars
        const newestFairResponse = await this.$store.dispatch(
          'fair/getNewestActiveFair',
        )
        this.$store.dispatch('downloadPDF', {
          data: response,
          pdfName:
            newestFairResponse.name + '_' + participantData.email + '_bilet',
        })
        this.addedItem.data = FairParticipantDTO.createEmpty()
        this.validationChecked = false
      } else {
        new Toast(
          'Bir şeyler ters gitti!',
          'danger',
          true,
          'text-white align-items-center',
        )
      }
    },
    async getParticipantListCity() {
      const response = await this.getParicipantListCityAPI()
      if (response) {
        this.cityList = response
      }
    },
    async queueEnableSendButton() {
      await this.$store.dispatch('invokeSendButtonDelay')
      this.isAbleToPushButton = true
    },
    // ekle api
    /* eslint-disable */
  },
}
</script>
