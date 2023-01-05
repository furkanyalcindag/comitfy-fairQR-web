export default class notificationDTO {
  static createEmpty() {
    return new notificationDTO(
      null,
      null,
      null,
      null,
      null,
      null,
      false,
      [],
      [],
    )
  }
  static createFromJson(data) {
    return new notificationDTO(
      data.uuid ?? null,
      data.language ?? null,
      data.title ?? null,
      data.message ?? null,
      data.link ?? null,
      data.base64 ?? null,
      data.send ?? null,
      data.gendersToSend ?? [],
      data.agesToSend ?? [],
    )
  }
  constructor(
    uuid,
    language,
    title,
    message,
    link,
    base64,
    send,
    gendersToSend,
    agesToSend,
  ) {
    this.uuid = uuid
    this.language = language
    this.title = title
    this.message = message
    this.link = link
    this.base64 = base64
    this.send = send
    this.gendersToSend = gendersToSend
    this.agesToSend = agesToSend
  }
}
