import React from 'react';
import { Pressable, View } from 'react-native';

import { sharedStyles } from '../shared/styles';
import { ADVANCED_SLIDER_KNOB_OFFSETS } from './constants';
import { advancedSearchStyles } from './styles';

/**
 * Opens the advanced search. Sliders rather than a magnifier: it sits right
 * next to the search bar, which has a magnifier of its own, and what it opens
 * is a set of conditions to adjust. Upright rather than on their side, so the
 * three knobs never crowd each other at this size.
 */
function AdvancedSearchButton({ isActive, onPress }) {
  return (
    <Pressable
      style={[
        sharedStyles.mapButton,
        advancedSearchStyles.button,
        isActive && sharedStyles.mapButtonActive,
      ]}
      onPress={onPress}
    >
      <View style={advancedSearchStyles.sliders}>
        {ADVANCED_SLIDER_KNOB_OFFSETS.map((offset, index) => (
          <View key={index} style={advancedSearchStyles.sliderTrack}>
            <View style={advancedSearchStyles.sliderLine} />
            <View style={[advancedSearchStyles.sliderKnob, { top: offset }]} />
          </View>
        ))}
      </View>
    </Pressable>
  );
}

export { AdvancedSearchButton };
