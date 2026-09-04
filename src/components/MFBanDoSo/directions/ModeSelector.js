import React from 'react';
import { Pressable, View } from 'react-native';

import { DIRECTIONS_MODES } from './constants';
import { directionsStyles } from './styles';
import { VehicleIcon } from './VehicleIcon';

// The tints the drawn vehicles take, matching the rest of the panel: blue for
// what is selected, the same grey the secondary text uses for the rest.
const MODE_ICON_COLOR = '#6b7280';
const MODE_ICON_ACTIVE_COLOR = '#1d4ed8';

/**
 * The travel modes the route can be asked for, as one segmented row of drawn
 * vehicles. The mode names survive as the accessibility labels, which is where
 * they are still needed once the chips carry pictures instead of words.
 */
function ModeSelector({ mode, onChangeMode }) {
  return (
    <View style={directionsStyles.directionsModes}>
      {DIRECTIONS_MODES.map((item) => {
        const isActive = item.key === mode;

        return (
          <Pressable
            key={item.key}
            style={[
              directionsStyles.directionsModeChip,
              isActive && directionsStyles.directionsModeChipActive,
            ]}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onChangeMode(item.key)}
          >
            <VehicleIcon
              mode={item.key}
              color={isActive ? MODE_ICON_ACTIVE_COLOR : MODE_ICON_COLOR}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export { ModeSelector };
