import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { DrawerShell } from '../shared/DrawerShell';
import { layerStyles } from './styles';

function GroupCheckbox({ isChecked, isIndeterminate, onPress }) {
  return (
    <Pressable style={layerStyles.selectorGroupCheckAction} onPress={onPress}>
      <View
        style={[
          layerStyles.groupCheckOuter,
          isChecked && layerStyles.groupCheckOuterChecked,
          isIndeterminate && layerStyles.groupCheckOuterIndeterminate,
        ]}
      >
        {isChecked ? (
          <Text style={layerStyles.groupCheckMark}>✓</Text>
        ) : isIndeterminate ? (
          <View style={layerStyles.groupCheckIndeterminateMark} />
        ) : null}
      </View>
    </Pressable>
  );
}

function SelectorRow({ title, checked, onPress }) {
  return (
    <Pressable style={layerStyles.selectorRow} onPress={onPress}>
      <View
        style={[
          layerStyles.checkboxOuter,
          checked && layerStyles.checkboxOuterChecked,
        ]}
      >
        {checked ? <Text style={layerStyles.checkboxMark}>✓</Text> : null}
      </View>
      <Text style={layerStyles.selectorLabel}>{title}</Text>
    </Pressable>
  );
}

function SelectorGroup({
  group,
  isExpanded,
  onToggleGroup,
  onToggleGroupChecked,
  onToggleItem,
}) {
  const groupKey = group?.key || '__group__';
  const groupTitle = group?.title || 'Khac';
  const groupItems = Array.isArray(group?.items) ? group.items : [];
  // A group's own checkbox reflects its items: all on, all off, or the middle
  // state that says only some of them are.
  const checkedCount = groupItems.reduce(
    (acc, wrapped) => acc + (wrapped?.item?.checked !== false ? 1 : 0),
    0
  );
  const isGroupChecked =
    groupItems.length > 0 && checkedCount === groupItems.length;
  const isGroupIndeterminate =
    checkedCount > 0 && checkedCount < groupItems.length;

  return (
    <View style={layerStyles.selectorGroupSection}>
      <View style={layerStyles.selectorGroupHeader}>
        <GroupCheckbox
          isChecked={isGroupChecked}
          isIndeterminate={isGroupIndeterminate}
          onPress={() => onToggleGroupChecked(groupKey, !isGroupChecked)}
        />
        <Pressable
          style={layerStyles.selectorGroupToggleAction}
          onPress={() => onToggleGroup(groupKey)}
        >
          <View
            style={[
              layerStyles.selectorGroupChevronTriangle,
              isExpanded
                ? layerStyles.selectorGroupChevronExpanded
                : layerStyles.selectorGroupChevronCollapsed,
            ]}
          />
          <Text style={layerStyles.selectorGroupTitle} numberOfLines={1}>
            {groupTitle}
          </Text>
        </Pressable>
      </View>

      {isExpanded ? (
        <View style={layerStyles.selectorGroupBody}>
          {groupItems.map(({ item, index }) => {
            const itemKey = item?.key ?? `index-${index}`;

            return (
              <SelectorRow
                key={`${itemKey}-${index}`}
                title={item?.title || item?.key || `Item ${index + 1}`}
                checked={item?.checked !== false}
                onPress={() => onToggleItem(itemKey, index)}
              />
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

/**
 * Picks which category layers the map draws. Mirrors the config's own shape:
 * groups of items, each item a layer that can be turned on or off, and a group
 * header that switches all of its items at once.
 */
function SelectorDrawer({
  show,
  title,
  groupSections,
  expandedGroupKeys,
  dragAnim,
  backdropAnimatedStyle,
  panelAnimatedStyle,
  onClose,
  onDragCancel,
  onToggleGroup,
  onToggleGroupChecked,
  onToggleItem,
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
      <View style={layerStyles.selectorGrid}>
        {groupSections.map((group) => (
          <SelectorGroup
            key={group?.key || '__group__'}
            group={group}
            isExpanded={expandedGroupKeys[group?.key || '__group__'] !== false}
            onToggleGroup={onToggleGroup}
            onToggleGroupChecked={onToggleGroupChecked}
            onToggleItem={onToggleItem}
          />
        ))}
      </View>
    </DrawerShell>
  );
}

export { SelectorDrawer };
