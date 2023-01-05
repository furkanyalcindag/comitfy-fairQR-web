export default class createContractDTO {
  static createEmpty() {
    return new createContractDTO('', '', [], false, false, 'TR')
  }
  constructor(title, content, roleList, active, required, language) {
    this.title = title
    this.content = content
    this.roleList = roleList
    this.active = active
    this.required = required
    this.language = language
  }
}
