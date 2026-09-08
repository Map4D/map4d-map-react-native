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
  DRAWER_SWIPE_ACTIVATION_DISTANCE,
  DRAWER_SWIPE_CLOSE_DISTANCE,
  DRAWER_SWIPE_CLOSE_VELOCITY,
  DRAWER_TRANSLATE_X,
} from './constants';
import { sharedStyles } from './styles';

/**
 * The sliding panel both drawers are built from: backdrop, left-hand panel,
 * header and a scrolling body. Only the content differs between them, so the
 * swipe-to-close gesture lives here once instead of being copied per drawer.
 */
function DrawerShell({
  show,
  title,
  dragAnim,
  backdropAnimatedStyle,
  panelAnimatedStyle,
  onClose,
  onDragCancel,
  children,
}) {
  // The gesture is built once, so it reads the handlers through a ref rather
  // than capturing the first render's copies.
  const handlersRef = useRef(null);
  handlersRef.current = { onClose, onDragCancel };

  // useRef evaluates whatever it is handed on every render and then keeps
  // only the first result, so building the gesture inline there built a
  // whole PanResponder per render just to throw it away.
  const panResponderRef = useRef(null);
  if (panResponderRef.current == null) {
    panResponderRef.current = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > DRAWER_SWIPE_ACTIVATION_DISTANCE &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderMove: (evt, gestureState) => {
        const clampedDx = Math.min(0, gestureState.dx);
        const nextValue = 1 + clampedDx / Math.abs(DRAWER_TRANSLATE_X);
        dragAnim.setValue(Math.max(0, Math.min(1, nextValue)));
      },
      onPanResponderRelease: (evt, gestureState) => {
        const shouldClose =
          gestureState.dx < -DRAWER_SWIPE_CLOSE_DISTANCE ||
          gestureState.vx < -DRAWER_SWIPE_CLOSE_VELOCITY;

        if (shouldClose) {
          handlersRef.current.onClose();
        } else {
          handlersRef.current.onDragCancel();
        }
      },
      onPanResponderTerminate: () => {
        handlersRef.current.onDragCancel();
      },
    });
  }
  const panResponder = panResponderRef.current;

  if (!show) {
    return null;
  }

  return (
    <View style={sharedStyles.drawerContainer}>
      <Animated.View
        style={[sharedStyles.drawerBackdrop, backdropAnimatedStyle]}
      >
        <Pressable
          style={sharedStyles.drawerBackdropPressable}
          onPress={onClose}
        />
      </Animated.View>
      <Animated.View
        style={[sharedStyles.drawerPanel, panelAnimatedStyle]}
        {...panResponder.panHandlers}
      >
        <View style={sharedStyles.drawerHeader}>
          <Text style={sharedStyles.drawerTitle}>{title}</Text>
        </View>
        <ScrollView
          style={sharedStyles.drawerList}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

export { DrawerShell };
