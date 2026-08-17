import {
  SPRITE_ICONS_COLUMNS,
  SPRITE_ICONS_GLYPH_CENTER_Y,
  SPRITE_ICONS_GLYPH_SIZE,
  SPRITE_ICONS_HEIGHT,
  SPRITE_ICONS_NAME,
  SPRITE_ICONS_ROWS,
  SPRITE_ICONS_WIDTH,
} from './constants';

/**
 * A style value that may arrive either as a plain string or as a single-entry
 * array, which is how the config expresses a value that could have been a
 * data-driven expression but is not.
 */
function normalizeStyleValue(value) {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  if (
    Array.isArray(value) &&
    typeof value[0] === 'string' &&
    value[0].trim().length > 0
  ) {
    return value[0].trim();
  }

  return null;
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
  if (normalizeStyleValue(symbolDraw?.icon_image) !== SPRITE_ICONS_NAME) {
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
        ? normalizeStyleValue(symbolDraw?.icon_image)
        : null;

    rows.push({
      key: `${index}-${name}`,
      name,
      color:
        normalizeStyleValue(fills[index]?.draw?.color) ??
        normalizeStyleValue(lines[index]?.draw?.color),
      iconUri,
      sprite: iconUri ? null : resolveSpriteIcon(symbolDraw),
      iconColor: normalizeStyleValue(symbolDraw?.icon_color),
    });
  }

  return rows;
}

export { createLegendRows };
