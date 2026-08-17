const LEGEND_TITLE = 'Chú giải';

// The sheet the map styles name as `icon_image: 'pois'`. It is a 15x4 grid of
// white glyphs on transparency, so a rule's `icon_index` picks a cell and the
// glyph takes the rule's colour through `tintColor`.
const SPRITE_ICONS_URL =
  'https://cmcdtqg-test.dieuhanhso.vn/ban-do-so/spriteIcons.png';
const SPRITE_ICONS_NAME = 'pois';
const SPRITE_ICONS_WIDTH = 1198;
const SPRITE_ICONS_HEIGHT = 390;
const SPRITE_ICONS_COLUMNS = 15;
const SPRITE_ICONS_ROWS = 4;
// Cell 0 is a map pin drawn edge to edge; every other cell holds its glyph in a
// 50x50 box sitting above the cell's middle, so cropping to that box keeps the
// glyphs from shrinking into the empty half below them.
const SPRITE_ICONS_GLYPH_SIZE = 50;
const SPRITE_ICONS_GLYPH_CENTER_Y = 37.5;

// Height of a legend marker in dp, and the side of the square its glyph is
// drawn into, in the pin's own pixels.
const LEGEND_PIN_HEIGHT = 24;
const LEGEND_PIN_GLYPH_SIZE = 44;

export {
  LEGEND_TITLE,
  LEGEND_PIN_GLYPH_SIZE,
  LEGEND_PIN_HEIGHT,
  SPRITE_ICONS_COLUMNS,
  SPRITE_ICONS_GLYPH_CENTER_Y,
  SPRITE_ICONS_GLYPH_SIZE,
  SPRITE_ICONS_HEIGHT,
  SPRITE_ICONS_NAME,
  SPRITE_ICONS_ROWS,
  SPRITE_ICONS_URL,
  SPRITE_ICONS_WIDTH,
};
