import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  SELECTOR_DRAWER_TRANSLATE_X,
  SELECTOR_SWIPE_ACTIVATION_DISTANCE,
  SELECTOR_SWIPE_CLOSE_DISTANCE,
  SELECTOR_SWIPE_CLOSE_VELOCITY,
} from './constants';
import { styles } from './styles';

function LayerButton({ show, isActive, onPress }) {
  return (
    <Pressable
      style={[
        styles.layerButton,
        isActive && styles.layerButtonActive,
        !show && styles.hiddenButton,
      ]}
      onPress={onPress}
      pointerEvents={show ? 'auto' : 'none'}
    >
      <View style={styles.layerIconBoxPrimary} />
      <View style={styles.layerIconBoxSecondary} />
    </Pressable>
  );
}

function LegendButton({ show, isActive, onPress }) {
  return (
    <Pressable
      style={[
        styles.layerButton,
        styles.legendButton,
        isActive && styles.layerButtonActive,
        !show && styles.hiddenButton,
      ]}
      onPress={onPress}
      pointerEvents={show ? 'auto' : 'none'}
    >
      <View style={styles.legendToggleIconRow}>
        <View style={styles.legendToggleIconDot} />
        <View style={styles.legendToggleIconLine} />
      </View>
      <View style={styles.legendToggleIconRow}>
        <View style={styles.legendToggleIconDot} />
        <View style={styles.legendToggleIconLine} />
      </View>
    </Pressable>
  );
}

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
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > SELECTOR_SWIPE_ACTIVATION_DISTANCE &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderMove: (evt, gestureState) => {
        const clampedDx = Math.min(0, gestureState.dx);
        const nextValue = 1 + clampedDx / Math.abs(SELECTOR_DRAWER_TRANSLATE_X);
        dragAnim.setValue(Math.max(0, Math.min(1, nextValue)));
      },
      onPanResponderRelease: (evt, gestureState) => {
        const shouldClose =
          gestureState.dx < -SELECTOR_SWIPE_CLOSE_DISTANCE ||
          gestureState.vx < -SELECTOR_SWIPE_CLOSE_VELOCITY;

        if (shouldClose) {
          onClose();
        } else {
          onDragCancel();
        }
      },
      onPanResponderTerminate: () => {
        onDragCancel();
      },
    })
  ).current;

  if (!show) {
    return null;
  }

  return (
    <View style={styles.selectorContainer}>
      <Animated.View style={[styles.selectorBackdrop, backdropAnimatedStyle]}>
        <Pressable
          style={styles.selectorBackdropPressable}
          onPress={onClose}
        />
      </Animated.View>
      <Animated.View
        style={[styles.selectorPanel, panelAnimatedStyle]}
        {...panResponder.panHandlers}
      >
        <View style={styles.selectorHeader}>
          <Text style={styles.selectorTitle}>{title}</Text>
        </View>
        <ScrollView style={styles.selectorList} showsVerticalScrollIndicator={false}>
          <View style={styles.selectorGrid}>
            {groupSections.map((group) => {
              const groupKey = group?.key || '__group__';
              const groupTitle = group?.title || 'Khac';
              const groupItems = Array.isArray(group?.items) ? group.items : [];
              const isExpanded = expandedGroupKeys[groupKey] !== false;
              const checkedCount = groupItems.reduce(
                (acc, wrapped) => acc + (wrapped?.item?.checked !== false ? 1 : 0),
                0
              );
              const isGroupChecked = groupItems.length > 0 && checkedCount === groupItems.length;
              const isGroupIndeterminate =
                checkedCount > 0 && checkedCount < groupItems.length;

              return (
                <View key={groupKey} style={styles.selectorGroupSection}>
                  <View style={styles.selectorGroupHeader}>
                    <Pressable
                      style={styles.selectorGroupCheckAction}
                      onPress={() => onToggleGroupChecked(groupKey, !isGroupChecked)}
                    >
                      <View
                        style={[
                          styles.groupCheckOuter,
                          isGroupChecked && styles.groupCheckOuterChecked,
                          isGroupIndeterminate && styles.groupCheckOuterIndeterminate,
                        ]}
                      >
                        {isGroupChecked ? (
                          <Text style={styles.groupCheckMark}>✓</Text>
                        ) : isGroupIndeterminate ? (
                          <View style={styles.groupCheckIndeterminateMark} />
                        ) : null}
                      </View>
                    </Pressable>
                    <Pressable
                      style={styles.selectorGroupToggleAction}
                      onPress={() => onToggleGroup(groupKey)}
                    >
                      <View
                        style={[
                          styles.selectorGroupChevronTriangle,
                          isExpanded
                            ? styles.selectorGroupChevronExpanded
                            : styles.selectorGroupChevronCollapsed,
                        ]}
                      />
                      <Text style={styles.selectorGroupTitle} numberOfLines={1}>
                        {groupTitle}
                      </Text>
                    </Pressable>
                  </View>

                  {isExpanded ? (
                    <View style={styles.selectorGroupBody}>
                      {groupItems.map(({ item, index }) => {
                        const itemKey = item?.key ?? `index-${index}`;
                        const checked = item?.checked !== false;
                        const itemTitle = item?.title || item?.key || `Item ${index + 1}`;

                        return (
                          <Pressable
                            key={`${itemKey}-${index}`}
                            style={styles.selectorRow}
                            onPress={() => onToggleItem(itemKey, index)}
                          >
                            <View
                              style={[
                                styles.checkboxOuter,
                                checked && styles.checkboxOuterChecked,
                              ]}
                            >
                              {checked ? (
                                <Text style={styles.checkboxMark}>✓</Text>
                              ) : null}
                            </View>
                            <Text style={styles.selectorLabel}>
                              {itemTitle}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function LegendPanel({ show, title, items, getItemColor }) {
  if (!show) {
    return null;
  }

  return (
    <View style={styles.legendContainer} pointerEvents="box-none">
      <View style={styles.legendPanel}>
        <Text style={styles.legendTitle}>{title}</Text>
        <View style={styles.legendDivider} />
        <ScrollView style={styles.legendList} showsVerticalScrollIndicator={true}>
          <View style={styles.legendListInner}>
            {items.map((item, index) => {
              const checked = item?.checked !== false;
              const itemTitle =
                item?.title || item?.label || item?.name || item?.key || '';
              const dotColor = getItemColor(item, index);
              const hasDotColor =
                typeof dotColor === 'string' && dotColor.trim().length > 0;

              return (
                <View
                  key={`${item?.key ?? `index-${index}`}-${index}`}
                  style={styles.legendRow}
                >
                  <View
                    style={[
                      styles.legendDot,
                      hasDotColor
                        ? { backgroundColor: dotColor, borderColor: dotColor }
                        : null,
                      !checked && !hasDotColor ? styles.legendDotUnchecked : null,
                    ]}
                  />
                  <Text style={styles.legendLabel} numberOfLines={1}>
                    {itemTitle}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export { LayerButton, LegendButton, LegendPanel, SelectorDrawer };
