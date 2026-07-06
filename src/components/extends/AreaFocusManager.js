import {AreaFocusSession} from './area/AreaFocusSession'
import {ProvinceArea, IndustrialEconomicArea} from './area/AreaFocusAreas'
import {IndustrialEconomicType} from './area/AreaFocusTypes'

/**
 * @typedef {'normal' | 'highlight'} FocusDisplay
 */

/**
 * @typedef {{left?: number, right?: number, top?: number, bottom?: number}} FocusPadding
 */

/**
 * @typedef {'province' | 'industrialZone' | 'economicZone' | 'ecoIndustrialZone' | 'freeTradeZone' | 'nonTariffZone' | 'otherZoneModel' | number} FocusType
 */

/**
 * @typedef {Object} FocusOptions
 * @property {FocusType} type
 * @property {number=} id
 * @property {string=} name
 * @property {FocusDisplay=} display
 * @property {FocusPadding=} padding
 */

const VIETNAM_MAINLAND_BOUNDS = {
  minLat: 8.18,
  minLng: 102.14,
  maxLat: 23.4,
  maxLng: 109.47,
}

const FOCUS_TYPE_TO_INDUSTRIAL_ECONOMIC_TYPE = {
  industrialZone: IndustrialEconomicType.INDUSTRIAL_ZONE,
  economicZone: IndustrialEconomicType.ECONOMIC_ZONE,
  ecoIndustrialZone: IndustrialEconomicType.ECO_INDUSTRIAL_ZONE,
  freeTradeZone: IndustrialEconomicType.FREE_TRADE_ZONE,
  nonTariffZone: IndustrialEconomicType.NON_TARIFF_ZONE,
  otherZoneModel: IndustrialEconomicType.OTHER_ZONE_MODEL,
}

export class AreaFocusManager {
  constructor(mapView) {
    this.mapView = mapView
    this.currentSession = null
  }

  async _focusArea(area, options) {
    this.clear()

    if (!area) {
      return null
    }

    try {
      if (!(await area.load())) {
        return null
      }

      const focusOptions = {...(options || {})}
      const bounds = area.getBounds() || VIETNAM_MAINLAND_BOUNDS

      this._fitBounds(bounds, focusOptions)

      this.currentSession = new AreaFocusSession(this.mapView, area, focusOptions)
      this.currentSession.render()

      return this.currentSession
    }
    catch (error) {
      console.error('Cannot focus area:', error)
      return null
    }
  }

  async _focusProvince(options) {
    const provinceId = this._getProvinceId(options)
    const provinceName = this._getProvinceName(options)

    if (provinceId == null && !provinceName) {
      this.clear()
      return null
    }

    const area = provinceId != null ? new ProvinceArea(provinceId) : ProvinceArea.fromName(provinceName)
    const display = options && options.display === 'highlight' ? 'highlight' : 'normal'

    return this._focusArea(area, {
      display,
      padding: options ? options.padding : undefined,
    })
  }

  /**
   * @param {FocusOptions | null | undefined} focusOptions
   * @returns {Promise<AreaFocusSession | null>}
   */
  async focus(focusOptions) {
    if (focusOptions == null) {
      this.clear()
      return null
    }

    if (focusOptions.type === 'province') {
      return this._focusProvince(focusOptions)
    }

    if (focusOptions.id == null) {
      console.warn('Focus options must include an id for non-province types:', focusOptions)
      this.clear()
      return null
    }

    const industrialEconomicType = this._getIndustrialEconomicType(focusOptions.type)

    if (industrialEconomicType != null) {
      return this._focusArea(new IndustrialEconomicArea(industrialEconomicType, focusOptions.id), {
        display: focusOptions.display,
        padding: focusOptions.padding,
      })
    }

    console.warn('Unsupported focus type:', focusOptions.type)
    return null
  }

  _getIndustrialEconomicType(type) {
    if (typeof type === 'number') {
      const values = Object.values(IndustrialEconomicType)
      return values.includes(type) ? type : null
    }

    if (typeof type !== 'string') {
      return null
    }

    return FOCUS_TYPE_TO_INDUSTRIAL_ECONOMIC_TYPE[type] || null
  }

  clear() {
    if (this.currentSession) {
      this.currentSession.destroy()
      this.currentSession = null
    }
  }

  _fitBounds(bounds, options) {
    if (!this.mapView || typeof this.mapView.fitBounds !== 'function' || !bounds) {
      return
    }

    this.mapView.fitBounds({
      bounds: {
        southWest: {
          latitude: bounds.minLat,
          longitude: bounds.minLng,
        },
        northEast: {
          latitude: bounds.maxLat,
          longitude: bounds.maxLng,
        },
      },
      padding: options ? options.padding : undefined,
    })
  }

  _getProvinceName(options) {
    if (options == null || typeof options !== 'object') {
      return null
    }

    if (typeof options.name === 'string') {
      const name = options.name.trim()
      return name.length > 0 ? name : null
    }

    const optionKeys = Object.keys(options)
    const unsupportedKeys = optionKeys.filter((key) => key !== 'type' && key !== 'id' && key !== 'name' && key !== 'display' && key !== 'padding')

    if (unsupportedKeys.length > 0) {
      console.warn(
        `[AreaFocusManager] focusProvince expects options like { type: 'province', name: 'Ha Noi', display: 'highlight' }. Unsupported keys: ${unsupportedKeys.join(', ')}`
      )
    }

    return null
  }

  _getProvinceId(options) {
    if (options == null || typeof options !== 'object') {
      return null
    }

    return typeof options.id === 'number' ? options.id : null
  }
}
