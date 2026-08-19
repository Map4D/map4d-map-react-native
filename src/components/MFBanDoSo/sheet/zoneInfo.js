import { firstNonEmptyString } from '../shared/text';
import {
  ZONE_AREA_SUFFIX,
  ZONE_CURRENCY_SUFFIX,
  ZONE_ESTABLISHED_YEAR_LABEL,
  ZONE_MEDIA_BASE_URL,
  ZONE_PUBLISHED_TEXT,
  ZONE_STATUS_LABEL,
  ZONE_TOTAL_INVESTMENT_LABEL,
  ZONE_TYPE_LABEL,
  ZONE_UNPUBLISHED_TEXT,
} from './constants';

/**
 * Both KCN/KKT layers in the vector tiles are named after this prefix
 * (`v.kcnkkt` for the polygons, `v.kcnkkt_pin` for the pins), which is what
 * tells a tap on a zone apart from a tap on any other styled layer.
 */
const ZONE_SOURCE_LAYER_PREFIX = 'v.kcnkkt';

function toNumericId(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${Math.trunc(value)}`;
  }

  if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
    return value.trim();
  }

  return null;
}

/**
 * Digs the KCN/KKT id out of a tapped data source feature. The tiles carry it
 * as a plain `id` property, and it is the same id the detail endpoint is
 * addressed with. Returns null for features from any other layer, which is how
 * a tap on a zone is told apart from a tap on the rest of the map.
 */
function resolveZoneFeatureId(feature) {
  const properties = feature?.properties;
  if (!properties || typeof properties !== 'object') {
    return null;
  }

  const layer = firstNonEmptyString([feature.sourceLayer, properties.layer]);
  if (!layer || layer.indexOf(ZONE_SOURCE_LAYER_PREFIX) !== 0) {
    return null;
  }

  return toNumericId(properties.id);
}

function formatGroupedNumber(value, suffix) {
  const amount = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  const grouped = `${Math.trunc(amount)}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${grouped}${suffix}`;
}

function formatAmount(value) {
  return formatGroupedNumber(value, ZONE_CURRENCY_SUFFIX);
}

function formatYear(value) {
  const year = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(year) && year > 0 ? `${Math.trunc(year)}` : null;
}

function buildMainInfoStats(data) {
  return [
    {
      label: ZONE_ESTABLISHED_YEAR_LABEL,
      value: formatYear(data.namThanhLap),
    },
    {
      label: ZONE_TOTAL_INVESTMENT_LABEL,
      value: formatAmount(data.tongVonDauTu),
    },
    {
      label: ZONE_STATUS_LABEL,
      value: firstNonEmptyString([data.tinhTrang]),
    },
    {
      label: ZONE_TYPE_LABEL,
      value: firstNonEmptyString([data.tenLoaiHinh]),
    },
  ].filter((stat) => stat.value != null);
}

function normalizeInvestors(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      const name = firstNonEmptyString([item?.ten]);
      if (!name) {
        return null;
      }

      return {
        name,
        year: formatYear(item?.namDauTu),
      };
    })
    .filter((investor) => investor != null);
}

/**
 * The payload's `pin` is a GeoJSON Point, so its coordinates are [lng, lat] —
 * the opposite order of the `{latitude, longitude}` the map takes.
 */
function normalizePin(pin) {
  const coordinates = pin?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }

  const longitude = Number(coordinates[0]);
  const latitude = Number(coordinates[1]);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

function normalizeGeometry(geometry) {
  if (!geometry || typeof geometry !== 'object') {
    return null;
  }

  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
    return null;
  }

  return Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0
    ? geometry
    : null;
}

/**
 * Everything the sheet shows below the main figures lives in one optional
 * `gioiThieu` block, and most zones have none at all — the sections it feeds
 * simply do not appear for those.
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

/** The banner is the first still image of the block; video is skipped. */
function resolveBannerImage(intro) {
  const media = Array.isArray(intro?.hinhAnhVideo) ? intro.hinhAnhVideo : [];
  const image = media.find((entry) => entry?.type === 'image');

  return resolveMediaUrl(image?.url);
}

function normalizeParagraphs(values) {
  return (Array.isArray(values) ? values : [])
    .map((value) => firstNonEmptyString([value]))
    .filter((paragraph) => paragraph != null);
}

/**
 * The sector and advantage lists arrive as one string of comma-joined entries
 * rather than one entry per element, so they are split back apart to become a
 * chip each.
 *
 * What those entries hold is codes, not names — "CNHT" on some records, "1" on
 * others — and the payload carries no dictionary to read them through. They are
 * shown as they arrive, by decision, until the endpoint serves names.
 */
function normalizeTagList(values) {
  return (Array.isArray(values) ? values : [])
    .flatMap((value) => `${value ?? ''}`.split(','))
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function resolvePublishStatus(isCongBo) {
  if (isCongBo === true) {
    return ZONE_PUBLISHED_TEXT;
  }

  if (isCongBo === false) {
    return ZONE_UNPUBLISHED_TEXT;
  }

  return null;
}

/**
 * Maps the `portal/kcnkkt/{id}` payload to the flat shape the zone sheet
 * renders. Returns `null` when the id has no detail attached — the endpoint
 * answers 200 with a null `data` for ids that do not exist.
 */
function resolveZoneDetailInfo(json) {
  const data = json?.data;
  if (!data || typeof data !== 'object') {
    return null;
  }

  const name = firstNonEmptyString([data.tenKhu, data.tenTiengAnh]);
  if (!name) {
    return null;
  }

  const intro = data.gioiThieu;

  return {
    id: toNumericId(data.id),
    name,
    typeLabel: firstNonEmptyString([data.tenLoaiKhu]),
    subtitle: firstNonEmptyString([data.tenTiengAnh]),
    code: firstNonEmptyString([data.maKhu, data.tenVietTat]),
    status: resolvePublishStatus(data.isCongBo),
    isPublished: data.isCongBo === true,
    stats: buildMainInfoStats(data),
    address: firstNonEmptyString([data.diaChi]),
    introParagraphs: normalizeParagraphs(intro?.gioiThieu),
    investors: normalizeInvestors(data.dsChuDauTu),
    pin: normalizePin(data.pin),
    geometry: normalizeGeometry(data.geometry),
    // Distinct from `geometry` above: that one is null for a shape the map
    // can't draw too, which would mislabel real-but-unsupported data as
    // missing. This tracks only whether the API sent anything at all.
    hasGeometry: data.geometry != null,
    bannerImage: resolveBannerImage(intro),
    attractedSectors: normalizeTagList(intro?.nganhNgheThuHutDauTu),
    restrictedSectors: normalizeTagList(intro?.nganhNgheHanCheDauTu),
    advantages: normalizeTagList(intro?.loiTheDauTu),
  };
}

/**
 * Maps the `portal/kcnkkt/{id}/du-an-thu-hut` payload — a flat array — to the
 * rows the project list renders. Entries without a name are dropped: there
 * would be nothing to label the card with.
 */
function resolveZoneProjects(json) {
  const data = json?.data;

  return (Array.isArray(data) ? data : [])
    .map((item, index) => {
      const name = firstNonEmptyString([item?.tenDuAn, item?.maDuAn]);
      if (!name) {
        return null;
      }

      return {
        key: toNumericId(item?.id) ?? `index-${index}`,
        name,
        code: firstNonEmptyString([item?.maDuAn]),
        sector: firstNonEmptyString([item?.linhVuc]),
        status: firstNonEmptyString([item?.trangThai]),
        area: formatGroupedNumber(item?.dienTichDatDuKien, ZONE_AREA_SUFFIX),
        investment: formatAmount(item?.tongMucDauTuDuKien),
      };
    })
    .filter((project) => project != null);
}

export { resolveZoneDetailInfo, resolveZoneFeatureId, resolveZoneProjects };
