<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle custom>
      <CAvatar :src="avatar" size="md" role="button" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Hesap
      </CDropdownHeader>
      <CDropdownItem @click="attemptLogOut">
        <CIcon icon="cil-lock-locked" />
        <span class="pe-none">Çıkış</span>
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import avatar from '@/assets/images/avatars/default_profile_avatar_image.png'
import { mapActions } from 'vuex'
export default {
  name: 'AppHeaderDropdownAccnt',
  setup() {
    return {
      avatar: avatar,
      itemsCount: 42,
    }
  },
  methods: {
    ...mapActions({
      logOut: 'auth/attemptLogOut',
    }),
    async attemptLogOut() {
      this.logOut()
    },
  },
}
</script>
