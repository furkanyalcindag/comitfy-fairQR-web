export default class filterDTO {
  static createEmpty() {
    return new filterDTO({})
  }
  static createFromJson({ key, operation, type, value }) {
    return new filterDTO({
      key: key,
      operation: operation,
      type: type,
      value: value,
    })
  }
  static toJson() {
    return {
      key: this.key,
      operation: this.operation,
      type: this.type,
      value: this.value,
    }
  }
  constructor({ key = null, operation = null, type = null, value = {} }) {
    this.key = key
    this.operation = operation
    this.type = type
    this.value = value
  }
}
