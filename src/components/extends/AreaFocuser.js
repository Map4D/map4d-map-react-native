import {
  BoundHelper,
} from './BoundHelper'

export class AreaFocuser {

  constructor(mapView) {
    this.mapView = mapView
    this.highlightPaths = []
    this.highlightPolygonId = 'area-focuser-highlight-polygon'
    this.currentIndustrialZoneFocusId = null
  }

  /**
   * @typedef {{type: 'Point', coordinates: [number, number]}} PointGeometry
   * @typedef {Array<Array<[number, number]>>} PolygonCoordinates
   * @typedef {{type: 'Polygon', coordinates: PolygonCoordinates}} PolygonGeometry
   * @typedef {{type: 'MultiPolygon', coordinates: Array<PolygonCoordinates>}} MultiPolygonGeometry
   * @typedef {PointGeometry | PolygonGeometry | MultiPolygonGeometry} Geometry
   * @typedef {{id?: number, type: 'province' | 'industrial' | 'economic', display?: 'normal' | 'highlight'}} FocusOptions
   * @typedef {{name?: string, highlight?: boolean}} FocusProvinceOptions
   */

  /**
   * @param {FocusProvinceOptions} options
   */
  async focusProvince(options) {
    const provinceName = this._getProvinceName(options)
    const shouldHighlight = this._shouldHighlight(options)

    if (!provinceName) {
      this._clearHighlight()
      return
    }

    const url =
      `https://api-app-cdtqg.map4d.vn/map/country/geometry?name=${encodeURIComponent(provinceName)}`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        return
      }

      const data = await response.json()

      if (data.code !== 'ok') {
        return
      }

      const feature =
        data.result && data.result.features && data.result.features.length > 0 ? data.result.features[0] : null

      if (!feature) {
        return
      }

      const geometry = feature.geometry
      if (!geometry) {
        return
      }

      let bounds = null

      const viewbox =
        feature.properties && feature.properties.viewbox ? feature.properties.viewbox : null

      if (viewbox != null && viewbox.trim() != '') {
        bounds = this._parseViewbox(viewbox)
      }

      if (!bounds) {
        bounds = this._getViewboxFromGeometry(geometry)
      }

      if (!bounds) {
        return
      }

      this.mapView.fitBounds({
        bounds: {
          southWest: {
            latitude: bounds[0],
            longitude: bounds[1],
          },
          northEast: {
            latitude: bounds[2],
            longitude: bounds[3],
          },
        }
      })

      this._createHighlightPaths(geometry)
      this._clearHighlightPolygons()
      if (shouldHighlight) {
        const polygon = this._getHighlightPolygonProps()

        if (polygon) {
          this.mapView._addPolygon({
            ...polygon,
            id: this.highlightPolygonId,
            zIndex: 999,
          })
        }
      }
    }
    catch (error) {
      console.error('Cannot focus province:', error)
    }
  }

  async _focusIndustrialZone(options) {
    this._clearHighlight()

    if (this.currentIndustrialZoneFocusId != null) {
      this.currentIndustrialZoneFocusId = null
    }

    if (!options || typeof options !== 'object' || typeof options.id !== 'number') {
      return
    }

    const focusId = options.id

    this.currentIndustrialZoneFocusId = focusId

    const url = `https://bdsapi.omyto.com/api/BDS/KhuCongNghiep/${focusId}`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        console.error('Failed to fetch industrial zone data:', response.status, response.statusText)
        return
      }

      const data = await response.json()

      if (!data.success) {
        console.error('API returned error:', data.message)
        return
      }

      const geometry = data?.data?.geometry
      if (!geometry) {
        return
      }

      const camera = await this._getCameraForGeometry(geometry)
      if (camera) {
        this.mapView.animateCamera(camera)
      }

      if (options.display === 'highlight') {
        this._createHighlightPaths(geometry)
        const polygon = this._getHighlightPolygonProps()

        if (polygon) {
          this.mapView._addPolygon({
            ...polygon,
            id: focusId,
            zIndex: 999,
          })
        }
      }
      else {
        const polygons = this._getPolygonPathsFromGeometry(geometry)
        polygons.forEach((coordinates) => {
          this.mapView._addPolygon({
            id: focusId,
            coordinates,
            fillColor: '#2196F3BF',
            strokeColor: '#0D47A1FF',
            strokeWidth: 1.5,
            visible: true,
          })
        })
      }
    }
    catch (error) {
      console.error('Cannot focus industrial zone:', error)
    }
  }

  _clearHighlight() {
    this._clearHighlightPaths()
    this._clearHighlightPolygons()
  }

  /**
   * @param {FocusOptions} options
   */
  async focus(options) {
    if (options == null || options.id == null) {
      this._clearHighlight()
      return
    }

    switch (options.type) {
      case 'province':
        break
      case 'industrial':
        await this._focusIndustrialZone(options)
        break
      case 'economic':
        break
      default:
        console.warn('Unsupported focus type:', options.type)
        return
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

  _parseViewbox(viewbox) {
    const bounds = viewbox.split(',').map(Number)

    if (bounds.length != 4) {
      return null
    }

    const [minLat, minLng, maxLat, maxLng] = bounds

    if (
      Number.isNaN(minLat) ||
      Number.isNaN(minLng) ||
      Number.isNaN(maxLat) ||
      Number.isNaN(maxLng)
    ) {
      return null
    }

    return [
      minLat,
      minLng,
      maxLat,
      maxLng,
    ]
  }

  /**
   * @param {Geometry} geometry
   */
  async _getCameraForGeometry(geometry) {
    if (!geometry || typeof geometry !== 'object') {
      return null
    }

    switch (geometry.type) {
      case 'Point': {
        const point = geometry.coordinates
        if (!Array.isArray(point) || point.length < 2) {
          return null
        }

        return {
          center: {
            latitude: point[1],
            longitude: point[0],
          },
          zoom: 16,
          bearing: 0,
          tilt: 0,
        }
      }

      case 'Polygon': {
        const bounds = this._polygonToLatLngBounds(geometry.coordinates)
        return this._getCameraForBounds(bounds)
      }

      case 'MultiPolygon': {
        const bounds = BoundHelper.createEmptyBounds()

        geometry.coordinates.forEach((polygonCoordinates) => {
          const polygonBounds = this._polygonToLatLngBounds(polygonCoordinates)
          BoundHelper.extendBounds(bounds, polygonBounds)
        })

        if (!BoundHelper.isValidBounds(bounds)) {
          return null
        }

        return this._getCameraForBounds(bounds)
      }

      default:
        console.warn('Unsupported geometry:', geometry)
        return null
    }
  }

  async _getCameraForBounds(bounds) {
    if (!bounds || !this.mapView || typeof this.mapView.cameraForBounds !== 'function') {
      return null
    }

    try {
      return await this.mapView.cameraForBounds({
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
      })
    }
    catch (error) {
      return null
    }
  }

  /**
   * @param {PolygonCoordinates} coordinates
   */
  _polygonToLatLngBounds(coordinates) {
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      return null
    }

    const ring = coordinates[0]
    if (!Array.isArray(ring) || ring.length === 0) {
      return null
    }

    const bounds = BoundHelper.createEmptyBounds()

    ring.forEach((coordinate) => {
      if (!Array.isArray(coordinate) || coordinate.length < 2) {
        return
      }

      const lng = coordinate[0]
      const lat = coordinate[1]
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return
      }

      BoundHelper.updateBounds(bounds, lat, lng)
    })

    if (!BoundHelper.isValidBounds(bounds)) {
      return null
    }

    return bounds
  }

  _getPolygonPathsFromGeometry(geometry) {
    const paths = []

    if (!geometry || typeof geometry !== 'object') {
      return paths
    }

    if (geometry.type === 'Polygon') {
      if (Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0) {
        const path = this._convertAndClosePath(geometry.coordinates[0])
        if (path.length > 0) {
          paths.push(path)
        }
      }
      return paths
    }

    if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((polygonCoordinates) => {
        if (!Array.isArray(polygonCoordinates) || polygonCoordinates.length === 0) {
          return
        }

        const path = this._convertAndClosePath(polygonCoordinates[0])
        if (path.length > 0) {
          paths.push(path)
        }
      })
    }

    return paths
  }

  _getViewboxFromGeometry(geometry) {
    const bounds = BoundHelper.createEmptyBounds()

    const updateBounds = (coordinate) => {
      if (coordinate.length < 2) {
        return
      }

      const lng = coordinate[0]
      const lat = coordinate[1]

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return
      }

      BoundHelper.updateBounds(bounds, lat, lng)
    }

    if (geometry.type === 'Polygon') {
      const polygons = geometry.coordinates

      polygons.forEach(function (ring) {
        ring.forEach(function (coordinate) {
          updateBounds(coordinate)
        })
      })
    }

    if (geometry.type === 'MultiPolygon') {
      const multiPolygons = geometry.coordinates

      multiPolygons.forEach(function (polygon) {
        polygon.forEach(function (ring) {
          ring.forEach(function (coordinate) {
            updateBounds(coordinate)
          })
        })
      })
    }

    if (!BoundHelper.isValidBounds(bounds)) {
      return null
    }

    return [
      bounds.minLat,
      bounds.minLng,
      bounds.maxLat,
      bounds.maxLng,
    ]
  }

  _createHighlightPaths(geometry) {
    this._clearHighlightPaths()

    const paths = this._createWorldMaskPaths(geometry)

    if (paths.length <= 1) {
      return
    }

    this.highlightPaths = paths
  }

  _clearHighlightPaths() {
    this.highlightPaths = []
  }

  _clearHighlightPolygons() {
    if (!this.mapView) {
      return
    }

    this.mapView._removePolygon(this.highlightPolygonId)
    this.mapView._removePolygon(this.currentIndustrialZoneFocusId)
  }

  _getHighlightPolygonProps() {
    if (!this.highlightPaths || this.highlightPaths.length <= 1) {
      return null
    }

    const [coordinates, ...holes] = this.highlightPaths

    return {
      coordinates,
      holes,
      fillColor: "#0000001E",
      strokeColor: "#FF0000FF",
      strokeWidth: 2.0,
    }
  }

  _createWorldMaskPaths(geometry) {
    const worldPath = [
      { longitude: -180, latitude: -90 },
      { longitude: 180, latitude: -90 },
      { longitude: 180, latitude: 90 },
      { longitude: -180, latitude: 90 },
      { longitude: -180, latitude: -90 },
    ]

    const paths = [
      worldPath,
    ]

    const holes = this._getHolePathsFromGeometry(geometry)

    holes.forEach((hole) => {
      paths.push(hole)
    })

    return paths
  }

  _getHolePathsFromGeometry(geometry) {
    const paths = []

    if (geometry.type == 'Polygon') {
      const polygon = geometry.coordinates

      if (polygon.length > 0) {
        paths.push(this._convertAndClosePath(polygon[0]))
      }
    }

    if (geometry.type == 'MultiPolygon') {
      const multiPolygon = geometry.coordinates

      multiPolygon.forEach((polygon) => {
        if (polygon.length > 0) {
          paths.push(this._convertAndClosePath(polygon[0]))
        }
      })
    }

    return paths
  }

  _convertAndClosePath(path) {
    if (path.length == 0) {
      return []
    }

    const coordinatePath = path
      .filter((point) => point.length >= 2)
      .map((point) => ({
        latitude: point[1],
        longitude: point[0],
      }))

    if (coordinatePath.length == 0) {
      return []
    }

    const firstPoint = coordinatePath[0]
    const lastPoint = coordinatePath[coordinatePath.length - 1]

    if (
      firstPoint.latitude == lastPoint.latitude &&
      firstPoint.longitude == lastPoint.longitude
    ) {
      return coordinatePath
    }

    return [
      ...coordinatePath,
      firstPoint,
    ]
  }
}