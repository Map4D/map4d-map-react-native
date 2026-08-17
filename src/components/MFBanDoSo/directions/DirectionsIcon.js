import React from 'react';
import { View } from 'react-native';

import { directionsStyles } from './styles';

/**
 * The directions glyph on the sheet's action bar: a tilted square with an
 * arrow across it, the shape map apps use for "route to here".
 */
function DirectionsIcon() {
  return (
    <View style={directionsStyles.directionsIcon}>
      <View style={directionsStyles.directionsIconDiamond} />
      <View style={directionsStyles.directionsIconArrow} />
    </View>
  );
}

export { DirectionsIcon };
