<template>
  <CToaster class="position-fixed top-0 start-50 translate-middle-x">
    <CToast
      v-for="(toast, index) in $store.state.toasts"
      :key="index"
      :color="toast.color"
      :autohide="toast.autohide"
      :class="toast.classes"
    >
      <div class="d-flex">
        <CToastBody>{{ toast.content }}</CToastBody>
        <CToastClose class="me-2 m-auto" white />
      </div>
    </CToast>
  </CToaster>
  <router-view />
</template>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
</style>
<style>
.not-animated,
.form-control {
  transition: none !important;
}
.not-animated:focus,
.form-control:focus {
  box-shadow: none;
}
</style>
