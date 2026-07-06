export class AreaFocuser {

  constructor(areaFocusManager) {
    this._areaFocusManager = areaFocusManager
  }

  /**
   * @param {{name?: string, highlight?: boolean}=} options
   */
  async focusProvince(options) {
    const provinceName = this._getProvinceName(options)
    const shouldHighlight = this._shouldHighlight(options)

    if (!provinceName) {
      this._clear()
      return
    }

    if (this._areaFocusManager) {
      await this._areaFocusManager.focus({
        type: 'province',
        name: provinceName,
        display: shouldHighlight ? 'highlight' : 'normal',
      })
    }
  }

  _clear() {
    if (this._areaFocusManager) {
      this._areaFocusManager.clear()
    }
  }

  _getProvinceName(options) {
    if (options == null || typeof options !== 'object') {
      return null
    }

    if (typeof options.name === 'string') {
      return options.name.trim()
    }

    const optionKeys = Object.keys(options)
    const unsupportedKeys = optionKeys.filter((key) => key !== 'name' && key !== 'highlight')

    if (unsupportedKeys.length > 0) {
      console.warn(
        `[AreaFocuser] focusProvince expects options like { name: 'Ha Noi', highlight: true }. Unsupported keys: ${unsupportedKeys.join(', ')}`
      )
    }

    return null
  }

  _shouldHighlight(options) {
    if (options == null || typeof options !== 'object') {
      return false
    }

    return options.highlight === true
  }
}