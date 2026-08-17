import React from 'react';
import { Image, View } from 'react-native';

import {
  LEGEND_PIN_GLYPH_SIZE,
  LEGEND_PIN_HEIGHT,
  SPRITE_ICONS_HEIGHT,
  SPRITE_ICONS_URL,
  SPRITE_ICONS_WIDTH,
} from './constants';
import {
  SPRITE_ICONS_PIN_DATA_URI,
  SPRITE_ICONS_PIN_HEAD_CENTER_X,
  SPRITE_ICONS_PIN_HEAD_CENTER_Y,
  SPRITE_ICONS_PIN_HEIGHT,
  SPRITE_ICONS_PIN_WIDTH,
} from './spritePin';
import { legendStyles } from './styles';

/**
 * A marker as the map draws it: the sprite sheet's pin in the rule's colour,
 * with the rule's glyph laid white over the pin's head.
 *
 * The glyph is one cell of the sheet, and React Native has no way to crop an
 * image, so the whole sheet is scaled up and slid under a window the size of
 * that cell.
 */
function LegendSpritePin({ glyphBox, color }) {
  const pinScale = LEGEND_PIN_HEIGHT / SPRITE_ICONS_PIN_HEIGHT;
  const pinWidth = SPRITE_ICONS_PIN_WIDTH * pinScale;
  // The glyph is sized against the pin, not against itself, so every row's
  // glyph sits in the head the same way however wide its own drawing is.
  const glyphSize = LEGEND_PIN_GLYPH_SIZE * pinScale;
  const glyphScale = glyphBox ? glyphSize / glyphBox.height : 0;

  return (
    <View style={legendStyles.legendIconBox}>
      <View style={{ width: pinWidth, height: LEGEND_PIN_HEIGHT }}>
        <Image
          style={[legendStyles.legendPin, { tintColor: color ?? undefined }]}
          source={{ uri: SPRITE_ICONS_PIN_DATA_URI }}
          resizeMode="stretch"
        />
        {glyphBox ? (
          <View
            style={[
              legendStyles.legendSpriteWindow,
              {
                width: glyphSize,
                height: glyphSize,
                left: SPRITE_ICONS_PIN_HEAD_CENTER_X * pinScale - glyphSize / 2,
                top: SPRITE_ICONS_PIN_HEAD_CENTER_Y * pinScale - glyphSize / 2,
              },
            ]}
          >
            <Image
              style={[
                legendStyles.legendSpriteSheet,
                {
                  width: SPRITE_ICONS_WIDTH * glyphScale,
                  height: SPRITE_ICONS_HEIGHT * glyphScale,
                  left: -glyphBox.left * glyphScale,
                  top: -glyphBox.top * glyphScale,
                },
              ]}
              source={{ uri: SPRITE_ICONS_URL }}
              resizeMode="stretch"
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

function LegendRowIcon({ uri, sprite, color }) {
  if (uri) {
    return (
      <View style={legendStyles.legendIconBox}>
        <Image
          style={legendStyles.legendIconImage}
          source={{ uri }}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (sprite) {
    return <LegendSpritePin glyphBox={sprite.glyphBox} color={color} />;
  }

  return null;
}

export { LegendRowIcon };
