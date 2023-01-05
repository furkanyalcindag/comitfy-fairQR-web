export default class createDoctorInfoDTO {
  static createEmpty() {
    return new createDoctorInfoDTO('', '', '', '')
  }
  constructor(title, branch, clinicName, diplomaNo) {
    this.title = title
    this.branch = branch
    this.clinicName = clinicName
    this.diplomaNo = diplomaNo
  }
}
