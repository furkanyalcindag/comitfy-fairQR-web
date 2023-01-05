<!-- Documentation

  Props: 
    comments: {
        default: [
          {
            uuid: 1,
            profilePicture: avatar,
            userName: 'PARENT YORUM',
            comment: 'YORUM',
            replyCount: 11,
            replies: [
              {
                uuid: 1,
                profilePicture: avatar,
                userName: 'CEVAP YORUM ISMI',
                comment: 'CEVAP YORUMU',
              },
              {
                uuid: 2,
                profilePicture: avatar,
                userName: 'CEVAPPP ISIM',
                comment: 'CEVAP YORUMU',
              },
            ],
          },
        ],
      },
      id: { default: 'viewCommentsID' },
      refs: { default: 'viewCommentsRef' },
      useGuideLines: { default: true },
      animated: { default: false },

-->
<template>
  <div v-if="isLoading" class="text-center">
    <span
      class="spinner-grow spinner-grow-sm"
      role="status"
      aria-hidden="true"
    ></span>
    Yükleniyor...
  </div>
  <div
    :id="id"
    :ref="refs"
    class="p-4 md:w-2/3 lg:w-[55%] xl:1/3 mx-auto"
    v-else-if="comments.length > 0"
  >
    <ul :class="useGuideLines ? 'use-guide-lines' : ''">
      <span id="add-article-comment" class="d-block text-center mb-4"
        ><CButton
          color="info"
          class="ms-2 text-white align-items-center"
          shape="rounded-pill"
          size="sm"
          v-c-tooltip="{
            content: 'Yorum ekle',
            placement: 'top',
          }"
          @click="showReplyEditor('#add-article-comment')"
          >Yorum ekle <CIcon icon="cil-comment-bubble" /> </CButton
      ></span>
      <li
        v-for="(parentComment, parentCommentIndex) in commentsDataCopy"
        :key="parentCommentIndex"
      >
        <div
          class="container bootstrap snippets bootdey"
          @show="parentComment.loadedCommentCount = 0"
        >
          <!-- Loaded: {{ parentComment.loadedCommentCount }} -->
          <CRow>
            <CCol md="12">
              <div class="position-relative comments-container">
                <div class="clearfix">
                  <img
                    src="https://bootdey.com/img/Content/user_1.jpg"
                    class="avatar"
                    alt=""
                  />
                  <!-- Comment data -->
                  <div class="comment">
                    <p class="comment-info">
                      <span
                        class="d-flex align-items-center justify-content-between"
                      >
                        <span
                          >Dec 18, 2014 By:
                          <a href="#">{{ parentComment.userName }}</a></span
                        >
                        <span
                          ><CButton
                            color="info"
                            class="ms-2 text-white align-items-center ml-auto"
                            shape="rounded-pill"
                            size="sm"
                            v-c-tooltip="{
                              content: 'Cevapla',
                              placement: 'top',
                            }"
                            @click="
                              showReplyEditor(
                                '#parent-comment-' + parentCommentIndex,
                                parentComment,
                              )
                            "
                          >
                            <CIcon icon="cil-comment-bubble" /> </CButton
                        ></span>
                      </span>
                    </p>
                    <p>
                      {{ parentComment.content }}
                    </p>
                  </div>
                  <!-- Show reply editor -->
                  <div :id="'parent-comment-' + parentCommentIndex"></div>
                  <!-- Replies -->
                  <div
                    v-if="
                      parentComment.replyCount > 0 &&
                      !parentComment.isStopHidingLoadedComments
                    "
                  >
                    <TransitionGroup
                      name="reply"
                      tag="ul"
                      class="comment-reply-container"
                    >
                      <li
                        class="comment-reply"
                        v-for="(
                          childComment, childCommentIndex
                        ) in parentComment.replies"
                        :key="childComment.uuid"
                      >
                        <ul class="comments">
                          <li class="clearfix text-break">
                            <img
                              src="https://bootdey.com/img/Content/user_1.jpg"
                              class="avatar"
                              alt=""
                            />
                            <div class="comment">
                              <p class="comment-info">
                                <span
                                  class="d-flex align-items-center justify-content-between"
                                >
                                  <span
                                    >Dec 20, 2014 By:
                                    <a href="#">{{
                                      childComment.userName
                                    }}</a></span
                                  >
                                  <span
                                    ><CButton
                                      color="info"
                                      class="ms-2 text-white align-items-center"
                                      shape="rounded-pill"
                                      size="sm"
                                      v-c-tooltip="{
                                        content: 'Cevapla',
                                        placement: 'top',
                                      }"
                                      @click="
                                        showReplyEditor(
                                          '#child-comment-' + childCommentIndex,
                                          parentComment,
                                          childComment,
                                        )
                                      "
                                    >
                                      <CIcon
                                        icon="cil-comment-bubble"
                                      /> </CButton
                                  ></span>
                                </span>
                              </p>
                              <p>
                                {{ childComment.content }}
                              </p>
                            </div>
                          </li>
                          <li
                            :id="'child-comment-' + childCommentIndex"
                            class="clearfix"
                          ></li>
                          <!-- Show comment/Loading button -->
                          <div
                            v-if="
                              (childComment.replyCount > 0 &&
                                !childComment.isReplyCountExceeded) ||
                              childComment.isStopHidingLoadedComments
                            "
                            class="comment-show-reply"
                            @click="
                              async function attemptToLoadChildComments() {
                                childComment.loadingReplies = true
                                // if its not created yet
                                if (!childComment.loadedCommentCount) {
                                  childComment.loadedCommentCount = 5
                                  childComment.loadingReplies = false
                                  // Check the reply count again to hide the button suddenly after the reply count exceeds
                                  if (
                                    childComment.loadedCommentCount >=
                                    childComment.replyCount
                                  ) {
                                    childComment.isReplyCountExceeded = true
                                  }
                                  childComment.mainParent = parentComment.uuid
                                  childComment.repliedParent = childComment.uuid

                                  await emitLoadCurrentCommentData({
                                    pageNumber: 0,
                                    pageSize: childComment.loadedCommentCount,
                                    commentData: JSON.parse(
                                      JSON.stringify(childComment),
                                    ),
                                  })
                                }
                                // if its smaller than reply count then +5 page size
                                else if (
                                  childComment.loadedCommentCount <
                                  childComment.replyCount
                                ) {
                                  childComment.loadedCommentCount += 5
                                  childComment.loadingReplies = false
                                  // Check the reply count again to hide the button suddenly after the reply count exceeds
                                  if (
                                    childComment.loadedCommentCount >=
                                    childComment.replyCount
                                  ) {
                                    childComment.isReplyCountExceeded = true
                                  }
                                  childComment.mainParent = parentComment.uuid
                                  childComment.repliedParent = childComment.uuid

                                  await emitLoadCurrentCommentData({
                                    pageNumber: 0,
                                    pageSize: childComment.loadedCommentCount,
                                    commentData: JSON.parse(
                                      JSON.stringify(childComment),
                                    ),
                                  })
                                } else if (
                                  childComment.isStopHidingLoadedComments
                                ) {
                                  childComment.isStopHidingLoadedComments = false
                                } else {
                                  childComment.isReplyCountExceeded = true
                                }
                                // Check the reply count again to hide the button suddenly after the reply count exceeds
                                // IDK IF ITS NEEDED! IMPORTANT NOTE
                                if (
                                  childComment.loadedCommentCount >=
                                  childComment.replyCount
                                ) {
                                  childComment.isReplyCountExceeded = true
                                }
                                childComment.loadingReplies = false
                              }
                            "
                          >
                            <span v-if="childComment.loadingReplies">
                              <span
                                class="spinner-grow spinner-grow-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Yükleniyor...
                            </span>
                            <span v-else>
                              Show more({{
                                childComment.isReplyCountExceeded
                                  ? childComment.replyCount
                                  : childComment.replyCount -
                                    (childComment.loadedCommentCount
                                      ? childComment.loadedCommentCount
                                      : 0)
                              }})
                            </span>
                          </div>
                        </ul>
                      </li>
                    </TransitionGroup>
                  </div>
                  <!-- Show comment/Loading button -->
                  <div
                    v-if="
                      (parentComment.replyCount > 0 &&
                        !parentComment.isReplyCountExceeded) ||
                      parentComment.isStopHidingLoadedComments
                    "
                    class="comment-show-reply"
                    @click="
                      async function attemptToLoadChildComments() {
                        parentComment.loadingReplies = true
                        // if its not created yet
                        if (!parentComment.loadedCommentCount) {
                          parentComment.loadedCommentCount = 5
                          parentComment.loadingReplies = false
                          // Check the reply count again to hide the button suddenly after the reply count exceeds
                          if (
                            parentComment.loadedCommentCount >=
                            parentComment.replyCount
                          ) {
                            parentComment.isReplyCountExceeded = true
                          }

                          await emitLoadCurrentCommentData({
                            pageNumber: 0,
                            pageSize: parentComment.loadedCommentCount,
                            commentData: JSON.parse(
                              JSON.stringify(parentComment),
                            ),
                          })
                        }
                        // if its smaller than reply count then +5 page size
                        else if (
                          parentComment.loadedCommentCount <
                          parentComment.replyCount
                        ) {
                          parentComment.loadedCommentCount += 5
                          parentComment.loadingReplies = false
                          // Check the reply count again to hide the button suddenly after the reply count exceeds
                          if (
                            parentComment.loadedCommentCount >=
                            parentComment.replyCount
                          ) {
                            parentComment.isReplyCountExceeded = true
                          }

                          await emitLoadCurrentCommentData({
                            pageNumber: 0,
                            pageSize: parentComment.loadedCommentCount,
                            commentData: JSON.parse(
                              JSON.stringify(parentComment),
                            ),
                          })
                        } else if (parentComment.isStopHidingLoadedComments) {
                          parentComment.isStopHidingLoadedComments = false
                        } else {
                          parentComment.isReplyCountExceeded = true
                        }
                        // Check the reply count again to hide the button suddenly after the reply count exceeds
                        // IDK IF ITS NEEDED! IMPORTANT NOTE
                        if (
                          parentComment.loadedCommentCount >=
                          parentComment.replyCount
                        ) {
                          parentComment.isReplyCountExceeded = true
                        }
                        parentComment.loadingReplies = false
                      }
                    "
                  >
                    <span v-if="parentComment.loadingReplies">
                      <span
                        class="spinner-grow spinner-grow-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Yükleniyor...
                    </span>
                    <span v-else>
                      Show more({{
                        parentComment.isReplyCountExceeded
                          ? parentComment.replyCount
                          : parentComment.replyCount -
                            (parentComment.loadedCommentCount
                              ? parentComment.loadedCommentCount
                              : 0)
                      }})
                    </span>
                  </div>
                  <!-- Hide comment button -->
                  <!-- <div
                    class="comment-show-reply"
                    v-if="
                      parentComment.loadedCommentCount != 0 &&
                      parentComment.loadedCommentCount >
                        parentComment.replyCount &&
                      !parentComment.isStopHidingLoadedComments
                    "
                    @click="
                      async function attemptHideComments() {
                        parentComment.isStopHidingLoadedComments = true
                      }
                    "
                  >
                    Hide({{ parentComment.replyCount }})
                  </div> -->
                </div>
              </div>
            </CCol>
          </CRow>
        </div>
      </li>
      <!-- Show more -->
      <div
        v-if="
          parentCommentsPageOptionsCopy.size <
          parentCommentsPageOptionsCopy.totalElements
        "
        class="comment-show-reply"
        @click="emitLoadMoreComments()"
      >
        Daha fazla yorum göster({{
          parentCommentsPageOptionsCopy.totalElements -
          parentCommentsPageOptionsCopy.size
        }})
      </div>
    </ul>
  </div>
  <div v-else>
    <span id="add-article-comment" class="d-block text-center mb-4"
      ><CButton
        color="info"
        class="ms-2 text-white align-items-center"
        shape="rounded-pill"
        size="sm"
        v-c-tooltip="{
          content: 'Yorum ekle',
          placement: 'top',
        }"
        @click="showReplyEditor('#add-article-comment')"
        >Yorum ekle <CIcon icon="cil-comment-bubble" /> </CButton
    ></span>
    <div class="comment-show-reply">Henüz gösterilecek yorum yok</div>
  </div>
  <!-- Reply editor -->
  <Teleport v-if="teleportReplyEditorTo" :to="teleportReplyEditorTo">
    <div class="position-relative">
      <div class="clearfix">
        <!-- Reply editor -->
        <div id="reply-editor" class="comment">
          <p class="comment-info">
            <span class="d-flex align-items-center justify-content-between">
              <span> Yorum ekle </span>
              <span> Butonlar </span>
            </span>
          </p>
          <CForm
            class="row g-3"
            @submit.prevent="
              isAbleToPushButton
                ? submitToAPI($event, null, {
                    replyContent: addedReply,
                    selectedComment: selectedComment,
                    selectedChildComment: selectedChildComment,
                  })
                : null
            "
            needs-validation
            novalidate
            :validated="validationChecked"
          >
            <p>
              <CCol class="not-animated">
                <CFormTextarea
                  id="add-reply"
                  rows="3"
                  required
                  feedbackInvalid="Biraz sosyal olmaya ne dersin?"
                  v-model="addedReply.text"
                  @input="validationChecked = false"
                />
              </CCol>
            </p>
            <span
              class="p-0 d-flex align-items-center justify-content-between m-0"
            >
              <span> </span>
              <CButton
                color="info"
                class="text-white align-items-center ml-auto"
                shape="rounded-pill"
                size="sm"
                v-c-tooltip="{
                  content: 'Cevabını Yayınla',
                  placement: 'top',
                }"
                type="submit"
              >
                Ekle
              </CButton>
            </span>
          </CForm>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import avatar from '@/assets/images/avatars/1.jpg'
export default {
  props: {
    comments: {
      default: [
        {
          uuid: 12,
          profilePicture: avatar,
          userName: 'PARENT YORUM',
          comment: 'YORUM',
          replyCount: 11,
          replies: [
            {
              uuid: 13,
              profilePicture: avatar,
              userName: 'CEVAP YORUM ISMI',
              comment: 'CEVAP YORUMU',
            },
            {
              uuid: 13,
              profilePicture: avatar,
              userName: 'CEVAPPP ISIM',
              comment: 'CEVAP YORUMU',
            },
            {
              uuid: 13,
              profilePicture: avatar,
              userName: 'CEVAPPP ISIM',
              comment: 'CEVAP YORUMU',
            },
            {
              uuid: 13,
              profilePicture: avatar,
              userName: 'CEVAPPP ISIM',
              comment: 'CEVAP YORUMU',
            },
            {
              uuid: 13,
              profilePicture: avatar,
              userName: 'CEVAPPP ISIM',
              comment: 'CEVAP YORUMU',
            },
            {
              uuid: 13,
              profilePicture: avatar,
              userName: 'CEVAPPP ISIM',
              comment: 'CEVAP YORUMU',
            },
          ],
        },
      ],
    },
    id: { default: 'viewCommentsID' },
    refs: { default: 'viewCommentsRef' },
    useGuideLines: { default: true },
    animated: { default: false },
    parentCommentsPageOptions: {
      default: {
        number: 0,
        size: 0,
        totalElements: { default: 0 },
      },
    },
    isLoading: {
      default: true,
    },
    defaultProfilePicture: {
      default: {
        avatar,
      },
    },
  },
  watch: {
    comments() {
      let cachedCommentsData = JSON.parse(JSON.stringify(this.comments))
      this.commentsDataCopy = cachedCommentsData
    },
  },
  data() {
    return {
      parentCommentsPageOptionsCopy: {
        number: 0,
        size: 0,
        totalElements: { default: 0 },
      },
      commentsDataCopy: [],
      teleportReplyEditorTo: '',
      validationChecked: false,
      addedReply: {
        text: '',
      },
      isAbleToPushButton: true,
      selectedComment: null,
      selectedChildComment: null,
    }
  },
  async created() {
    let cachedCommentsData = JSON.parse(JSON.stringify(this.comments))
    this.commentsDataCopy = cachedCommentsData
    this.parentCommentsPageOptionsCopy = this.parentCommentsPageOptions
  },
  emits: [
    'load-more-comments-on-parent',
    'loadMoreComments',
    'send-reply-data',
  ],
  methods: {
    // eslint-disable-next-line
    async submitToAPI(event, modalname, data) {
      this.isAbleToPushButton = false
      this.isShowingReplyEditor = false
      this.validationChecked = true
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
        this.isAbleToPushButton = true
        return
      }
      this.emitSendReplyData(data)
      this.teleportReplyEditorTo = ''
      this.addedReply = {
        text: '',
      }
      this.validationChecked = false
      this.isAbleToPushButton = true
    },

    async emitLoadCurrentCommentData(data) {
      console.log('Loading Child Comments...')
      this.$emit('load-more-comments-on-parent', data)
    },
    async emitSendReplyData(commentData, childCommentData) {
      console.log('Sending comment data to page...')
      this.$emit('send-reply-data', commentData, childCommentData)
    },
    async emitLoadMoreComments() {
      this.parentCommentsPageOptionsCopy.size += 5
      // this.$emit('loadMoreComments', this.parentCommentsPageOptionsCopy)
    },
    async showReplyEditor(commentID, parentCommentData, childCommentData) {
      if (commentID == this.teleportReplyEditorTo) {
        this.teleportReplyEditorTo = ''
        return
      }
      this.teleportReplyEditorTo = commentID
      this.selectedComment = parentCommentData
      this.selectedChildComment = childCommentData
    },
    async resetComponent() {
      this.parentCommentsPageOptionsCopy = {
        number: 0,
        size: 0,
        totalElements: 0,
      }
    },
  },
  unmounted() {
    this.resetComponent()
  },
}
</script>

<style scoped>
/* Remove default bullets */
ul,
#commentsView {
  list-style-type: none;
}

/* Remove margins and padding from the parent ul */
#commentsView {
  margin: 0;
  padding: 0;
}

/* Style the comment-show-reply/arrow */
.comment-show-reply {
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  cursor: pointer;
  user-select: none; /* Prevent text selection */
  text-align: center;
  margin: 20px 0 20px 0;
  color: rgba(0, 0, 0, 0.5);
}

/* Create the comment-show-reply/arrow with a unicode, and style it */
/* .comment-show-reply-loading {
  content: '\25B6';
  color: black;
  display: inline-block;
  margin-right: 6px;
} */

/* Rotate the comment-show-reply/arrow icon when clicked on (using JavaScript) */
.comment-show-reply-loading::before {
  transform: rotate(90deg);
}
.use-guide-lines,
.use-guide-lines .comment,
.use-guide-lines .comment-reply {
  position: relative;
}

.use-guide-lines .comment-reply {
  list-style: none;
}

.use-guide-lines .comment-reply::before,
.use-guide-lines .comment-reply::after {
  content: '';
  position: absolute;
}
.use-guide-lines .comment-reply::before {
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  top: 9px;
  width: 8px;
  height: 0;
}
.use-guide-lines .comment-reply::after {
  border-left: 1px solid rgba(0, 0, 0, 0.2);
  height: 100%;
  width: 0px;
  top: 2px;
}
.use-guide-lines .comment > .comment-reply:last-child::after {
  height: 8px;
}

.comments-container::before,
.comments-container::after,
.comments-container-form::before,
.comments-container-form::after {
  content: '';
  display: table;
  clear: both;
}

.comments-container {
  padding-left: 15%;
  padding-right: 15%;
}

.comments-container ul {
  list-style-type: none;
}

.comments-container img {
  opacity: 1;
  filter: Alpha(opacity=100);
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -o-border-radius: 4px;
  border-radius: 4px;
}

.comments-container img.avatar {
  position: relative;
  float: left;
  margin-left: 0;
  margin-top: 0;
  width: 65px;
  height: 65px;
}

.comments-container .comment {
  border: 1px solid #eee;
  margin-bottom: 20px;
  margin-left: 85px;
  margin-right: 0px;
  padding: 10px 20px;
  position: relative;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -o-border-radius: 4px;
  border-radius: 4px;
  background: #fff;
  color: #6b6e80;
  position: relative;
}

.comments-container .comment-info {
  font-size: 13px;
  color: #aaaaaa;
  padding-bottom: 8px;
  margin-bottom: 10px !important;
  border-bottom: 1px solid #eee;
}

.comments-container ul.comments ul {
  list-style-type: none;
  padding: 0;
  margin-left: 85px;
}

.comments-container-form {
  padding-left: 15%;
  padding-right: 15%;
  padding-top: 40px;
}

.comments-container h3,
.comments-container-form h3 {
  margin-bottom: 40px;
  font-size: 26px;
  line-height: 30px;
  font-weight: 800;
}

/* Reply comment animations */
.reply-enter-active,
.reply-leave-active {
  transition: all 0.5s ease;
}
.reply-enter-from,
.reply-leave-to {
  opacity: 0;
  background-color: yellow;
}
</style>
