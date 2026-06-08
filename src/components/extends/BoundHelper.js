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

  static extendBounds(targetBounds, sourceBounds) {
    if (!BoundHelper.isValidBounds(sourceBounds)) {
      return
    }

    targetBounds.minLat = Math.min(targetBounds.minLat, sourceBounds.minLat)
    targetBounds.minLng = Math.min(targetBounds.minLng, sourceBounds.minLng)
    targetBounds.maxLat = Math.max(targetBounds.maxLat, sourceBounds.maxLat)
    targetBounds.maxLng = Math.max(targetBounds.maxLng, sourceBounds.maxLng)
  }
}

export {BoundHelper}