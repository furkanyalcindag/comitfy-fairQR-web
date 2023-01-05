<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
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
                    <CListGroupItem>
                      <CFormCheck
                        label="Beni Hatırla"
                        class="float-end"
                        v-model="isRememberUseActive"
                      /> </CListGroupItem
                  ></CRow>

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
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Şifrenizi mi unuttunuz?
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-secondary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Kaydol</h2>
                  <p>Bir hesabınız yok mu?</p>
                  <CButton
                    color="light"
                    variant="outline"
                    class="mt-3"
                    @click="navigateTo('Register Admin')"
                  >
                    Şimdi Hesap Aç
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import router from '@/router'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login Admin',
  data() {
    return {
      data: {
        email: 'yunus@gmail.com',
        password: 123456,
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

    ...mapGetters({
      checkIfLoggedIn: 'auth/checkIfLoggedIn',
    }),

    async handleSubmit() {
      this.isAbleToLogin = await false
      const response = await this.signIn(this.data)

      if (!response.authorized) {
        this.isAbleToLogin = true
        this.failedToLoginText = 'Kullanıcı adınız veya şifre yanlış.'
        this.isFailedToLogin = true
      }
    },

    async navigateTo(pageName) {
      router.push({ name: pageName })
    },

    created() {
      if (this.checkIfLoggedIn) {
        // ROLE CHECK IS NEEDED HERE
        //router.push({ name: 'Home' })
      }
    },
  },
}
</script>
