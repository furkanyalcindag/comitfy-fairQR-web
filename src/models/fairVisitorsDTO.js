export default class FairVisitorDTO {
  static createEmpty() {
    return new FairVisitorDTO({})
  }

  static createFromJson({
    uuid,
    firstName,
    lastName,
    mobilePhone,
    email,
    companyName,
    city,
    participationDate,
  }) {
    return new FairVisitorDTO({
      uuid: uuid,
      firstName: firstName,
      lastName: lastName,
      mobilePhone: mobilePhone,
      email: email,
      companyName: companyName,
      city: city,
      participationDate: participationDate,
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
      city: this.city,
      participationDate: this.participationDate,
    }
  }

  constructor({
    uuid = null,
    firstName = null,
    lastName = null,
    mobilePhone = null,
    email = null,
    companyName = null,
    city = null,
    participationDate = null,
  }) {
    this.uuid = uuid
    this.firstName = firstName
    this.lastName = lastName
    this.mobilePhone = mobilePhone
    this.email = email
    this.companyName = companyName
    ;(this.city = city), (this.participationDate = participationDate)
  }
}
