import { firstNonEmptyString } from '../shared/text';

function normalizeStats(stats) {
  return (Array.isArray(stats) ? stats : [])
    .map((stat) => {
      const label = firstNonEmptyString([stat?.label, stat?.title, stat?.name]);
      const value =
        stat?.value == null || `${stat.value}`.trim().length === 0
          ? null
          : `${stat.value}`.trim();

      if (!label || !value) {
        return null;
      }

      return { label, value };
    })
    .filter((stat) => stat != null);
}

function normalizeSectors(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim().length > 0 ? item.trim() : null;
      }

      return firstNonEmptyString([item?.name, item?.title, item?.label]);
    })
    .filter((name) => name != null);
}

function normalizeFocusProvince(location, fallbackName) {
  const focusProvince = location?.map?.focusProvince;
  const name =
    firstNonEmptyString([focusProvince?.name]) ||
    (typeof fallbackName === 'string' && fallbackName.trim().length > 0
      ? fallbackName.trim()
      : null);

  if (!name) {
    return null;
  }

  return {
    name,
    highlight: focusProvince?.highlight !== false,
  };
}

/**
 * Maps the `ProvinceInvestmentInfo/reverse` payload to the flat shape the
 * bottom sheet renders. Returns `null` when the tapped position has no
 * investment data attached.
 */
function resolveProvinceInvestmentInfo(json) {
  const data = json?.data;
  if (!data || typeof data !== 'object') {
    return null;
  }

  const province = data.province ?? {};
  const hero = province.hero ?? {};
  const name = firstNonEmptyString([province.name, hero.title]);

  if (!name) {
    return null;
  }

  const industrialZones = Number.isFinite(data.industrialZones)
    ? data.industrialZones
    : null;

  return {
    id: data.id ?? province.id ?? null,
    code: firstNonEmptyString([province.code]),
    name,
    subtitle: firstNonEmptyString([hero.subtitle]),
    bannerImage: firstNonEmptyString([hero.bannerImage]),
    stats: normalizeStats(data.stats),
    overviewTitle: firstNonEmptyString([data.investmentOverview?.title]),
    overviewContent: firstNonEmptyString([data.investmentOverview?.content]),
    sectorsTitle: firstNonEmptyString([data.focusSectors?.title]),
    sectors: normalizeSectors(data.focusSectors?.items),
    industrialZones,
    contactTitle: firstNonEmptyString([data.investmentContact?.title]),
    contactPhone: firstNonEmptyString([data.investmentContact?.phone]),
    contactEmail: firstNonEmptyString([data.investmentContact?.email]),
    focusProvince: normalizeFocusProvince(data.location, name),
  };
}

export { resolveProvinceInvestmentInfo };
