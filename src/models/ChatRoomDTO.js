export default class chatRoomDTO {
  constructor(
    language,
    name,
    userLimit,
    colorCode,
    startTime,
    endTime,
    doctorUUID,
    chatRoomStatusEnum,
  ) {
    this.language = language
    this.name = name
    this.userLimit = userLimit
    this.colorCode = colorCode
    this.startTime = startTime
    this.endTime = endTime
    this.doctorUUID = doctorUUID
    this.chatRoomStatusEnum = chatRoomStatusEnum
  }
}
