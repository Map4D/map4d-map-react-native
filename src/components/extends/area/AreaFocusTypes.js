/**
 * @typedef {{type: 'Point', coordinates: [number, number]}} PointGeometry
 * @typedef {Array<Array<[number, number]>>} PolygonCoordinates
 * @typedef {{type: 'Polygon', coordinates: PolygonCoordinates}} PolygonGeometry
 * @typedef {{type: 'MultiPolygon', coordinates: Array<PolygonCoordinates>}} MultiPolygonGeometry
 * @typedef {PointGeometry | PolygonGeometry | MultiPolygonGeometry} AreaGeometry
 */

/**
 * @typedef {Object} GeometryData
 * @property {string=} name
 * @property {AreaGeometry=} geometry
 */

/**
 * @typedef {Object} FocusableArea
 * @property {boolean} loaded
 * @property {boolean} editable
 * @property {() => Promise<boolean>} load
 * @property {() => GeometryData | null} getGeometryData
 * @property {() => {minLat: number, minLng: number, maxLat: number, maxLng: number} | null} getBounds
 * @property {() => string | number | null=} getId
 */

const IndustrialEconomicType = {
  INDUSTRIAL_ZONE: 1,
  ECONOMIC_ZONE: 2,
  ECO_INDUSTRIAL_ZONE: 3,
  FREE_TRADE_ZONE: 4,
  NON_TARIFF_ZONE: 5,
  OTHER_ZONE_MODEL: 6,
}

export {
  IndustrialEconomicType,
}
