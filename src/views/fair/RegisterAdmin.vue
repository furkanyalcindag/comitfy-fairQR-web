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
                LINK GIVES "Source must not be null" ERROR
                <CRow class="text-center">
                  <h1>Kaydol</h1>
                  <p class="text-medium-emphasis">Yeni Bir Hesap Oluştur</p>
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

                <div class="d-grid">
                  <CButton
                    color="secondary"
                    :type="isAbleToPushButton ? 'submit' : null"
                    >Kaydol</CButton
                  >
                  <CButton
                    color="dark"
                    variant="outline"
                    class="mt-3"
                    @click="$router.push({ name: 'Login Admin' })"
                  >
                    Giriş sayfasına dön
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
  name: 'Register Doctor',
  data() {
    return {
      addedItem: {
        // Real data
        data: FairParticipantDTO.createEmpty(),
      },
      validationChecked: false,
      isAbleToPushButton: true,
    }
  },
  methods: {
    ...mapActions({
      addParticipantToCurrentActiveFairAPI:
        'fairParticipant/addParticipantToCurrentActiveFair',
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
      if (response == true) {
        new Toast(
          'Added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
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
