import {BoundHelper} from '../BoundHelper'

const WORLD_MASK_PATH = [
  { longitude: -180, latitude: -90 },
  { longitude: 180, latitude: -90 },
  { longitude: 180, latitude: 90 },
  { longitude: -180, latitude: 90 },
  { longitude: -180, latitude: -90 },
]

function parseViewbox(viewbox) {
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

  return {
    minLat,
    minLng,
    maxLat,
    maxLng,
  }
}

function getViewboxFromGeometry(geometry) {
  if (!geometry || typeof geometry !== 'object') {
    return null
  }

  const bounds = BoundHelper.createEmptyBounds()

  const updateBounds = (coordinate) => {
    if (!Array.isArray(coordinate) || coordinate.length < 2) {
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
    geometry.coordinates.forEach((ring) => {
      ring.forEach((coordinate) => {
        updateBounds(coordinate)
      })
    })
  }

  if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach((polygon) => {
      polygon.forEach((ring) => {
        ring.forEach((coordinate) => {
          updateBounds(coordinate)
        })
      })
    })
  }

  if (!BoundHelper.isValidBounds(bounds)) {
    return null
  }

  return bounds
}

function convertAndClosePath(path) {
  if (!Array.isArray(path) || path.length == 0) {
    return []
  }

  const coordinatePath = path
    .filter((point) => Array.isArray(point) && point.length >= 2)
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

function areaGeometryToPolygonPaths(geometry) {
  const paths = []

  if (!geometry || typeof geometry !== 'object') {
    return paths
  }

  if (geometry.type === 'Polygon') {
    if (Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0) {
      const path = convertAndClosePath(geometry.coordinates[0])
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

      const path = convertAndClosePath(polygonCoordinates[0])
      if (path.length > 0) {
        paths.push(path)
      }
    })
  }

  return paths
}

function createWorldMaskPaths(geometry) {
  const holes = areaGeometryToPolygonPaths(geometry)

  return [
    WORLD_MASK_PATH,
    ...holes,
  ]
}

export {
  WORLD_MASK_PATH,
  parseViewbox,
  getViewboxFromGeometry,
  areaGeometryToPolygonPaths,
  createWorldMaskPaths,
}
