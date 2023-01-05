export default class createArticleDTO {
  static createEmpty() {
    // This should take localization --------------IMPORTANT
    return new createArticleDTO(
      null,
      'TR',
      null,
      new Date()
        .toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
        .replaceAll('.', '-')
        .split('-')
        .reverse()
        .join('-'),
      [],
      [],
    )
  }
  static createArticleFromJson({
    title,
    language,
    description,
    publishedDate,
    tagList,
    categoryList,
  }) {
    return new createArticleDTO(
      title,
      language,
      description,
      publishedDate,
      tagList,
      categoryList,
    )
  }
  constructor(
    title,
    language,
    description,
    publishedDate,
    tagList,
    categoryList,
  ) {
    this.title = title
    this.language = language
    this.description = description
    this.publishedDate = publishedDate
    this.tagList = tagList
    this.categoryList = categoryList
  }
}
