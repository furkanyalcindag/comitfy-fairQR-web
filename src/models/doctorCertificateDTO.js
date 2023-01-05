export default class createDoctorAcademicInfoDTO {
  static createEmpty() {
    return new createDoctorAcademicInfoDTO('', '', '', '')
  }
  constructor(name, certificateNo, takenFrom, takenDate) {
    this.name = name
    this.certificateNo = certificateNo
    this.takenFrom = takenFrom
    this.takenDate = takenDate
  }
}
