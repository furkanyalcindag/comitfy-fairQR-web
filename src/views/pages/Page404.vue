<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <div class="clearfix">
            <div class="pt-3 d-flex align-items-center justify-content-center">
              <h1 class="float-start display-3 me-4">404</h1>
              <h3>Sayfa Bulunamadı!</h3>
            </div>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Page404',
}
</script>
