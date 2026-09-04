import React from 'react';
import { Pressable, View } from 'react-native';

import { DIRECTIONS_SWAP_LABEL } from './constants';
import { directionsStyles } from './styles';

/**
 * Turns the route around. Drawn from bars the same way the maneuver arrows are
 * — two stems side by side, one headed up and one headed down.
 *
 * Disabled until both ends are known: with only one of them there is nothing to
 * trade places with, and swapping would just move the single point across.
 */
function SwapEndpointsButton({ disabled, onPress }) {
  return (
    <Pressable
      style={[
        directionsStyles.directionsSwapButton,
        disabled && directionsStyles.directionsSwapButtonDisabled,
      ]}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={DIRECTIONS_SWAP_LABEL}
      onPress={onPress}
    >
      <View style={directionsStyles.directionsSwapIcon}>
        <View style={directionsStyles.swapUpStem} />
        <View style={directionsStyles.swapUpHead} />
        <View style={directionsStyles.swapDownStem} />
        <View style={directionsStyles.swapDownHead} />
      </View>
    </Pressable>
  );
}

export { SwapEndpointsButton };
