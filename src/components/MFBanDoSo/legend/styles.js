import { StyleSheet } from 'react-native';

const legendStyles = StyleSheet.create({
  legendButton: {
    top: 120,
  },
  legendToggleIconRow: {
    width: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  legendToggleIconDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4b5563',
    marginRight: 3,
  },
  legendToggleIconLine: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#6b7280',
  },
  legendList: {
    paddingBottom: 12,
  },
  legendGroup: {
    marginBottom: 14,
  },
  legendGroupTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b91c1c',
    marginBottom: 8,
  },
  legendItem: {
    marginBottom: 10,
  },
  legendItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
    marginBottom: 4,
    paddingRight: 6,
  },
  // The painted colour of the area, shown only for rules that fill one. The
  // connectivity layers draw pins alone, and their rows leave this out.
  legendSwatch: {
    width: 20,
    height: 13,
    borderRadius: 3,
    marginRight: 8,
  },
  legendIconBox: {
    width: 20,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  legendIconImage: {
    width: 18,
    height: 18,
  },
  legendPin: {
    width: '100%',
    height: '100%',
  },
  // Shows one cell of the sprite sheet over the pin's head: the window is the
  // cell, the sheet behind it is offset so that cell lands inside. Sizes and
  // offsets depend on which cell is drawn, so they are set inline.
  legendSpriteWindow: {
    position: 'absolute',
    overflow: 'hidden',
  },
  legendSpriteSheet: {
    position: 'absolute',
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    fontWeight: '500',
  },
});

export { legendStyles };
