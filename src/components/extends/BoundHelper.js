class BoundHelper {
  static createEmptyBounds() {
    return {
      minLat: Infinity,
      minLng: Infinity,
      maxLat: -Infinity,
      maxLng: -Infinity,
    }
  }

  static updateBounds(bounds, lat, lng) {
    bounds.minLat = Math.min(bounds.minLat, lat)
    bounds.minLng = Math.min(bounds.minLng, lng)
    bounds.maxLat = Math.max(bounds.maxLat, lat)
    bounds.maxLng = Math.max(bounds.maxLng, lng)
  }

  static isValidBounds(bounds) {
    if (!bounds) {
      return false
    }

    return !(
      bounds.minLat === Infinity ||
      bounds.minLng === Infinity ||
      bounds.maxLat === -Infinity ||
      bounds.maxLng === -Infinity
    )
  }
}

export {BoundHelper}