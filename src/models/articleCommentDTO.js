export default class getArticleCommentDTO {
  static createEmpty() {
    return new getArticleCommentDTO(null, '', null, 0, 0, '', null, false)
  }

  constructor(
    uuid,
    content,
    parent,
    likeCount,
    replyCount,
    userName,
    creationDateTime,
    like,
  ) {
    this.uuid = uuid
    this.content = content
    this.parent = parent
    this.likeCount = likeCount
    this.userName = userName
    this.replyCount = replyCount
    this.creationDateTime = creationDateTime
    this.like = like
  }
}
