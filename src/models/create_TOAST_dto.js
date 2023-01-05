import store from '@/store'
export default class createCategoryDTO {
  constructor(content, color, isAutoHided, classes, delay) {
    this.content = content
    this.color = color
    this.isAutoHided = isAutoHided
    this.classes = classes
    this.delay = delay

    store.dispatch('createToast', {
      content,
      color,
      isAutoHided,
      classes,
      delay,
    })
  }
}
