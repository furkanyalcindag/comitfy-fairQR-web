export default class fairDTO {
  static createEmpty() {
    return new fairDTO({})
  }
  static createFromJson({ uuid, name, place, startDate, endDate, active }) {
    return new fairDTO({
      uuid: uuid,
      name: name,
      place: place,
      startDate: startDate,
      endDate: endDate,
      active: active,
    })
  }
  static toJson() {
    return {
      uuid: this.uuid,
      name: this.name,
      place: this.place,
      startDate: this.startDate,
      endDate: this.endDate,
      active: this.active,
    }
  }
  constructor({
    uuid = null,
    name = null,
    place = null,
    startDate = null,
    endDate = null,
    active = false,
  }) {
    this.uuid = uuid
    this.name = name
    this.place = place
    this.startDate = startDate
    this.endDate = endDate
    this.active = active
  }
}
