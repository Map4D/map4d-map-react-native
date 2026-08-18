import React from 'react';
import { Pressable, View } from 'react-native';

import { sharedStyles } from '../shared/styles';
import { legendStyles } from './styles';

/** Opens the legend. Two dot-and-line rows, drawn as a key. */
function LegendButton({ show, isActive, onPress }) {
  return (
    <Pressable
      style={[
        sharedStyles.mapButton,
        sharedStyles.mapButtonTopRight,
        legendStyles.legendButton,
        isActive && sharedStyles.mapButtonActive,
        !show && sharedStyles.hiddenButton,
      ]}
      onPress={onPress}
      pointerEvents={show ? 'auto' : 'none'}
    >
      <View style={legendStyles.legendToggleIconRow}>
        <View style={legendStyles.legendToggleIconDot} />
        <View style={legendStyles.legendToggleIconLine} />
      </View>
      <View style={legendStyles.legendToggleIconRow}>
        <View style={legendStyles.legendToggleIconDot} />
        <View style={legendStyles.legendToggleIconLine} />
      </View>
    </Pressable>
  );
}

export { LegendButton };
