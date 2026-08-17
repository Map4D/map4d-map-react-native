import { StyleSheet } from 'react-native';

const controlStyles = StyleSheet.create({
  // Third in the top-right stack, under the layer and legend buttons.
  compassButton: {
    top: 170,
  },
  // A needle, red half pointing north and grey half pointing south. The whole
  // box is turned by the map's bearing so the red half keeps facing north.
  compassNeedle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassNorth: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#dc2626',
  },
  compassSouth: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#9ca3af',
  },
});

export { controlStyles };
