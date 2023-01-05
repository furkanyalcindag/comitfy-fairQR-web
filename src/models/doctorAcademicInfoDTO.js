export default class createDoctorAcademicInfoDTO {
  static createEmpty() {
    // This need to be taken from Localizaiton -------------IMPORTANT
    return new createDoctorAcademicInfoDTO('', '', '', '', 'EN')
  }
  constructor(schoolName, profession, startYear, graduateYear, language) {
    this.schoolName = schoolName
    this.profession = profession
    this.startYear = startYear
    this.graduateYear = graduateYear
    this.language = language
  }
}
