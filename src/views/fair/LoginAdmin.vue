<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="6">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="handleSubmit()">
                  <h1>Giriş Yap</h1>
                  <p class="text-medium-emphasis">Hesabınıza Giriş Yapın</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autocomplete="email"
                      v-model="data.email"
                      @input="isFailedToLogin = false"
                    />
                  </CInputGroup>

                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Şifre"
                      autocomplete="current-password"
                      v-model="data.password"
                      @input="isFailedToLogin = false"
                    />
                  </CInputGroup>
                  <span v-if="isFailedToLogin" class="text-danger">{{
                    failedToLoginText
                  }}</span>

                  <CRow>
                    <CCol :xs="6">
                      <CButton
                        :type="isAbleToLogin ? 'submit' : null"
                        color="secondary"
                        class="px-4"
                      >
                        Giriş
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login Admin',
  data() {
    return {
      data: {
        email: '',
        password: '',
      },
      isRememberUseActive: false,
      isFailedToLogin: false,
      isAbleToLogin: true,
      failedToLoginText: '',
    }
  },
  methods: {
    ...mapActions({
      // filename/action
      signIn: 'auth/signIn',
    }),

    /*  ...mapGetters({
      checkIfLoggedIn: 'auth/checkIfLoggedIn',
    }), */

    async handleSubmit() {
      this.isAbleToLogin = await false
      const response = await this.signIn(this.data)

      if (!response.authorized) {
        this.isAbleToLogin = true
        this.failedToLoginText = 'Kullanıcı adınız veya şifre yanlış.'
        this.isFailedToLogin = true
      }
    },

    /* created() {
      if (this.checkIfLoggedIn) {
        // ROLE CHECK IS NEEDED HERE
        //router.push({ name: 'Home' })
      }
    }, */
  },
}
</script>
