import filterDTO from './filterDTO'

export default class FilterSearchDTO {
  static createEmpty() {
    return new FilterSearchDTO({})
  }
  static createFromJson({ filters, pageNumber, pageSize }) {
    var filterOpts = []

    filters.map((item) => {
      filterOpts.push(
        filterDTO.createFromJson(JSON.parse(JSON.stringify(item))),
      )
    })

    return new FilterSearchDTO({
      filters: filterOpts,
      pageNumber: pageNumber,
      pageSize: pageSize,
    })
  }
  static toJson() {
    return {
      filters: this.filters,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    }
  }
  constructor({ filters = [], pageNumber = null, pageSize = null }) {
    this.filters = filters
    this.pageNumber = pageNumber
    this.pageSize = pageSize
  }
}
