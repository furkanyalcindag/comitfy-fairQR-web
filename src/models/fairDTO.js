export default class fairDTO {
  static createEmpty() {
    return new fairDTO({})
  }
  static createFromJson({ uuid, name, place, startDate, endDate }) {
    return new fairDTO({
      uuid: uuid,
      name: name,
      place: place,
      startDate: startDate,
      endDate: endDate,
    })
  }
  static toJson() {
    return {
      uuid: this.uuid,
      name: this.name,
      place: this.place,
      startDate: this.startDate,
      endDate: this.endDate,
    }
  }
  constructor({
    uuid = null,
    name = null,
    place = null,
    startDate = null,
    endDate = null,
  }) {
    this.uuid = uuid
    this.name = name
    this.place = place
    this.startDate = startDate
    this.endDate = endDate
  }
}
