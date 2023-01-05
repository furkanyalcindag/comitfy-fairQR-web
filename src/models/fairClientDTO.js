export default class FairClientDTO {
  static createEmpty() {
    return new FairClientDTO({})
  }

  static createFromJson({
    uuid,
    firstName,
    lastName,
    mobilePhone,
    email,
    companyName,
  }) {
    return new FairClientDTO({
      uuid: uuid,
      firstName: firstName,
      lastName: lastName,
      mobilePhone: mobilePhone,
      email: email,
      companyName: companyName,
    })
  }

  static toJson() {
    return {
      uuid: this.uuid,
      firstName: this.firstName,
      lastName: this.lastName,
      mobilePhone: this.mobilePhone,
      email: this.email,
      companyName: this.companyName,
    }
  }

  constructor({
    uuid = null,
    firstName = null,
    lastName = null,
    mobilePhone = null,
    email = null,
    companyName = null,
  }) {
    this.uuid = uuid
    this.firstName = firstName
    this.lastName = lastName
    this.mobilePhone = mobilePhone
    this.email = email
    this.companyName = companyName
  }
}
