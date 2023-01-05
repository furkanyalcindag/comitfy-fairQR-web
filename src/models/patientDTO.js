export default class patientDTO {
  static createEmpty() {
    return new patientDTO({})
  }
  static createFromJson({
    uuid,
    firstName,
    lastName,
    language,
    phone,
    address,
    description,
  }) {
    return new patientDTO({
      uuid: uuid,
      firstName: firstName,
      lastName: lastName,
      language: language,
      phone: phone,
      address: address,
      description: description,
    })
  }
  static toJson() {
    return {
      uuid: this.uuid,
      firstName: this.firstName,
      lastName: this.lastName,
      language: this.language,
      phone: this.phone,
      address: this.address,
      description: this.description,
    }
  }
  // Need to get language from the localization -----------IMPORTANT
  constructor({
    uuid = null,
    firstName = null,
    lastName = null,
    // Depends on if needed -------------IMPORTANT
    language = 'TR',
    phone = null,
    address = null,
    description = null,
  }) {
    this.uuid = uuid
    this.firstName = firstName
    this.lastName = lastName
    this.language = language
    this.phone = phone
    this.address = address
    this.description = description
  }
}
