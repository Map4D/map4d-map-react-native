import { createCategoryItemsSignature } from '../internal/GeojsonStyleUtils';

function normalizeColorValue(color) {
  if (typeof color === 'string' && color.trim().length > 0) {
    return color.trim();
  }

  if (Array.isArray(color) && typeof color[0] === 'string' && color[0].trim().length > 0) {
    return color[0].trim();
  }

  return null;
}

function resolveItemsFromCategoryResponse(json) {
  const data = json?.data ?? json;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(json?.items)) {
    return json.items;
  }

  return [];
}

function resolveCategoryGroupMetadataFromResponse(json) {
  const data = json?.data ?? json;
  const groups = Array.isArray(data?.groups)
    ? data.groups
    : Array.isArray(json?.groups)
      ? json.groups
      : [];

  const titleByKey = {};
  const orderKeys = [];

  groups.forEach((group, index) => {
    if (!group || typeof group !== 'object') {
      return;
    }

    const rawKeyValue = [group.key, group.code, group.group, group.id]
      .find((value) => value != null && `${value}`.trim().length > 0);

    if (rawKeyValue == null) {
      return;
    }

    const key = `${rawKeyValue}`.trim();
    const rawTitleValue = [
      group.title,
      group.name,
      group.label,
      group.display_name,
      group.displayName,
    ].find((value) => typeof value === 'string' && value.trim().length > 0);

    const title = rawTitleValue ? rawTitleValue.trim() : key;

    titleByKey[key] = title;

    const preferredOrder = Number.isFinite(group.order) ? group.order : index;
    orderKeys.push({
      key,
      order: preferredOrder,
      index,
    });
  });

  orderKeys.sort((a, b) => {
    if (a.order === b.order) {
      return a.index - b.index;
    }
    return a.order - b.order;
  });

  return {
    titleByKey,
    orderedKeys: orderKeys.map((entry) => entry.key),
  };
}

function normalizeCategoryItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => ({
    ...item,
    checked: item?.checked !== false,
  }));
}

function getSelectedCategoryItems(items) {
  return (Array.isArray(items) ? items : []).filter(
    (item) => item?.checked !== false
  );
}

function resolveCategoryGroupKey(item) {
  const rawGroup = typeof item?.group === 'string' ? item.group.trim() : '';
  return rawGroup.length > 0 ? rawGroup : '__ungrouped__';
}

function createCategoryGroupSections(items, titleByKey = {}, orderedKeys = []) {
  const list = Array.isArray(items) ? items : [];
  const groupedMap = new Map();

  list.forEach((item, index) => {
    const groupKey = resolveCategoryGroupKey(item);
    const mappedTitle =
      typeof titleByKey[groupKey] === 'string' && titleByKey[groupKey].trim().length > 0
        ? titleByKey[groupKey].trim()
        : null;
    const groupTitle = mappedTitle || (groupKey === '__ungrouped__' ? 'Khac' : groupKey);

    if (!groupedMap.has(groupKey)) {
      groupedMap.set(groupKey, {
        key: groupKey,
        title: groupTitle,
        items: [],
      });
    }

    groupedMap.get(groupKey).items.push({
      item,
      index,
    });
  });

  const sections = Array.from(groupedMap.values());
  if (!Array.isArray(orderedKeys) || orderedKeys.length === 0) {
    return sections;
  }

  const orderMap = orderedKeys.reduce((acc, key, index) => {
    if (typeof key === 'string' && key.length > 0) {
      acc[key] = index;
    }
    return acc;
  }, {});

  return sections.sort((a, b) => {
    const aOrder = Object.prototype.hasOwnProperty.call(orderMap, a.key)
      ? orderMap[a.key]
      : Number.MAX_SAFE_INTEGER;
    const bOrder = Object.prototype.hasOwnProperty.call(orderMap, b.key)
      ? orderMap[b.key]
      : Number.MAX_SAFE_INTEGER;

    if (aOrder === bOrder) {
      return a.title.localeCompare(b.title);
    }
    return aOrder - bOrder;
  });
}

function reconcileExpandedGroupKeys(groupSections, previousExpandedGroupKeys) {
  const prev =
    previousExpandedGroupKeys && typeof previousExpandedGroupKeys === 'object'
      ? previousExpandedGroupKeys
      : {};

  return (Array.isArray(groupSections) ? groupSections : []).reduce(
    (acc, group) => {
      const key = group?.key;
      if (typeof key !== 'string' || key.length === 0) {
        return acc;
      }

      acc[key] = typeof prev[key] === 'boolean' ? prev[key] : true;
      return acc;
    },
    {}
  );
}

function createSelectedCategoryItemsSignature(items) {
  return createCategoryItemsSignature(getSelectedCategoryItems(items));
}

function toggleCategoryItemChecked(items, targetKey, targetIndex) {
  return (Array.isArray(items) ? items : []).map((item, index) => {
    const currentKey = item?.key ?? `index-${index}`;
    const isTarget = currentKey === targetKey && index === targetIndex;

    if (!isTarget) {
      return item;
    }

    return {
      ...item,
      checked: !(item?.checked !== false),
    };
  });
}

function toggleCategoryGroupChecked(items, targetGroupKey, checkedValue) {
  if (typeof targetGroupKey !== 'string' || targetGroupKey.length === 0) {
    return Array.isArray(items) ? items : [];
  }

  const nextChecked = checkedValue !== false;

  return (Array.isArray(items) ? items : []).map((item) => {
    const groupKey = resolveCategoryGroupKey(item);
    if (groupKey !== targetGroupKey) {
      return item;
    }

    return {
      ...item,
      checked: nextChecked,
    };
  });
}

function extractColorFromItemStyle(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const lineColor = normalizeColorValue(item?.style?.line?.[0]?.draw?.color);
  if (lineColor) {
    return lineColor;
  }

  const fillColor = normalizeColorValue(item?.style?.fill?.[0]?.draw?.color);
  if (fillColor) {
    return fillColor;
  }

  const symbolColor = normalizeColorValue(item?.style?.symbol?.[0]?.draw?.icon_color);
  if (symbolColor) {
    return symbolColor;
  }

  return null;
}

function resolveCategoryItemColor(item) {
  const customColor = normalizeColorValue(item?.color);
  if (customColor) {
    return customColor;
  }

  const styleColor = extractColorFromItemStyle(item);
  if (styleColor) {
    return styleColor;
  }

  return null;
}

export {
  createCategoryGroupSections,
  createSelectedCategoryItemsSignature,
  getSelectedCategoryItems,
  normalizeCategoryItems,
  reconcileExpandedGroupKeys,
  resolveCategoryGroupMetadataFromResponse,
  resolveCategoryItemColor,
  resolveItemsFromCategoryResponse,
  toggleCategoryGroupChecked,
  toggleCategoryItemChecked,
};
