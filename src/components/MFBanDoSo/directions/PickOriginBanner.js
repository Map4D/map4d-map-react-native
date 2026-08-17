import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { sharedStyles } from '../shared/styles';
import { DIRECTIONS_PICK_ORIGIN_CANCEL } from './constants';
import { directionsStyles } from './styles';

/**
 * Takes the search bar's slot while an endpoint is being picked off the map,
 * so the top of the map says what the next tap will do.
 */
function PickOriginBanner({ show, text, onCancel }) {
  if (!show) {
    return null;
  }

  return (
    <View style={sharedStyles.topSlot} pointerEvents="box-none">
      <View style={directionsStyles.pickOriginBanner}>
        <Text style={directionsStyles.pickOriginText}>{text}</Text>
        <Pressable style={directionsStyles.pickOriginCancel} onPress={onCancel}>
          <Text style={directionsStyles.pickOriginCancelText}>
            {DIRECTIONS_PICK_ORIGIN_CANCEL}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export { PickOriginBanner };
