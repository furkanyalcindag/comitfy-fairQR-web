<template>
  <CRow>
    <CCol class="justify-content-start">
      <CCard>
        <CCardHeader> <CIcon icon="cil-user" /> Expert Profilim </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs>
              <div class="d-flex text-center align-middle align-items-center">
                <CImage
                  class="rounder"
                  fluid
                  align="start"
                  :src="avatar"
                  width="150"
                  height="150"
                >
                </CImage>
                <div class="text-start ms-2">
                  <h2>İsim Soyisim</h2>
                  <p>Doktor branşı</p>
                </div>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import avatar from '@/assets/images/avatars/8.jpg'
export default {
  name: 'Colors',
  data() {
    return {
      avatar: avatar,
    }
  },
}
</script>

<style lang="css" scoped>
/*#testingAvatar {
  width: 9rem;
  height: 9rem;
}*/
.rounder {
  border-radius: 50%;
}
</style>
