import { createCategoryItemsSignature } from '../internal/GeojsonStyleUtils';
import {
  SPRITE_ICONS_COLUMNS,
  SPRITE_ICONS_GLYPH_CENTER_Y,
  SPRITE_ICONS_GLYPH_SIZE,
  SPRITE_ICONS_HEIGHT,
  SPRITE_ICONS_NAME,
  SPRITE_ICONS_ROWS,
  SPRITE_ICONS_WIDTH,
} from './constants';

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

function firstStyleName(entries, index) {
  const entry = Array.isArray(entries) ? entries[index] : null;
  const name = entry?.name;
  return typeof name === 'string' && name.trim().length > 0
    ? name.trim()
    : null;
}

/**
 * What a symbol rule takes from the sprite sheet, or null when it does not use
 * the sheet at all. A marker is always the sheet's pin in the rule's colour;
 * `glyphBox` is the crop, in sprite pixels, of the drawing laid over its head,
 * and is null for cell 0, which is the bare pin.
 *
 * The glyphs sit in a fixed box above their cell's middle rather than filling
 * it, and cropping to that box is what stops them rendering half the size they
 * should.
 */
function resolveSpriteIcon(symbolDraw) {
  if (normalizeColorValue(symbolDraw?.icon_image) !== SPRITE_ICONS_NAME) {
    return null;
  }

  const index = symbolDraw?.icon_index;
  const cells = SPRITE_ICONS_COLUMNS * SPRITE_ICONS_ROWS;
  if (!Number.isInteger(index) || index <= 0 || index >= cells) {
    return { glyphBox: null };
  }

  const cellWidth = SPRITE_ICONS_WIDTH / SPRITE_ICONS_COLUMNS;
  const cellHeight = SPRITE_ICONS_HEIGHT / SPRITE_ICONS_ROWS;
  const size = SPRITE_ICONS_GLYPH_SIZE;

  return {
    glyphBox: {
      left: (index % SPRITE_ICONS_COLUMNS) * cellWidth + (cellWidth - size) / 2,
      top:
        Math.floor(index / SPRITE_ICONS_COLUMNS) * cellHeight +
        SPRITE_ICONS_GLYPH_CENTER_Y -
        size / 2,
      width: size,
      height: size,
    },
  };
}

/**
 * One legend row per style rule of a category item, which is the level the
 * legend is drawn at: an item like "Khu Cong Nghiep" paints five different
 * fills, each with its own name, colour and pin, and the legend lists all five.
 *
 * The fill, line and symbol arrays describe the same rules in the same order,
 * so they are paired by index. A rule may appear in only some of them: the
 * connectivity layers carry symbols but no fill.
 */
function createLegendRows(item) {
  const fills = Array.isArray(item?.style?.fill) ? item.style.fill : [];
  const lines = Array.isArray(item?.style?.line) ? item.style.line : [];
  const symbols = Array.isArray(item?.style?.symbol) ? item.style.symbol : [];
  const count = Math.max(fills.length, lines.length, symbols.length);
  const rows = [];

  for (let index = 0; index < count; index += 1) {
    const name =
      firstStyleName(symbols, index) ||
      firstStyleName(fills, index) ||
      firstStyleName(lines, index);

    if (name == null) {
      continue;
    }

    const symbolDraw = symbols[index]?.draw;
    // A rule either points at an image of its own or at a cell of the shared
    // sprite sheet, never both.
    const iconUri =
      symbolDraw?.use_direct_icon_url === true
        ? normalizeColorValue(symbolDraw?.icon_image)
        : null;

    rows.push({
      key: `${index}-${name}`,
      name,
      color:
        normalizeColorValue(fills[index]?.draw?.color) ??
        normalizeColorValue(lines[index]?.draw?.color),
      iconUri,
      sprite: iconUri ? null : resolveSpriteIcon(symbolDraw),
      iconColor: normalizeColorValue(symbolDraw?.icon_color),
    });
  }

  return rows;
}

export {
  createCategoryGroupSections,
  createLegendRows,
  createSelectedCategoryItemsSignature,
  getSelectedCategoryItems,
  normalizeCategoryItems,
  reconcileExpandedGroupKeys,
  resolveCategoryGroupMetadataFromResponse,
  resolveItemsFromCategoryResponse,
  toggleCategoryGroupChecked,
  toggleCategoryItemChecked,
};
