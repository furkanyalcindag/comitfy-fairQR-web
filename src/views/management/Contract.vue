<template>
  <div>
    <CRow>
      <CCol class="justify-content-start">
        <CCard>
          <CCardHeader>
            <!-- <CIcon icon="cil-user" /> -->
            <CRow>
              <CCol lg="3" class="text-left mt-3">
                <h2>Sözleşme Listesi</h2>
              </CCol>
              <CCol lg="9" class="text-right mt-3">
                <CButton
                  color="primary"
                  class="float-end"
                  shape="rounded-pill"
                  @click="showModal('addContractModal')"
                  >Ekle
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody class="p-0">
            <easy-data-table
              class="m-4"
              show-index
              v-model:itemsSelected="itemsSelected"
              v-model:server-options="contractsTable.serverOptions"
              :server-items-length="contractsTable.serverItemsLength"
              :headers="headers"
              :items="items"
              :theme-color="themeColor"
              buttons-pagination
              :loading="contractsTable.loading"
              :rows-items="contractsTable.rowsItem"
            >
              <template #item-content="{ content }">
                <div class="position-relative d-inline-block">
                  <CTooltip :content="content" placement="top">
                    <template #toggler="{ on }">
                      <div
                        v-on="on"
                        style="max-width: 200px"
                        class="d-inline-block text-truncate"
                      >
                        {{ content }}
                      </div>
                    </template>
                  </CTooltip>
                </div>
              </template>
              <template #item-active="{ active }">
                <CIcon v-if="active" icon="cil-check-alt" />
                <CIcon v-else icon="cil-x" />
              </template>
              <template #item-required="{ required }">
                <CIcon v-if="required" icon="cil-check-alt" />
                <CIcon v-else icon="cil-x" />
              </template>
              <template #item-operations="item">
                <div>
                  <CButtonGroup role="group" size="sm">
                    <CButton
                      color="warning"
                      class="ms-2 text-white align-items-center"
                      shape="rounded-pill"
                      size="sm"
                      v-c-tooltip="{
                        content: 'Düzenle',
                        placement: 'top',
                      }"
                      @click="showModal('updateContractModal', item)"
                    >
                      <CIcon icon="cil-pencil" />
                    </CButton>
                    <CButton
                      color="danger"
                      class="ms-2 text-white align-items-center"
                      shape="rounded-pill"
                      size="sm"
                      v-c-tooltip="{
                        content: 'Sil',
                        placement: 'top',
                      }"
                      @click="showModal('deleteContractModal', item)"
                    >
                      <CIcon icon="cil-trash" />
                    </CButton>
                    <CButton
                      color="success"
                      class="ms-2 text-white align-items-center"
                      shape="rounded-pill"
                      size="sm"
                      v-c-tooltip="{
                        content: 'Roller',
                        placement: 'top',
                      }"
                      @click="showModal('showRoleListModal', item)"
                    >
                      <CIcon icon="cil-user" />
                    </CButton>
                    <!-- <CButton
                      color="info"
                      class="ms-2 text-white align-items-center"
                      shape="rounded-pill"
                      size="sm"
                      v-c-tooltip="{
                        content: 'Kullanıcı Ekle',
                        placement: 'top',
                      }"
                      @click="showModal('addUserModal', item)"
                    >
                      <CIcon icon="cil-user-plus" />
                    </CButton> -->
                  </CButtonGroup>
                </div>
              </template>
            </easy-data-table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Add Contract -->
    <CModal
      size="lg"
      backdrop="static"
      :visible="openedModals.addContractModal"
      @close="closeModal('addContractModal')"
    >
      <CModalHeader>
        <CModalTitle>Sözleşme ekle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'addContractModal', addedItem.data)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <CCol md="12">
            <CFormLabel for="add-contract-title">Sözleşme Başlığı</CFormLabel>
            <CFormInput
              id="add-contract-title"
              required
              v-model="addedItem.data.title"
              feedbackInvalid="Lütfen Sözleşmenin İsmini giriniz"
            />
          </CCol>
          <CCol md="12" class="not-animated">
            <CFormLabel for="add-contract-content">Sözleşme İçeriği</CFormLabel>
            <CFormTextarea
              id="add-contract-content"
              rows="3"
              required
              feedbackInvalid="Biraz sosyal olmaya ne dersin?"
              v-model="addedItem.data.content"
              @input="validationChecked = false"
            />
          </CCol>

          <CCol md="12">
            <CFormLabel for="add-contract-rolelist"
              >Sözleşmeyi kapsayan roller</CFormLabel
            >
            <v-select
              id="add-contract-rolelist"
              v-model="addedItem.data.roleList"
              :options="roleList.options"
              label="name"
              multiple
              :reduce="(option) => ({ uuid: option.uuid, name: option.name })"
              @search="(search) => get_Filtered_Role_List_Options_Data(search)"
              :loading="roleList.loading"
            >
              <template v-slot:no-options="{ search, searching }">
                <template v-if="searching">
                  Sonuç bulunamadı:
                  <em>{{ search }}</em
                  >.
                </template>
                <em v-else style="opacity: 0.5">Eklemek zorunda değilsin.</em>
              </template>
            </v-select>
          </CCol>

          <CCol md="6">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="add-contract-isactive"
                v-model="addedItem.data.active"
              />
              <label class="form-check-label" for="add-contract-isactive"
                >Aktif mi?</label
              >
            </div>
          </CCol>

          <CCol md="6">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="add-contract-isrequired"
                v-model="addedItem.data.required"
              />
              <label class="form-check-label" for="add-contract-isrequired"
                >Zorunlu mu?</label
              >
            </div>
          </CCol>

          <CModalFooter class="pe-0">
            <CButton
              color="secondary"
              @click="closeModal('addContractModal', true)"
              >İptal</CButton
            >
            <CButton
              color="success"
              :type="isAbleToPushButton ? 'submit' : null"
              >Kaydet</CButton
            >
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
    <!-- Delete Contract -->
    <CModal
      size="lg"
      :visible="openedModals.deleteContractModal"
      @close="closeModal('deleteContractModal')"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>Rol <span class="text-danger">Sil</span></CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h5>
          Bu işlemi geri alamazsınız. Sözleşme bilgilerini
          <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
        </h5>
        <CModalFooter class="pe-0">
          <CButton
            color="secondary"
            @click="closeModal('deleteContractModal', true)"
            >İptal</CButton
          >
          <CButton
            color="danger"
            @click="
              isAbleToPushButton ? deleteContract(selectedContract.uuid) : null
            "
            >SİL</CButton
          >
        </CModalFooter>
      </CModalBody>
    </CModal>
    <!-- Update Contract -->
    <CModal
      size="lg"
      :visible="openedModals.updateContractModal"
      @close="closeModal('updateContractModal')"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>Sözleşme Bilgilerini Düzenle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI(
                  $event,
                  'updateContractModal',
                  JSON.parse(JSON.stringify(editedItem.data)),
                )
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <CCol md="12">
            <CFormLabel for="add-contract-title">Sözleşme Başlığı</CFormLabel>
            <CFormInput
              id="add-contract-title"
              required
              v-model="editedItem.data.title"
              feedbackInvalid="Lütfen Sözleşmenin İsmini giriniz"
            />
          </CCol>

          <CCol md="12" class="not-animated">
            <CFormLabel for="add-contract-content">Sözleşme İçeriği</CFormLabel>
            <CFormTextarea
              id="add-contract-content"
              rows="3"
              required
              feedbackInvalid="Biraz sosyal olmaya ne dersin?"
              v-model="editedItem.data.content"
              @input="validationChecked = false"
            />
          </CCol>

          <CCol md="12">
            <CFormLabel for="add-contract-rolelist"
              >Sözleşmeyi kapsayan roller</CFormLabel
            >
            <v-select
              id="add-contract-rolelist"
              v-model="editedItem.data.roleSet"
              :options="roleList.options"
              label="name"
              multiple
              :reduce="(option) => ({ uuid: option.uuid, name: option.name })"
              @search="(search) => get_Filtered_Role_List_Options_Data(search)"
              :loading="roleList.loading"
            >
              <template v-slot:no-options="{ search, searching }">
                <template v-if="searching">
                  Sonuç bulunamadı:
                  <em>{{ search }}</em
                  >.
                </template>
                <em v-else style="opacity: 0.5">Eklemek zorunda değilsin.</em>
              </template>
            </v-select>
          </CCol>

          <CCol md="6">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="add-contract-isactive"
                v-model="editedItem.data.active"
              />
              <label class="form-check-label" for="add-contract-isactive"
                >Aktif mi?</label
              >
            </div>
          </CCol>

          <CCol md="6">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="add-contract-isrequired"
                v-model="editedItem.data.required"
              />
              <label class="form-check-label" for="add-contract-isrequired"
                >Zorunlu mu?</label
              >
            </div>
          </CCol>

          <CModalFooter class="pe-0">
            <CButton
              color="secondary"
              @click="closeModal('updateContractModal')"
              >İptal</CButton
            >
            <CButton
              color="success"
              :type="isAbleToPushButton ? 'submit' : null"
              >Değişiklikleri Kaydet
            </CButton>
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
    <!-- Add user from role modal
    <CModal
      size="lg"
      :visible="openedModals.addUserModal"
      @close="closeModal('addUserModal')"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>Kullanıcı Ekle</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm
          class="row g-3"
          @submit.prevent="
            isAbleToPushButton
              ? submitToAPI($event, 'addUserModal', addedItem)
              : null
          "
          needs-validation
          novalidate
          :validated="validationChecked"
        >
          <CCol md="6">
            <CFormLabel for="add-user-userName">Kullanıcı İsmi</CFormLabel>
            <CFormInput
              id="add-user-userName"
              required
              v-model="addedItem.userName"
              feedbackInvalid="Lütfen bir kullanıcı ismi giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-firstName">İsim</CFormLabel>
            <CFormInput
              id="add-user-firstname"
              required
              v-model="addedItem.firstName"
              feedbackInvalid="Lütfen bir isim giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-lastName">Soyisim</CFormLabel>
            <CFormInput
              id="add-user-lastName"
              required
              v-model="addedItem.lastName"
              feedbackInvalid="Lütfen bir soyisim giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-email">Email</CFormLabel>
            <CFormInput
              id="add-user-email"
              required
              v-model="addedItem.email"
              feedbackInvalid="Lütfen bir Email adresi giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-password">Şifre</CFormLabel>
            <CFormInput
              id="add-user-password"
              required
              v-model="addedItem.password"
              feedbackInvalid="Lütfen bir şifre giriniz"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="add-user-ageRangeEnum">Yaş Aralığı</CFormLabel>
            <CFormSelect
              id="add-user-age"
              required
              v-model="addedItem.ageRangeEnum"
              feedbackInvalid="Lütfen yaş aralığı seçiniz"
            >
              <option selected="" disabled="" value="">Seçiniz...</option>
              <option value="_UNSPECIFIED">Belirtmek İstemiyorum</option>
            </CFormSelect>
          </CCol>

          <CCol md="6">
            <CFormLabel for="add-user-genderEnum">Cinsiyet</CFormLabel>
            <CFormSelect
              id="add-user-genderEnum"
              required
              v-model="addedItem.genderEnum"
              feedbackInvalid="Lütfen Cinsiyet seçiniz"
            >
              <option selected="" disabled="" value="">Seçiniz...</option>
              <option value="FEMALE">Kadın</option>
            </CFormSelect>
          </CCol>

          <CModalFooter class="pe-0">
            <CButton color="secondary" @click="closeModal('addUserModal', true)"
              >İptal</CButton
            >
            <CButton
              color="success"
              :type="isAbleToPushButton ? 'submit' : null"
              >Kaydet</CButton
            >
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal> -->
    <!-- Show roles from contract modal -->
    <CModal
      size="lg"
      :visible="openedModals.showRoleListModal"
      @close="closeModal('showRoleListModal')"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>Sözleşmeye bağlı roller</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCardBody class="p-0">
          <easy-data-table
            class="m-4"
            show-index
            v-model:itemsSelected="itemsSelected"
            :server-items-length="roleListTable.serverItemsLength"
            :headers="headersRoleList"
            :items="items2"
            :theme-color="themeColor"
            buttons-pagination
            :rows-per-page="roleListTable.serverOptions.rowsPerPage"
            :loading="roleListTable.loading"
            :rows-items="roleListTable.rowsItem"
          >
            <!-- <template #item-operations="item">
              <div>
                <CButtonGroup role="group" size="sm">
                  <CButton
                    color="danger"
                    class="ms-2 text-white align-items-center"
                    shape="rounded-pill"
                    size="sm"
                    v-c-tooltip="{
                      content: 'Sil',
                      placement: 'top',
                    }"
                    @click="showModal('deleteUserModal', item)"
                  >
                    <CIcon icon="cil-trash" />
                  </CButton>
                </CButtonGroup>
              </div>
            </template> -->
          </easy-data-table>

          <CButton
            color="secondary"
            class="float-md-end"
            @click="closeModal('showRoleListModal')"
            >Kapat
          </CButton>
        </CCardBody>
      </CModalBody>
    </CModal>
    <!-- Delete user from role modal
    <CModal
      size="lg"
      v-model:visible="openedModals.deleteUserModal"
      @close="closeModal('deleteUserModal')"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>User <span class="text-danger">Sil</span></CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h5>
          Bu işlemi geri alamazsınız. Kullanıcı bilgilerini
          <span class="text-danger fw-bolder"> silmek istiyor musunuz? </span>
        </h5>
        <CModalFooter class="pe-0">
          <CButton
            color="secondary"
            @click="closeModal('deleteUserModal', true)"
            >İptal</CButton
          >
          <CButton
            color="danger"
            @click="isAbleToPushButton ? deleteUser(selectedUser.uuid) : null"
            >SİL</CButton
          >
        </CModalFooter>
      </CModalBody>
    </CModal> -->
  </div>
</template>

<script>
import avatar from '@/assets/images/avatars/8.jpg'
import { mapActions } from 'vuex'
import Toast from '@/models/create_TOAST_dto'
import ContractDTO from '@/models/ContractDTO'

export default {
  name: 'Colors',
  components: {
    EasyDataTable: window['vue3-easy-data-table'],
  },
  data() {
    return {
      avatar: avatar,
      headers: [
        { text: 'Sözleşme Adı', value: 'title', sortable: true },
        { text: 'İçeriği', value: 'content', sortable: true },
        { text: 'Aktiflik durumu', value: 'active', sortable: true },
        { text: 'Zorunluluğu', value: 'required', sortable: true },
        { text: 'İşlemler', value: 'operations' },
      ],
      items: [],
      editedItem: {
        data: ContractDTO.createEmpty(),
      },
      addedItem: {
        data: ContractDTO.createEmpty(),
      },
      // Role Selection in add contract
      roleList: {
        // The parent category list inside selection in addCategory
        options: [],
        // Parent category Selection server options for getting options in selection in addCategoryModal
        roleListSearcherDefaultServerOptions: {
          page: 1,
          rowsPerPage: 50,
        },
        loading: true,
      },
      headersRoleList: [
        { text: 'İsim', value: 'name', sortable: true },
        { text: 'Dili', value: 'language', sortable: true },
        // { text: 'İşlemler', value: 'operations' },
      ],
      items2: [],

      themeColor: '#321fdb',
      itemsSelected: [],
      openedModals: {
        addContractModal: false,
        deleteContractModal: false,
        updateContractModal: false,
        addUserModal: false,
        showRoleListModal: false,
        deleteUserModal: false,
      },
      validationChecked: false,
      contractsTable: {
        serverItemsLength: 0,
        serverOptions: {
          page: 1,
          rowsPerPage: 10,
          language: 'TR',
        },
        rowsItem: [10, 20, 50],
        loading: true,
      },
      roleListTable: {
        serverItemsLength: 0,
        serverOptions: {
          page: 1,
          rowsPerPage: 10,
        },
        rowsItem: [10, 20, 50],
        loading: true,
      },
      isAbleToPushButton: true,
      selectedUser: {},
      selectedContract: {},
    }
  },
  created() {
    this.getContracts(this.contractsTable.serverOptions)
    // this.get_Filtered_Role_List_Options_Data()
  },
  watch: {
    'contractsTable.serverOptions'(newvalue) {
      this.getContracts(newvalue)
    },
    'roleListTable.serverOptions'() {
      this.getRolesFromContract(this.selectedContract)
    },
  },
  methods: {
    ...mapActions({
      getAllContractsAPI: 'contract/getContracts',
      deleteContractAPI: 'contract/deleteContract',
      addContractAPI: 'contract/addContract',
      updateContractAPI: 'contract/updateContract',

      getAllRolesAPI: 'role/getRoles',

      addUserAPI: 'user/addUserByRole',
      getUsersByRoleAPI: 'user/getUserByRole',
      deleteUserAPI: 'user/deleteUser',
    }),
    // This one for to filter the selection list by search value
    async get_Filtered_Role_List_Options_Data(searched) {
      this.roleList.loading = true
      if (searched) {
        let filterBy = [
          {
            key: 'name',
            operation: ':',
            type: 'name',
            value: searched,
          },
        ]
        let searchedFor = this.roleList.roleListSearcherDefaultServerOptions
        searchedFor['filter'] = filterBy
        const response = await this.getAllRolesAPI(searchedFor)
        this.roleList.options = reduceDataHeaviless(response.data)
      } else {
        let searchedFor = this.roleList.roleListSearcherDefaultServerOptions
        searchedFor['filter'] = null
        const response = await this.getAllRolesAPI(searchedFor)
        this.roleList.options = reduceDataHeaviless(response.data)
      }
      this.roleList.loading = false
      function reduceDataHeaviless(data) {
        // Reducing if the data is too heavy to handle
        return data.map((role) => {
          return { uuid: role.uuid, name: role.name }
        })
      }
    },
    submitToAPI(event, modalname, data) {
      // Response
      this.isAbleToPushButton = false
      this.validationChecked = true
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
        this.isAbleToPushButton = true
        return
      }
      switch (modalname) {
        case 'addContractModal':
          {
            this.addContract(data)
          }
          break
        case 'updateContractModal':
          {
            this.updateContract(data)
          }
          break
        case 'addUserModal':
          {
            this.addUser(data)
          }
          break
      }
    },
    showModal(modalname, data) {
      switch (modalname) {
        case 'addContractModal':
          {
            this.get_Filtered_Role_List_Options_Data()
          }
          break
        case 'updateContractModal':
          {
            this.selectedContract = data ? JSON.parse(JSON.stringify(data)) : {}
            let cachedItemData = JSON.parse(JSON.stringify(data))
            this.editedItem = { data: cachedItemData }
            this.editedItem.data.roleSet = this.editedItem.data.roleSet.map(
              (option) => ({
                uuid: option.uuid,
                name: option.name,
              }),
            )
            this.get_Filtered_Role_List_Options_Data()
          }
          break
        /* case 'addUserModal':
          {
            this.selectedContract = data ? JSON.parse(JSON.stringify(data)) : {}
            let cachedItemData = JSON.parse(JSON.stringify(data))
            this.addedItem = cachedItemData
          }
          break */
        case 'showRoleListModal':
          {
            this.selectedContract = data ? JSON.parse(JSON.stringify(data)) : {}
            console.log(data)
            this.getRolesFromContract(data)
            // this.getAllRolesAPI(this.roleListTable.serverOptions, data)
          }
          break
        /* case 'deleteUserModal':
          {
            this.selectedUser = data
          }
          break */
        case 'deleteContractModal':
          {
            this.selectedContract = data ? JSON.parse(JSON.stringify(data)) : {}
          }
          break
      }
      this.openedModals[modalname] = true
    },
    closeModal(modalname, resetData) {
      this.openedModals[modalname] = false
      this.validationChecked = false
      if (resetData) {
        switch (modalname) {
          case 'addContractModal':
            {
              this.addedItem = {
                data: ContractDTO.createEmpty(),
              }
            }
            break
          case 'addUserModal':
            {
              let cachedAddedItemData = {
                username: null,
                firstName: null,
                lastName: null,
                email: null,
                password: null,
                ageRangeEnum: null,
                genderEnum: null,
              }
              this.addedItem = cachedAddedItemData
            }
            break
          case 'deleteUserModal':
            {
              this.selectedUser = {}
            }
            break
          case 'deleteContractModal':
            {
              this.selectedContract = {}
            }
            break
        }
      }
      this.queueEnableSendButton()
    },
    async getContracts(pageOptions) {
      this.contractsTable.loading = true
      const response = await this.getAllContractsAPI(pageOptions)
      this.items = response.data
      this.contractsTable.serverItemsLength = response.totalElements
      this.contractsTable.loading = false
    },
    // eslint-disable-next-line
    async getRolesFromContract(data) {
      this.roleListTable.loading = true
      this.items2 = data.roleSet
      this.roleListTable.serverItemsLength = data.roleSet.length
      // This for serversided data (GET)
      // let pageAndData = { pageOptions: pageOptions, roleData: data }
      // const response = await this.getUsersByRoleAPI(pageAndData)
      // this.items = response.data
      // this.roleListTable.serverItemsLength = response.totalElements
      // this.roleListTable.loading = false
      this.roleListTable.loading = false
    },
    async addContract(data) {
      data.roleList = await takeRoleListUUIDS(data.roleList)
      const response = await this.addContractAPI(data)
      if (response === true) {
        new Toast(
          'New contract ' + data.title + ' added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.closeModal('addContractModal', true)
        this.getContracts(this.contractsTable.serverOptions)
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
        this.queueEnableSendButton()
      }
      function takeRoleListUUIDS() {
        return data.roleList.map((role) => {
          return role.uuid
        })
      }
    },
    async updateContract(newroleData) {
      let cachedRoleData = await JSON.parse(JSON.stringify(newroleData))
      cachedRoleData.roleList = await takeRoleListUUIDS()
      delete cachedRoleData.roleSet
      const response = await this.updateContractAPI(cachedRoleData)
      if (response === true) {
        new Toast(
          'Role updated successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getContracts(this.contractsTable.serverOptions)
        this.closeModal('updateContractModal')
        this.editedItem = ContractDTO.createEmpty()
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
        this.queueEnableSendButton()
      }
      function takeRoleListUUIDS() {
        return cachedRoleData.roleSet.map((role) => {
          return role.uuid
        })
      }
    },
    async deleteContract(uuid) {
      this.isAbleToPushButton = false
      const response = await this.deleteContractAPI(uuid)
      if (response === true) {
        new Toast(
          'Contract deleted successfully',
          'success',
          true,
          'text-white align-items-center',
        )
        this.getContracts(this.contractsTable.serverOptions)
        this.closeModal('deleteContractModal', true)
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
        this.queueEnableSendButton()
      }
    },
    async queueEnableSendButton() {
      await this.$store.dispatch('invokeSendButtonDelay')
      this.isAbleToPushButton = true
    },
    /* async addUser(data) {
      this.isAbleToPushButton = false
      const response = await this.addUserAPI(data)
      if (response === true) {
        this.closeModal('addUserModal', true)

        this.getUser(this.roleListTable.serverOptions)
        new Toast(
          'New role ' + data.name + ' added successfully',
          'success',
          true,
          'text-white align-items-center',
        )
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
      }
      this.isAbleToPushButton = true
    }, */
    /* async deleteUser(uuid) {
      this.isAbleToPushButton = false
      console.log(uuid)
      const response = await this.deleteUserAPI(uuid)
      if (response === true) {
        this.isAbleToPushButton = true
        this.selectedUser = {}
        new Toast('Silindi', 'success', true, 'text-white align-items-center')
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
        this.isAbleToPushButton = true
      }
      this.closeModal('deleteUserModal')
    }, */
  },
}
</script>

<style lang="css" scoped>
.rounder {
  border-radius: 50%;
}
</style>
