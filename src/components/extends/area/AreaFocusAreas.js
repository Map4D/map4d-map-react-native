import {getViewboxFromGeometry} from './AreaFocusGeometryUtils'
import {IndustrialEconomicType} from './AreaFocusTypes'

const INDUSTRIAL_ECONOMIC_PATH_BY_TYPE = {
  [IndustrialEconomicType.INDUSTRIAL_ZONE]: 'khu-cong-nghiep',
  [IndustrialEconomicType.ECONOMIC_ZONE]: 'khu-kinh-te',
  [IndustrialEconomicType.ECO_INDUSTRIAL_ZONE]: 'khu-cong-nghiep-sinh-thai',
  [IndustrialEconomicType.FREE_TRADE_ZONE]: 'khu-thuong-mai-tu-do',
  [IndustrialEconomicType.NON_TARIFF_ZONE]: 'khu-phi-thue-quan',
  [IndustrialEconomicType.OTHER_ZONE_MODEL]: 'mo-hinh-khu-khac',
}

const BDS_API_BASE_URL = 'https://cmcdtqg-gateway.dieuhanhso.vn/staging'

class ProvinceArea {
  constructor(id) {
    this.id = id
    this.name = null
    this.loaded = false
    this.geometryData = null
    this.bounds = null
  }

  static fromName(name) {
    const area = new ProvinceArea(null)
    area.name = name
    return area
  }

  async load() {
    if (this.loaded) {
      return true
    }

    const hasValidId = typeof this.id === 'number'
    const hasValidName = typeof this.name === 'string' && this.name.trim() !== ''

    if (!hasValidId && !hasValidName) {
      return false
    }

    const normalizedName = hasValidName ? this.name.trim() : null
    const url = hasValidId
      ? `${BDS_API_BASE_URL}/bds/api/dmhc/TinhThanh/${this.id}/geometry`
      : `${BDS_API_BASE_URL}/bds/api/dmhc/TinhThanh/geometry?ten=${encodeURIComponent(normalizedName)}`

    const response = await fetch(url)

    if (!response.ok) {
      return false
    }

    const data = await response.json()

    if (!data.success) {
      console.error('Fetch province area data failed:', data.message)
      return false
    }

    const areaData = data.data
    const geometry = areaData && areaData.geometry ? areaData.geometry : null

    if (!geometry) {
      return false
    }

    this.geometryData = {
      name: areaData && areaData.name ? areaData.name : normalizedName,
      geometry,
    }
    this.bounds = getViewboxFromGeometry(geometry)
    this.loaded = true

    return true
  }

  getGeometryData() {
    return this.geometryData
  }

  getBounds() {
    return this.bounds
  }

  getId() {
    return this.id != null ? this.id : `province-${this.name || 'unknown'}`
  }
}

class IndustrialEconomicArea {
  constructor(type, id) {
    this.type = type
    this.id = id
    this.loaded = false
    this.geometryData = null
    this.bounds = null
  }

  async load() {
    if (this.loaded) {
      return true
    }

    if (typeof this.id !== 'number') {
      return false
    }

    const pathSegment = INDUSTRIAL_ECONOMIC_PATH_BY_TYPE[this.type]

    if (!pathSegment) {
      console.error('Unsupported industrial/economic area type:', this.type)
      return false
    }

    const url = `${BDS_API_BASE_URL}/bds/api/kcnkkt/${pathSegment}/${this.id}/geometry`

    const response = await fetch(url)

    if (!response.ok) {
      console.error('Failed to fetch industrial zone data:', response.status, response.statusText)
      return false
    }

    const data = await response.json()

    if (!data.success) {
      console.error('API returned error:', data.message)
      return false
    }

    const areaData = data.data
    const geometry = areaData && areaData.geometry ? areaData.geometry : null

    if (!geometry) {
      return false
    }

    this.geometryData = {
      name: areaData && areaData.name ? areaData.name : null,
      geometry,
    }
    this.bounds = getViewboxFromGeometry(geometry)
    this.loaded = true

    return true
  }

  getGeometryData() {
    return this.geometryData
  }

  getBounds() {
    return this.bounds
  }

  getId() {
    return this.id
  }
}

export {
  ProvinceArea,
  IndustrialEconomicArea,
}
