/**
 * The map pin the sprite sheet keeps in its first cell, cropped to its ink and
 * carried here as an image with a real alpha channel.
 *
 * The sheet stores that cell differently from every other one: the glyphs are
 * white on transparency, but the pin is a greyscale mask painted on an opaque
 * black square. Tinting it as it ships would paint the square, not the pin, and
 * React Native cannot key a colour out of an image, so the mask's luminance was
 * turned into alpha once and the result inlined. Regenerate it from
 * `SPRITE_ICONS_URL` cell 0 if the sheet's pin ever changes.
 *
 * Natural size 64x88. The head is a circle of radius 31 centred on (31.5, 32),
 * which is where a rule's glyph is drawn.
 */
const SPRITE_ICONS_PIN_DATA_URI =
  'data:image/png;base64,' +
  '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';

const SPRITE_ICONS_PIN_WIDTH = 64;
const SPRITE_ICONS_PIN_HEIGHT = 88;
const SPRITE_ICONS_PIN_HEAD_CENTER_X = 31.5;
const SPRITE_ICONS_PIN_HEAD_CENTER_Y = 32;

export {
  SPRITE_ICONS_PIN_DATA_URI,
  SPRITE_ICONS_PIN_WIDTH,
  SPRITE_ICONS_PIN_HEIGHT,
  SPRITE_ICONS_PIN_HEAD_CENTER_X,
  SPRITE_ICONS_PIN_HEAD_CENTER_Y,
};
