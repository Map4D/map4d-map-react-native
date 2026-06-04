export class AreaFocuser {

  constructor(mapView) {
    this.mapView = mapView
    this.highlightPaths = []
    this.highlightPolygonId = 'area-focuser-highlight-polygon'
  }

  /**
   * @param {{name?: string, highlight?: boolean}=} options
   */
  async focusProvince(options) {
    const provinceName = this.getProvinceName(options)
    const shouldHighlight = this.shouldHighlight(options)

    if (!provinceName) {
      this.clearHighlightPaths()
      this.clearHighlightPolygon()
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
        bounds = this.parseViewbox(viewbox)
      }

      if (!bounds) {
        bounds = this.getViewboxFromGeometry(geometry)
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

      this.createHighlightPaths(geometry)

      if (shouldHighlight) {
        const polygon = this.getHighlightPolygonProps()

        if (polygon) {
          this.mapView._addPolygon({
            ...polygon,
            id: this.highlightPolygonId,
            zIndex: 999,
          })
        }
      }
      else {
        this.clearHighlightPolygon()
      }
    }
    catch (error) {
      console.error('Cannot focus province:', error)
    }
  }

  getProvinceName(options) {
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

  shouldHighlight(options) {
    if (options == null || typeof options !== 'object') {
      return false
    }

    return options.highlight === true
  }

  parseViewbox(viewbox) {
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

  getViewboxFromGeometry(geometry) {
    const bounds = {
      minLat: Infinity,
      minLng: Infinity,
      maxLat: -Infinity,
      maxLng: -Infinity,
    }

    const updateBounds = function (coordinate) {
      if (coordinate.length < 2) {
        return
      }

      const lng = coordinate[0]
      const lat = coordinate[1]

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return
      }

      bounds.minLat = Math.min(bounds.minLat, lat)
      bounds.minLng = Math.min(bounds.minLng, lng)
      bounds.maxLat = Math.max(bounds.maxLat, lat)
      bounds.maxLng = Math.max(bounds.maxLng, lng)
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

    if (
      bounds.minLat === Infinity ||
      bounds.minLng === Infinity ||
      bounds.maxLat === -Infinity ||
      bounds.maxLng === -Infinity
    ) {
      return null
    }

    return [
      bounds.minLat,
      bounds.minLng,
      bounds.maxLat,
      bounds.maxLng,
    ]
  }

  createHighlightPaths(geometry) {
    this.clearHighlightPaths()

    const paths = this.createWorldMaskPaths(geometry)

    if (paths.length <= 1) {
      return
    }

    this.highlightPaths = paths
  }

  clearHighlightPaths() {
    this.highlightPaths = []
  }

  clearHighlightPolygon() {
    if (!this.mapView) {
      return
    }

    this.mapView._removePolygon(this.highlightPolygonId)
  }

  getHighlightPolygonProps() {
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

  createWorldMaskPaths(geometry) {
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

    const holes = this.getHolePathsFromGeometry(geometry)

    holes.forEach((hole) => {
      paths.push(hole)
    })

    return paths
  }

  getHolePathsFromGeometry(geometry) {
    const paths = []

    if (geometry.type == 'Polygon') {
      const polygon = geometry.coordinates

      if (polygon.length > 0) {
        paths.push(this.convertAndClosePath(polygon[0]))
      }
    }

    if (geometry.type == 'MultiPolygon') {
      const multiPolygon = geometry.coordinates

      multiPolygon.forEach((polygon) => {
        if (polygon.length > 0) {
          paths.push(this.convertAndClosePath(polygon[0]))
        }
      })
    }

    return paths
  }

  convertAndClosePath(path) {
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