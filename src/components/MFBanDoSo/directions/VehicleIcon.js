import React from 'react';
import { Image } from 'react-native';

import { DIRECTIONS_MODE_CAR } from './constants';
import { directionsStyles } from './styles';
import { VEHICLE_ICONS } from './vehicleIcons';

/**
 * The picture for one travel mode. The bitmaps are shape-only, so the colour
 * comes from the tint: one image serves both the selected and the unselected
 * chip rather than the folder carrying two copies of every vehicle.
 */
function VehicleIcon({ mode, color }) {
  const uri = VEHICLE_ICONS[mode] ?? VEHICLE_ICONS[DIRECTIONS_MODE_CAR];

  return (
    <Image
      source={{ uri }}
      style={[directionsStyles.vehicleIcon, { tintColor: color }]}
      resizeMode="contain"
    />
  );
}

export { VehicleIcon };
