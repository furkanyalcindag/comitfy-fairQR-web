export default class userInfoDTO {
  static createEmpty() {
    return new userInfoDTO({
      uuid: null,
      userName: null,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      genderEnum: null,
      ageRangeEnum: null,
      confirmPassword: null,
    })
  }
  constructor({
    uuid = null,
    userName = null,
    firstName = null,
    lastName = null,
    email = null,
    password = null,
    ageRangeEnum = null,
    genderEnum = null,
    confirmPassword = null,
  }) {
    this.uuid = uuid
    this.userName = userName
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.ageRangeEnum = ageRangeEnum
    this.genderEnum = genderEnum
    this.confirmPassword = confirmPassword
  }
}
