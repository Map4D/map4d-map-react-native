import {
  SPRITE_ICONS_COLUMNS,
  SPRITE_ICONS_GLYPH_CENTER_Y,
  SPRITE_ICONS_GLYPH_SIZE,
  SPRITE_ICONS_HEIGHT,
  SPRITE_ICONS_ROWS,
  SPRITE_ICONS_WIDTH,
} from './constants';

function normalizeText(value) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null;
}

/**
 * What a marker takes from the sprite sheet. A marker is always the sheet's pin
 * in the rule's colour; `glyphBox` is the crop, in sprite pixels, of the drawing
 * laid over its head, and is null when the rule names no cell, which leaves the
 * bare pin.
 *
 * The glyphs sit in a fixed box above their cell's middle rather than filling
 * it, and cropping to that box is what stops them rendering half the size they
 * should.
 */
function resolveSpriteIcon(poi) {
  const index = poi?.iconIndex;
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
 * One legend row per config of a category item, which is the level the legend
 * is drawn at: an item like "Khu Cong Nghiep" is painted by five configs, each
 * with its own name, fill colour and marker, and the legend lists all five.
 *
 * A config paints a fill, a marker or both: the connectivity layers carry
 * markers but no fill, and a marker is either an image of its own or a cell of
 * the shared sprite sheet, never both.
 */
function createLegendRows(item) {
  const configs = Array.isArray(item?.configs) ? item.configs : [];
  const rows = [];

  configs.forEach((config, index) => {
    const name = normalizeText(config?.name);
    if (name == null) {
      return;
    }

    const poi = config?.poiEnabled === false ? null : config?.poi;
    const iconUri = normalizeText(poi?.tepTinUrl);

    rows.push({
      key: `${config?.id ?? index}-${name}`,
      name,
      color: normalizeText(config?.fill?.color),
      iconUri,
      sprite: poi && !iconUri ? resolveSpriteIcon(poi) : null,
      iconColor: normalizeText(poi?.iconColor),
    });
  });

  return rows;
}

export { createLegendRows };
