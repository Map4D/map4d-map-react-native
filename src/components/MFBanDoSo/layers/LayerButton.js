import React from 'react';
import { Pressable, View } from 'react-native';

import { sharedStyles } from '../shared/styles';
import { layerStyles } from './styles';

/** Opens the layer drawer. Two offset squares, drawn as a stack of layers. */
function LayerButton({ show, isActive, onPress }) {
  return (
    <Pressable
      style={[
        sharedStyles.mapButton,
        isActive && sharedStyles.mapButtonActive,
        !show && sharedStyles.hiddenButton,
      ]}
      onPress={onPress}
      pointerEvents={show ? 'auto' : 'none'}
    >
      <View style={layerStyles.layerIconBoxPrimary} />
      <View style={layerStyles.layerIconBoxSecondary} />
    </Pressable>
  );
}

export { LayerButton };
