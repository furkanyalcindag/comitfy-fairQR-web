<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Account
      </CDropdownHeader>
      <CDropdownItem @click="attemptLogOut">
        <CIcon icon="cil-lock-locked" />
        <span class="pe-none">Logout</span>
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
