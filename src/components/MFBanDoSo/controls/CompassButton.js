import React from 'react';
import { Pressable, View } from 'react-native';

import { sharedStyles } from '../shared/styles';
import { controlStyles } from './styles';

/**
 * Points at north and turns the map back to it. The needle is turned against
 * the map's bearing, so it keeps facing north however the map is rotated.
 */
function CompassButton({ bearing, onPress }) {
  return (
    <Pressable
      style={[sharedStyles.mapButton, controlStyles.compassButton]}
      onPress={onPress}
    >
      <View
        style={[
          controlStyles.compassNeedle,
          { transform: [{ rotate: `${-bearing}deg` }] },
        ]}
      >
        <View style={controlStyles.compassNorth} />
        <View style={controlStyles.compassSouth} />
      </View>
    </Pressable>
  );
}

export { CompassButton };
