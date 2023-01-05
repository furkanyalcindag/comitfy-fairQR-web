export default class createDoctorProfileDTO {
  static createEmpty() {
    return new createDoctorProfileDTO('', '', '', '', '', '')
  }
  constructor(photoLink, firstName, lastName, email, phone, address, about) {
    this.photoLink = photoLink
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.address = address
    this.phone = phone
    this.about = about
  }
}
