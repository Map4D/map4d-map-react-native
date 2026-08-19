import { firstNonEmptyString, toFiniteNumber } from '../shared/text';
import {
  INFRA_ACTIVE_TEXT,
  INFRA_INACTIVE_TEXT,
  INFRA_LAYER_LABEL,
  INFRA_TYPE_LABEL,
  ZONE_MEDIA_BASE_URL,
} from './constants';

/**
 * The representative image comes back as a whole URL, while the gallery names
 * its files by path alone, so both are put through the same normaliser.
 */
function resolveMediaUrl(url) {
  const path = firstNonEmptyString([url]);
  if (!path) {
    return null;
  }

  return /^https?:\/\//i.test(path)
    ? path
    : `${ZONE_MEDIA_BASE_URL}${path.replace(/^\/+/, '')}`;
}

function resolveBannerImage(data) {
  const gallery = Array.isArray(data?.hinhAnh) ? data.hinhAnh : [];

  return (
    resolveMediaUrl(data?.hinhAnhDaiDien) ??
    resolveMediaUrl(gallery[0]?.duongDan)
  );
}

function normalizePoint(geometry) {
  const coordinates = geometry?.coordinates;
  if (geometry?.type !== 'Point' || !Array.isArray(coordinates)) {
    return null;
  }

  const longitude = toFiniteNumber(coordinates[0]);
  const latitude = toFiniteNumber(coordinates[1]);

  return longitude == null || latitude == null ? null : { latitude, longitude };
}

/**
 * Maps the `HaTangKetNoiDT/{id}` payload to the flat shape the sheet renders.
 * Returns `null` when the id has nothing attached, the same way the zone and
 * province mappers do.
 */
function resolveInfraDetailInfo(json) {
  const data = json?.data;
  if (!data || typeof data !== 'object') {
    return null;
  }

  const name = firstNonEmptyString([data.ten]);
  if (!name) {
    return null;
  }

  const typeLabel = firstNonEmptyString([data.tenLoaiHaTang]);
  const layerLabel = firstNonEmptyString([data.tenLop]);
  const description = firstNonEmptyString([data.moTa]);

  return {
    id: toFiniteNumber(data.id),
    name,
    typeLabel,
    subtitle: layerLabel,
    // `hoatDong` is a plain boolean here rather than the zone's three-state
    // publish flag, so there is always a status to show.
    status: data.hoatDong === false ? INFRA_INACTIVE_TEXT : INFRA_ACTIVE_TEXT,
    isPublished: data.hoatDong !== false,
    stats: [
      { label: INFRA_TYPE_LABEL, value: typeLabel },
      { label: INFRA_LAYER_LABEL, value: layerLabel },
    ].filter((stat) => stat.value != null),
    introParagraphs: description ? [description] : [],
    bannerImage: resolveBannerImage(data),
    pin: normalizePoint(data.geometry),
    // Distinct from `pin` above: that one is also null for a shape the map
    // can't drop a pin on (a line rather than a point), which would mislabel
    // real-but-unsupported data as missing. This tracks only whether the API
    // sent anything at all.
    hasGeometry: data.geometry != null,
  };
}

export { resolveInfraDetailInfo };
