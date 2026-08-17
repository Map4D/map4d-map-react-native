import React from 'react';
import { Text, View } from 'react-native';

import { DrawerShell } from '../shared/DrawerShell';
import { createLegendRows } from './legendRows';
import { LegendRowIcon } from './LegendRowIcon';
import { legendStyles } from './styles';

function LegendItem({ item }) {
  const rows = createLegendRows(item);
  if (rows.length === 0) {
    return null;
  }

  return (
    <View style={legendStyles.legendItem}>
      <Text style={legendStyles.legendItemTitle}>{item?.title}</Text>
      {rows.map((row) => (
        <View key={row.key} style={legendStyles.legendRow}>
          {row.color ? (
            <View
              style={[
                legendStyles.legendSwatch,
                { backgroundColor: row.color },
              ]}
            />
          ) : null}
          <LegendRowIcon
            uri={row.iconUri}
            sprite={row.sprite}
            color={row.iconColor}
          />
          <Text style={legendStyles.legendLabel}>{row.name}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Mirrors how the map is styled: a group holds category items, and each item
 * paints several named rules. The legend lists one row per rule, since that is
 * what a reader sees on the map, not the item it happens to belong to.
 */
function LegendDrawer({
  show,
  title,
  groupSections,
  dragAnim,
  backdropAnimatedStyle,
  panelAnimatedStyle,
  onClose,
  onDragCancel,
}) {
  return (
    <DrawerShell
      show={show}
      title={title}
      dragAnim={dragAnim}
      backdropAnimatedStyle={backdropAnimatedStyle}
      panelAnimatedStyle={panelAnimatedStyle}
      onClose={onClose}
      onDragCancel={onDragCancel}
    >
      <View style={legendStyles.legendList}>
        {groupSections.map((group) => (
          <View key={group.key} style={legendStyles.legendGroup}>
            <Text style={legendStyles.legendGroupTitle}>{group.title}</Text>
            {group.items.map(({ item, index }) => (
              <LegendItem key={`${item?.key ?? index}`} item={item} />
            ))}
          </View>
        ))}
      </View>
    </DrawerShell>
  );
}

export { LegendDrawer };
