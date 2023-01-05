<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm>
                <CButton
                  color="dark"
                  variant="outline"
                  class="mt-3"
                  @click="navigateTo('Login Admin')"
                >
                  Giriş sayfasına dön
                </CButton>
                <h1>Kaydol</h1>
                <p class="text-medium-emphasis">Yeni Bir Hesap Oluştur</p>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput placeholder="Ad" autocomplete="firstName" />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput placeholder="Soyad" autocomplete="lastName" />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-drop" />
                  </CInputGroupText>
                  <CFormInput placeholder="Branş" autocomplete="branch" />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-drop" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Diploma Numarası"
                    autocomplete="diplomaNo"
                  />
                </CInputGroup>
                <CRow>
                  <CCol>
                    <CFormSelect
                      size="md"
                      class="mb-3"
                      aria-label="Medium select example"
                    >
                      <option>Cinsiyet</option>
                      <option value="1">Kadın</option>
                      <option value="2">Erkek</option>
                      <option value="3">Diğer</option>
                      <option value="3">Belirtmek İstemiyorum</option>
                    </CFormSelect>
                  </CCol>
                  <CCol>
                    <CFormSelect
                      size="md"
                      class="mb-3"
                      aria-label="Medium select example"
                    >
                      <option>Yaş Aralığı</option>
                      <option value="1">17-</option>
                      <option value="2">18-24</option>
                      <option value="3">25-34</option>
                      <option value="3">35-44</option>
                      <option value="3">45-54</option>
                      <option value="3">55+</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput placeholder="Email" autocomplete="email" />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Şifre"
                    autocomplete="password"
                  />
                </CInputGroup>
                <CInputGroup class="mb-1">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Şifre Tekrarı"
                    autocomplete="password"
                  />
                </CInputGroup>
                <CRow>
                  <CCol class="text-left m-1">
                    <CButton color="link" class="px-0 float-end">
                      Şartlar & Koşullar
                    </CButton>
                  </CCol></CRow
                >
                <CRow>
                  <CCol>
                    <CListGroupItem>
                      <CFormCheck
                        label="* Uygulama Kullanım Koşullarını kabul ediyorum  ve Comitfy Şirketi Kişisel Veri Gizlilik Politikası ve Aydınlatma Metni kapsamında Healtie tarafından kişisel sağlık verilerimin;  hekim/uzman ile sohbet başlatmak ve/veya hekim/uzmana mesaj göndermek ve sağlık verilerimin Healtie tarafından saklanması amaçları ile sınırlı olarak işlenmesine ve yurtdışına aktarılmasına açık rıza veriyorum.
"
                        class="float-end mb-1 text-muted-small"
                      />
                    </CListGroupItem>
                  </CCol>
                </CRow>

                <div class="d-grid">
                  <CButton color="secondary">Kaydol</CButton>
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
import router from '@/router'

export default {
  name: 'Register Doctor',
  methods: {
    async navigateTo(pageName) {
      router.push({ name: pageName })
    },
  },
}
</script>
