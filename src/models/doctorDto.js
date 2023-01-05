export default class doctorDTO {
  static createEmpty() {
    return new doctorDTO({
      uuid: null,
      language: null,
      title: null,
      diplomaNo: null,
      address: null,
      phone: null,
      clinicName: null,
      about: null,
      branch: null,
      firstName: null,
      lastName: null,
      email: null,
      profileImage: null,
      userName: null,
      ageRangeEnum: null,
      genderEnum: null,
      articleLikeCount: null,
    })
  }
  static createFromJson(data) {
    return new doctorDTO({
      uuid: data.uuid ?? null,
      language: data.language ?? null,
      title: data.title ?? null,
      diplomaNo: data.diplomaNo ?? null,
      address: data.address ?? null,
      phone: data.phone ?? null,
      clinicName: data.clinicName ?? null,
      about: data.about ?? null,
      branch: data.branch ?? null,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      email: data.email ?? null,
      profileImage: data.profileImage ?? null,
      userName: data.userName ?? null,
      ageRangeEnum: data.ageRangeEnum ?? null,
      genderEnum: data.genderEnum ?? null,
      articleLikeCount: data.address ?? null,
    })
  }
  constructor({
    uuid = null,
    language = null,
    title = null,
    diplomaNo = null,
    address = null,
    phone = null,
    clinicName = null,
    about = null,
    branch = null,
    firstName = null,
    lastName = null,
    email = null,
    profileImage = null,
    userName = null,
    ageRangeEnum = null,
    genderEnum = null,
    articleLikeCount = null,
  }) {
    this.uuid = uuid
    this.language = language
    this.title = title
    this.diplomaNo = diplomaNo
    this.address = address
    this.phone = phone
    this.clinicName = clinicName
    this.about = about
    this.branch = branch
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.profileImage = profileImage
    this.userName = userName
    this.ageRangeEnum = ageRangeEnum
    this.genderEnum = genderEnum
    this.articleLikeCount = articleLikeCount
  }
}
