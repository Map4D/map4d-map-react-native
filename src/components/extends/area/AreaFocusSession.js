import {
  areaGeometryToPolygonPaths,
  createWorldMaskPaths,
} from './AreaFocusGeometryUtils'

class AreaFocusSession {
  constructor(mapView, area, options) {
    this.mapView = mapView
    this.area = area
    this.options = options || {}
    this.polygonIds = []
  }

  render() {
    this.clearPolygons()

    const data = this.area.getGeometryData()
    if (!data || !data.geometry) {
      return
    }

    const highlight = this.options.display === 'highlight'

    if (highlight) {
      this.renderHighlight(data.geometry)
    }
    else {
      this.renderNormal(data.geometry)
    }
  }

  destroy() {
    this.clearPolygons()
  }

  renderNormal(geometry) {
    const polygons = areaGeometryToPolygonPaths(geometry)

    polygons.forEach((coordinates, index) => {
      this.addPolygon({
        id: `${String(this.area.getId ? this.area.getId() : 'area')}-normal-${index}`,
        coordinates,
        fillColor: '#2196F3BF',
        strokeColor: '#0D47A1FF',
        strokeWidth: 1.5,
        visible: true,
      })
    })
  }

  renderHighlight(geometry) {
    const paths = createWorldMaskPaths(geometry)

    if (paths.length <= 1) {
      return
    }

    const [coordinates, ...holes] = paths

    this.addPolygon({
      id: `${String(this.area.getId ? this.area.getId() : 'area')}-highlight`,
      coordinates,
      holes,
      fillColor: '#0000001E',
      strokeColor: '#FF0000FF',
      strokeWidth: 2,
      zIndex: 999,
      visible: true,
    })
  }

  addPolygon(polygon) {
    if (!this.mapView || typeof this.mapView._addPolygon !== 'function') {
      return
    }

    const id = this.mapView._addPolygon(polygon)

    if (id != null) {
      this.polygonIds.push(id)
    }
  }

  clearPolygons() {
    if (!this.mapView || typeof this.mapView._removePolygon !== 'function') {
      this.polygonIds = []
      return
    }

    this.polygonIds.forEach((id) => {
      this.mapView._removePolygon(id)
    })

    this.polygonIds = []
  }
}

export {
  AreaFocusSession,
}
