export default class createDoctorAcademicInfoDTO {
  static createEmpty() {
    return new createDoctorAcademicInfoDTO('', '', '', '', '')
  }
  constructor(title, workedPlace, description, startDate, endDate) {
    this.title = title
    this.workedPlace = workedPlace
    this.description = description
    this.startDate = startDate
    this.endDate = endDate
  }
}
