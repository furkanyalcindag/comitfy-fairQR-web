<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Giriş Yap</h1>
                  <p class="text-medium-emphasis">Hesabınıza Giriş Yapın</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" autocomplete="email" />
                  </CInputGroup>

                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Şifre"
                      autocomplete="current-password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CListGroupItem>
                      <CFormCheck
                        label="Beni Hatırla"
                        class="float-end"
                      /> </CListGroupItem
                  ></CRow>

                  <CRow>
                    <CCol :xs="6">
                      <CButton color="secondary" class="px-4"> Giriş </CButton>
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
                  <CButton color="light" variant="outline" class="mt-3">
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
export default {
  name: 'Login Doctor',
}
</script>
