<template>
  <CRow>
    <CCol class="justify-content-start">
      <CCard>
        <CCardHeader>
          <!-- <CIcon icon="cil-user" /> -->
          <CRow>
            <CCol lg="3" class="text-left mt-3">
              <h2>Makale Ekle</h2>
            </CCol>
            <CCol lg="9" class="text-right mt-3"> </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody class="p-2">
          <CForm
            class="row g-3"
            @submit.prevent="
              isAbleToPushButton
                ? submitToAPI($event, 'addArticle', addedItem.data)
                : null
            "
            needs-validation
            novalidate
            :validated="validationChecked"
          >
            <!-- Article Title  -->
            <CCol md="6">
              <CFormLabel for="add-article-title">Makale Başlığı</CFormLabel>
              <CFormInput
                id="add-article-title"
                required
                feedbackInvalid="Lütfen bir başlık giriniz"
                v-model="addedItem.data.title"
              />
            </CCol>
            <!--            <CCol md="6">
              <CFormLabel for="add-article-tagList">Etiketler</CFormLabel>
              <v-select
                id="add-article-tagList"
                v-model="addedItem.data.tagList"
                :options="tagList.options"
                multiple
                label="name"
                :loading="tagList.loading"
              >
                <template v-slot:no-options="{ search, searching }">
                  <template v-if="searching">
                    Sonuç bulunamadı:
                    <em>{{ search }}</em
                    >.
                  </template>
                  <em v-else style="opacity: 0.5">Seçmene gerek yok.</em>
                </template>
              </v-select>
            </CCol>-->
            <!-- Article Tags -->
            <CCol md="6">
              <CFormLabel for="add-article-tagList"
                >İlgili Etiketleri Seçiniz</CFormLabel
              >
              <v-select
                id="add-article-tagList"
                v-model="addedItem.data.tagList"
                :options="tagList.options"
                label="name"
                multiple
                :reduce="(option) => ({ uuid: option.uuid, name: option.name })"
                @search="(search) => get_Filtered_tagList_Options_Data(search)"
                :loading="tagList.loading"
              >
                <template v-slot:no-options="{ search, searching }">
                  <template v-if="searching">
                    Sonuç bulunamadı:
                    <em>{{ search }}</em
                    >.
                  </template>
                  <em v-else style="opacity: 0.5">Bir daha dene.</em>
                </template>
                <template #search="{ attributes, events }">
                  <input
                    class="form-control vs__search"
                    feedbackInvalid="Lütfen bir etiket adı giriniz"
                    v-bind="attributes"
                    v-on="events"
                  />
                </template>
              </v-select>
            </CCol>
            <!-- Article Categories -->
            <CCol md="6">
              <CFormLabel for="add-article-category"
                >İlgili Kategorileri Seçiniz</CFormLabel
              >
              <v-select
                id="add-article-category"
                v-model="addedItem.data.categoryList"
                :options="categoryList.options"
                label="name"
                multiple
                :reduce="(option) => ({ uuid: option.uuid, name: option.name })"
                @search="
                  (search) => get_Filtered_Category_List_Options_Data(search)
                "
                :loading="categoryList.loading"
              >
                <template v-slot:no-options="{ search, searching }">
                  <template v-if="searching">
                    Sonuç bulunamadı:
                    <em>{{ search }}</em
                    >.
                  </template>
                  <em v-else style="opacity: 0.5">Bir daha dene.</em>
                </template>
                <template #search="{ attributes, events }">
                  <input
                    class="form-control vs__search"
                    feedbackInvalid="Lütfen bir kategori adı giriniz"
                    v-bind="attributes"
                    v-on="events"
                  />
                </template>
              </v-select>
            </CCol>
            <!-- Article Published Date -->
            <CCol md="6">
              <CFormLabel for="add-article-publishedDate"
                >Yayımlanma Tarihi</CFormLabel
              >
              <CFormInput
                id="add-article-publishedDate"
                required
                type="date"
                feedbackInvalid="Lütfen bir tarih giriniz"
                v-model="addedItem.data.publishedDate"
              />
            </CCol>
            <!-- Article Description -->
            <CCol md="12">
              <CFormLabel for="add-article-content" class="m-2"
                >Makale İçeriği</CFormLabel
              >
              <light-editor
                v-model="addedItem.data.description"
                ref="article-description"
              />
            </CCol>
            <CModalFooter class="pe-0">
              <CButton color="success" type="submit" class="m-2">
                Kaydet</CButton
              >
            </CModalFooter>
          </CForm>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
/* eslint-disable */
import avatar from '@/assets/images/avatars/8.jpg'
import Toast from '@/models/create_TOAST_dto'
import createArticleDTO from '@/models/create_ARTICLE_dto'
import { mapActions } from 'vuex'
export default {
  name: 'Colors',
  components: {},
  data() {
    return {
      avatar: avatar,
      headers: [],
      items: [],
      addedItem: {
        // Real data
        data: createArticleDTO.createEmpty(),

        isDescriptionEnoughToSend: false,
      },
      // Tag selection
      tagList: {
        options: [],
        parentListSearcherDefaultServerOptions: {
          page: 1,
          rowsPerPage: 50,
        },
        loading: true,
      },
      /*      tagList: {
        options: [
          { name: 'Depresyon', language: 'TR' },
          { name: 'Hayvan', language: 'TR' },
          { name: 'Çocuk', language: 'TR' },
          { name: 'Tatlılar', language: 'TR' },
          { name: 'Obezler', language: 'TR' },
        ],
      },*/
      // Category Selection
      categoryList: {
        // The parent category list inside selection in addCategory
        options: [],
        // Parent category Selection server options for getting options in selection in addCategoryModal
        parentListSearcherDefaultServerOptions: {
          page: 1,
          rowsPerPage: 50,
        },
        loading: true,
      },
      themeColor: '#321fdb',
      itemsSelected: [],
      rowsPerPage: 10,
      openedModals: {},
      isAbleToPushButton: true,
      validationChecked: false,
    }
  },
  watch: {
    'addedItem.data.description'(newvalue) {
      this.checkDescriptionLength(newvalue)
    },
  },
  created() {
    this.get_Filtered_Category_List_Options_Data()
    this.get_Filtered_tagList_Options_Data()
  },
  methods: {
    ...mapActions({
      getAlltagList: 'tag/getTag',
      getAllCategories: 'category/getCategories',
      addArticleAPI: 'article/addArticle',
    }),
    // This one for to filter the selection list by search value
    async get_Filtered_Category_List_Options_Data(searched) {
      this.categoryList.loading = true
      if (searched) {
        let filterBy = [
          {
            key: 'name',
            operation: ':',
            type: 'name',
            value: searched,
          },
        ]
        let searchedFor = {
          pageOptions: this.categoryList.parentListSearcherDefaultServerOptions,
          filter: filterBy,
        }
        const response = await this.getAllCategories(searchedFor)
        this.categoryList.options = reduceDataHeaviless(response.data)
      } else {
        let searchedFor = {
          pageOptions: this.categoryList.parentListSearcherDefaultServerOptions,
          filter: null,
        }
        const response = await this.getAllCategories(searchedFor)
        this.categoryList.options = reduceDataHeaviless(response.data)
      }
      this.categoryList.loading = false
      function reduceDataHeaviless(data) {
        // Reducing if the data is too heavy to handle
        return data.map((category) => {
          return { uuid: category.uuid, name: category.name }
        })
      }
    },
    async get_Filtered_tagList_Options_Data(searched) {
      this.tagList.loading = true
      if (searched) {
        let filterBy = [
          {
            key: 'name',
            operation: ':',
            type: 'name',
            value: searched,
          },
        ]
        let searchedFor = {
          pageOptions: this.tagList.parentListSearcherDefaultServerOptions,
          filter: filterBy,
        }
        const response = await this.getAlltagList(searchedFor)
        this.tagList.options = reduceDataHeaviless(response.data)
      } else {
        let searchedFor = {
          pageOptions: this.tagList.parentListSearcherDefaultServerOptions,
          filter: null,
        }
        const response = await this.getAlltagList(searchedFor)
        this.tagList.options = reduceDataHeaviless(response.data)
      }
      this.tagList.loading = false
      function reduceDataHeaviless(data) {
        // Reducing if the data is too heavy to handle
        return data.map((tag) => {
          return { uuid: tag.uuid, name: tag.name }
        })
      }
    },
    checkDescriptionLength(newvalue) {
      if (newvalue && newvalue.length > 20) {
        this.addedItem.isDescriptionEnoughToSend = true
        if (this.validationChecked) {
          this.$refs['article-description'].$el.setAttribute(
            'style',
            'border-color: green;',
          )
        }
      } else {
        this.addedItem.isDescriptionEnoughToSend = false
        if (this.validationChecked) {
          this.$refs['article-description'].$el.setAttribute(
            'style',
            'border-color: red;',
          )
        }
      }
    },
    submitToAPI(event, actionname, data) {
      // Response
      this.isAbleToPushButton = false
      this.validationChecked = true
      this.checkDescriptionLength(this.addedItem.data.description)
      const form = event.currentTarget
      if (this.addedItem.isDescriptionEnoughToSend === false) {
        event.preventDefault()
        event.stopPropagation()
        this.isAbleToPushButton = true
        return
      }
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
        this.isAbleToPushButton = true
        return
      }
      switch (actionname) {
        case 'addArticle':
          {
            this.addArticle(JSON.parse(JSON.stringify(data)))
          }
          break
      }
      this.isAbleToPushButton = true
    },
    async addArticle(data) {
      console.log(data)
      data.categoryList = await takeCategoryListUUIDS(data.categoryList)
      data.tagList = await taketagListUUIDS(data.tagList)
      const response = await this.addArticleAPI(data)
      if (response === true) {
        ;(this.addedItem.data = createArticleDTO.createEmpty()),
          new Toast(
            'Article added successfully',
            'success',
            true,
            'text-white align-items-center',
          )
        this.validationChecked = false
        this.addedItem.isDescriptionEnoughToSend = false
      } else {
        new Toast(
          'Something went wrong',
          'danger',
          true,
          'text-white align-items-center',
        )
      }
      this.isAbleToPushButton = true
      function takeCategoryListUUIDS() {
        return data.categoryList.map((category) => {
          return category.uuid
        })
      }
      function taketagListUUIDS() {
        return data.tagList.map((tag) => {
          return tag.uuid
        })
      }
    },
    closeModal(index) {
      this.openedModals[index] = false
      this.validationChecked = false
    },
  },
}
</script>

<style lang="css" scoped>
.rounder {
  border-radius: 50%;
}
</style>
