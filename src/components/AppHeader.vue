<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderBrand class="mx-auto d-lg-none" to="/">
        <img
          style="filter: invert(100%)"
          src="https://www.comitfy.com/wp-content/uploads/2022/01/imageonline-co-whitebackgroundremoved-1-e1641159740659.png"
        />
      </CHeaderBrand>
      <CHeaderNav class="d-none d-md-flex me-auto">
        <CNavItem>
          <router-link :to="{ name: 'FairList' }" :class="'nav-link'"
            >Fuar Listesi</router-link
          >
        </CNavItem>
        <CNavItem>
          <router-link
            :to="{ name: 'Register Participant Admin' }"
            :class="'nav-link'"
            >Güncel Fuara katılımcı ekle</router-link
          >
        </CNavItem>
        <!-- <CNavItem>
          <CNavLink href="#">Users</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">Settings</CNavLink>
        </CNavItem> -->
      </CHeaderNav>
      <CHeaderNav>
        <!-- <CNavItem>
          <CNavLink href="#">
            <CIcon class="mx-2" icon="cil-bell" size="lg" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">
            <CIcon class="mx-2" icon="cil-list" size="lg" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">
            <CIcon class="mx-2" icon="cil-envelope-open" size="lg" />
          </CNavLink>
        </CNavItem> -->
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
    </CContainer>
    <!-- <CHeaderDivider /> -->
    <!-- <CContainer fluid>
      <AppBreadcrumb />
    </CContainer> -->
  </CHeader>
</template>

<script>
// import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
export default {
  name: 'AppHeader',
  components: {
    // AppBreadcrumb,
    AppHeaderDropdownAccnt,
  },
  setup() {
    return {}
  },
}
</script>
