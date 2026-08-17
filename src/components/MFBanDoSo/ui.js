import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  DIRECTIONS_ACTION_LABEL,
  DIRECTIONS_CHANGE_HINT,
  DIRECTIONS_DESTINATION_LABEL,
  DIRECTIONS_ENDPOINT_DESTINATION,
  DIRECTIONS_ENDPOINT_ORIGIN,
  DIRECTIONS_ORIGIN_LABEL,
  DIRECTIONS_PICK_DESTINATION_TEXT,
  DIRECTIONS_PICK_ORIGIN_CANCEL,
  DIRECTIONS_PICK_ORIGIN_TEXT,
  DIRECTIONS_STEPS_TITLE,
  SEARCH_EMPTY_TEXT,
  SEARCH_LOADING_TEXT,
  SEARCH_PLACEHOLDER,
  SELECTOR_DRAWER_TRANSLATE_X,
  SELECTOR_SWIPE_ACTIVATION_DISTANCE,
  SELECTOR_SWIPE_CLOSE_DISTANCE,
  SELECTOR_SWIPE_CLOSE_VELOCITY,
  SHEET_FOCUS_ACTION_LABEL,
  SHEET_FOOTER_FADE_RATIO,
  SHEET_HALF_SNAP_RATIO,
  SHEET_INDUSTRIAL_ZONES_TITLE,
  SHEET_STATS_TITLE,
  SHEET_SWIPE_ACTIVATION_DISTANCE,
  SHEET_SWIPE_FLICK_VELOCITY,
  SHEET_TOP_PEEK,
  SHEET_TRANSLATE_Y,
  SPRITE_ICONS_HEIGHT,
  SPRITE_ICONS_URL,
  SPRITE_ICONS_WIDTH,
  ZONE_ADDRESS_LABEL,
  ZONE_ADVANTAGES_TITLE,
  ZONE_ATTRACTED_PROJECTS_LABEL,
  ZONE_ATTRACTED_SECTORS_TITLE,
  ZONE_INTRO_TITLE,
  ZONE_INVESTMENT_PROJECTS_LABEL,
  ZONE_INVESTOR_TITLE,
  ZONE_LOCATION_TITLE,
  ZONE_MAIN_INFO_TITLE,
  ZONE_PROJECTS_COUNT_SUFFIX,
  ZONE_PROJECTS_SUBTITLE,
  ZONE_PROJECT_AREA_LABEL,
  ZONE_PROJECT_KIND_ATTRACTED,
  ZONE_PROJECT_KIND_INVESTMENT,
  ZONE_PROJECT_INVESTMENT_LABEL,
  ZONE_RESTRICTED_SECTORS_TITLE,
} from './constants';
import { createLegendRows } from './helpers';
import {
  SPRITE_ICONS_PIN_DATA_URI,
  SPRITE_ICONS_PIN_HEAD_CENTER_X,
  SPRITE_ICONS_PIN_HEAD_CENTER_Y,
  SPRITE_ICONS_PIN_HEIGHT,
  SPRITE_ICONS_PIN_WIDTH,
} from './spritePin';
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

const SEARCH_ZONE_KIND = 'kcnkkt';

// Height of a legend marker in dp, and the side of the square its glyph is
// drawn into, in the pin's own pixels.
const LEGEND_PIN_HEIGHT = 24;
const LEGEND_PIN_GLYPH_SIZE = 44;

function PickOriginBanner({ show, text, onCancel }) {
  if (!show) {
    return null;
  }

  return (
    <View style={styles.searchContainer} pointerEvents="box-none">
      <View style={styles.pickOriginBanner}>
        <Text style={styles.pickOriginText}>{text}</Text>
        <Pressable style={styles.pickOriginCancel} onPress={onCancel}>
          <Text style={styles.pickOriginCancelText}>
            {DIRECTIONS_PICK_ORIGIN_CANCEL}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// Which arrow each maneuver gets. Values seen in real payloads: straight,
// keep-left, keep-right, turn-left, turn-right, turn-sharp-left, finish; the
// rest are listed so a route through them still draws something sensible.
// Every left-hand turn reuses its right-hand shape mirrored.
const MANEUVER_ARROWS = {
  'straight': { shape: 'straight' },
  'depart': { shape: 'straight' },
  'start': { shape: 'straight' },
  'finish': { shape: 'finish' },
  'turn-right': { shape: 'turn' },
  'roundabout-right': { shape: 'turn' },
  'turn-left': { shape: 'turn', mirrored: true },
  'roundabout-left': { shape: 'turn', mirrored: true },
  'keep-right': { shape: 'slight' },
  'fork-right': { shape: 'slight' },
  'turn-slight-right': { shape: 'slight' },
  'merge': { shape: 'slight' },
  'keep-left': { shape: 'slight', mirrored: true },
  'fork-left': { shape: 'slight', mirrored: true },
  'turn-slight-left': { shape: 'slight', mirrored: true },
  'turn-sharp-right': { shape: 'sharp' },
  'turn-sharp-left': { shape: 'sharp', mirrored: true },
  'uturn-right': { shape: 'uturn' },
  'uturn-left': { shape: 'uturn', mirrored: true },
};

function DirectionsArrowShape({ shape }) {
  if (shape === 'turn') {
    return (
      <React.Fragment>
        <View style={styles.arrowTurnStem} />
        <View style={styles.arrowTurnArm} />
        <View style={styles.arrowTurnHead} />
      </React.Fragment>
    );
  }

  if (shape === 'slight') {
    return (
      <React.Fragment>
        <View style={styles.arrowSlightStem} />
        <View style={styles.arrowSlightArm} />
        <View style={styles.arrowSlightHead} />
      </React.Fragment>
    );
  }

  if (shape === 'sharp') {
    return (
      <React.Fragment>
        <View style={styles.arrowSharpStem} />
        <View style={styles.arrowSharpArm} />
        <View style={styles.arrowSharpHead} />
      </React.Fragment>
    );
  }

  if (shape === 'uturn') {
    return (
      <React.Fragment>
        <View style={styles.arrowTurnStem} />
        <View style={styles.arrowTurnArm} />
        <View style={styles.arrowUturnDrop} />
        <View style={styles.arrowUturnHead} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <View style={styles.arrowStraightStem} />
      <View style={styles.arrowStraightHead} />
    </React.Fragment>
  );
}

function DirectionsStepIcon({ maneuver }) {
  const arrow = MANEUVER_ARROWS[maneuver] || MANEUVER_ARROWS.straight;

  if (arrow.shape === 'finish') {
    return (
      <View style={styles.directionsStepIcon}>
        <View style={styles.directionsFinishMark} />
      </View>
    );
  }

  return (
    <View style={styles.directionsStepIcon}>
      <View
        style={[
          styles.directionsArrow,
          arrow.mirrored && styles.directionsArrowMirrored,
        ]}
      >
        <DirectionsArrowShape shape={arrow.shape} />
      </View>
    </View>
  );
}

function DirectionsEndpointRow({
  label,
  text,
  placeholder,
  markerStyle,
  isPicking,
  onPress,
}) {
  return (
    <Pressable
      style={[
        styles.directionsEndpointRow,
        isPicking && styles.directionsEndpointRowPicking,
      ]}
      onPress={onPress}
    >
      <View style={markerStyle} />
      <View style={styles.directionsEndpointBody}>
        <Text style={styles.directionsEndpointLabel}>{label}</Text>
        <Text
          style={[
            styles.directionsEndpointText,
            !text && styles.directionsEndpointPlaceholder,
          ]}
          numberOfLines={2}
        >
          {text || placeholder}
        </Text>
      </View>
      {/* Nothing to change yet when the row is still asking for a point. */}
      {text ? (
        <Text style={styles.directionsEndpointHint}>
          {DIRECTIONS_CHANGE_HINT}
        </Text>
      ) : null}
    </Pressable>
  );
}

function DirectionsBody({
  loading,
  statusText,
  route,
  originText,
  destinationText,
  pickingEndpoint,
  onPickEndpoint,
}) {
  const steps = route && Array.isArray(route.steps) ? route.steps : [];

  return (
    <React.Fragment>
      {/* Always drawn, even with no route yet: these rows are what a missing
          endpoint gets picked from. */}
      <View style={styles.directionsEndpoints}>
        <DirectionsEndpointRow
          label={DIRECTIONS_ORIGIN_LABEL}
          text={originText}
          placeholder={DIRECTIONS_PICK_ORIGIN_TEXT}
          markerStyle={styles.directionsEndpointDot}
          isPicking={pickingEndpoint === DIRECTIONS_ENDPOINT_ORIGIN}
          onPress={() => onPickEndpoint(DIRECTIONS_ENDPOINT_ORIGIN)}
        />
        <View style={styles.directionsEndpointLine} />
        <DirectionsEndpointRow
          label={DIRECTIONS_DESTINATION_LABEL}
          text={destinationText}
          placeholder={DIRECTIONS_PICK_DESTINATION_TEXT}
          markerStyle={styles.directionsEndpointSquare}
          isPicking={pickingEndpoint === DIRECTIONS_ENDPOINT_DESTINATION}
          onPress={() => onPickEndpoint(DIRECTIONS_ENDPOINT_DESTINATION)}
        />
      </View>

      {loading || !route ? (
        <View style={styles.sheetStatusBox}>
          {loading ? <ActivityIndicator color="#b91c1c" /> : null}
          <Text style={styles.sheetStatusText}>{statusText}</Text>
        </View>
      ) : null}

      {route ? (
        <View style={styles.directionsSummary}>
          <View style={styles.directionsSummaryRow}>
            {route.durationText ? (
              <Text style={styles.directionsDuration}>
                {route.durationText}
              </Text>
            ) : null}
            {route.distanceText ? (
              <Text style={styles.directionsDistance}>
                {route.distanceText}
              </Text>
            ) : null}
          </View>
          {route.summary ? (
            <Text style={styles.directionsSummaryVia} numberOfLines={1}>
              {`Qua ${route.summary}`}
            </Text>
          ) : null}
        </View>
      ) : null}

      {steps.length > 0 ? (
        <View style={styles.sheetSection}>
          <Text style={styles.sheetSectionTitle}>{DIRECTIONS_STEPS_TITLE}</Text>
        </View>
      ) : null}

      {steps.map((step) => (
        <View key={step.key} style={styles.directionsStepRow}>
          <DirectionsStepIcon maneuver={step.maneuver} />
          <View style={styles.directionsStepBody}>
            <Text style={styles.directionsStepInstruction}>
              {step.instruction}
            </Text>
            {step.distanceText ? (
              <Text style={styles.directionsStepMeta}>
                {step.streetName
                  ? `${step.distanceText} · ${step.streetName}`
                  : step.distanceText}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
    </React.Fragment>
  );
}

function SearchResultRow({ item, isFirst, onPress }) {
  const isZone = item.kind === SEARCH_ZONE_KIND;

  return (
    <Pressable
      style={[styles.searchRow, !isFirst && styles.searchRowDivider]}
      onPress={() => onPress(item)}
    >
      <View style={[styles.searchRowIcon, isZone && styles.searchRowIconZone]}>
        <View
          style={isZone ? styles.searchRowIconSquare : styles.searchRowIconDot}
        />
      </View>
      <View style={styles.searchRowBody}>
        <Text style={styles.searchRowTitle} numberOfLines={1}>
          {item.name}
        </Text>
        {item.typeLabel ? (
          <Text style={styles.searchRowSubtitle} numberOfLines={1}>
            {item.typeLabel}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function SearchBox({
  show,
  keyword,
  sections,
  loading,
  showResults,
  onChangeKeyword,
  onClear,
  onFocus,
  onSelectResult,
}) {
  if (!show) {
    return null;
  }

  const hasResults = sections.length > 0;

  return (
    <View style={styles.searchContainer} pointerEvents="box-none">
      <View style={styles.searchBar}>
        <View style={styles.searchIconBox}>
          <View style={styles.searchIconGlass} />
          <View style={styles.searchIconHandle} />
        </View>
        <TextInput
          style={styles.searchInput}
          value={keyword}
          placeholder={SEARCH_PLACEHOLDER}
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          autoCorrect={false}
          onChangeText={onChangeKeyword}
          onFocus={onFocus}
        />
        {keyword.length > 0 ? (
          <Pressable style={styles.searchClearButton} onPress={onClear}>
            <View style={styles.searchClearCircle}>
              <View
                style={[
                  styles.searchClearBar,
                  { transform: [{ rotate: '45deg' }] },
                ]}
              />
              <View
                style={[
                  styles.searchClearBar,
                  { transform: [{ rotate: '-45deg' }] },
                ]}
              />
            </View>
          </Pressable>
        ) : null}
      </View>

      {showResults ? (
        <View style={styles.searchResults}>
          {loading || !hasResults ? (
            <View style={styles.searchStatusRow}>
              {loading ? <ActivityIndicator color="#b91c1c" /> : null}
              <Text style={styles.searchStatusText}>
                {loading ? SEARCH_LOADING_TEXT : SEARCH_EMPTY_TEXT}
              </Text>
            </View>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled">
              {sections.map((group) => (
                <View key={group.key}>
                  {group.title ? (
                    <Text style={styles.searchGroupTitle}>{group.title}</Text>
                  ) : null}
                  {group.items.map((item, index) => (
                    <SearchResultRow
                      key={item.key}
                      item={item}
                      isFirst={index === 0}
                      onPress={onSelectResult}
                    />
                  ))}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      ) : null}
    </View>
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
  const handlersRef = useRef({ onClose, onDragCancel });
  handlersRef.current = { onClose, onDragCancel };

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
          handlersRef.current.onClose();
        } else {
          handlersRef.current.onDragCancel();
        }
      },
      onPanResponderTerminate: () => {
        handlersRef.current.onDragCancel();
      },
    })
  ).current;

  if (!show) {
    return null;
  }

  return (
    <View style={styles.selectorContainer}>
      <Animated.View style={[styles.selectorBackdrop, backdropAnimatedStyle]}>
        <Pressable style={styles.selectorBackdropPressable} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[styles.selectorPanel, panelAnimatedStyle]}
        {...panResponder.panHandlers}
      >
        <View style={styles.selectorHeader}>
          <Text style={styles.selectorTitle}>{title}</Text>
        </View>
        <ScrollView
          style={styles.selectorList}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
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
    </DrawerShell>
  );
}

/**
 * A marker as the map draws it: the sprite sheet's pin in the rule's colour,
 * with the rule's glyph laid white over the pin's head.
 *
 * The glyph is one cell of the sheet, and React Native has no way to crop an
 * image, so the whole sheet is scaled up and slid under a window the size of
 * that cell.
 */
function LegendSpritePin({ glyphBox, color }) {
  const pinScale = LEGEND_PIN_HEIGHT / SPRITE_ICONS_PIN_HEIGHT;
  const pinWidth = SPRITE_ICONS_PIN_WIDTH * pinScale;
  // The glyph is sized against the pin, not against itself, so every row's
  // glyph sits in the head the same way however wide its own drawing is.
  const glyphSize = LEGEND_PIN_GLYPH_SIZE * pinScale;
  const glyphScale = glyphBox ? glyphSize / glyphBox.height : 0;

  return (
    <View style={styles.legendIconBox}>
      <View style={{ width: pinWidth, height: LEGEND_PIN_HEIGHT }}>
        <Image
          style={[styles.legendPin, { tintColor: color ?? undefined }]}
          source={{ uri: SPRITE_ICONS_PIN_DATA_URI }}
          resizeMode="stretch"
        />
        {glyphBox ? (
          <View
            style={[
              styles.legendSpriteWindow,
              {
                width: glyphSize,
                height: glyphSize,
                left: SPRITE_ICONS_PIN_HEAD_CENTER_X * pinScale - glyphSize / 2,
                top: SPRITE_ICONS_PIN_HEAD_CENTER_Y * pinScale - glyphSize / 2,
              },
            ]}
          >
            <Image
              style={[
                styles.legendSpriteSheet,
                {
                  width: SPRITE_ICONS_WIDTH * glyphScale,
                  height: SPRITE_ICONS_HEIGHT * glyphScale,
                  left: -glyphBox.left * glyphScale,
                  top: -glyphBox.top * glyphScale,
                },
              ]}
              source={{ uri: SPRITE_ICONS_URL }}
              resizeMode="stretch"
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

function LegendRowIcon({ uri, sprite, color }) {
  if (uri) {
    return (
      <View style={styles.legendIconBox}>
        <Image
          style={styles.legendIconImage}
          source={{ uri }}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (sprite) {
    return <LegendSpritePin glyphBox={sprite.glyphBox} color={color} />;
  }

  return null;
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
      <View style={styles.legendList}>
        {groupSections.map((group) => (
          <View key={group.key} style={styles.legendGroup}>
            <Text style={styles.legendGroupTitle}>{group.title}</Text>
            {group.items.map(({ item, index }) => {
              const rows = createLegendRows(item);
              if (rows.length === 0) {
                return null;
              }

              return (
                <View key={`${item?.key ?? index}`} style={styles.legendItem}>
                  <Text style={styles.legendItemTitle}>{item?.title}</Text>
                  {rows.map((row) => (
                    <View key={row.key} style={styles.legendRow}>
                      {row.color ? (
                        <View
                          style={[
                            styles.legendSwatch,
                            { backgroundColor: row.color },
                          ]}
                        />
                      ) : null}
                      <LegendRowIcon
                        uri={row.iconUri}
                        sprite={row.sprite}
                        color={row.iconColor}
                      />
                      <Text style={styles.legendLabel}>{row.name}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </DrawerShell>
  );
}

function InvestmentSheetBody({ info }) {
  const stats = Array.isArray(info.stats) ? info.stats : [];
  const sectors = Array.isArray(info.sectors) ? info.sectors : [];
  const hasContact = !!(info.contactPhone || info.contactEmail);

  return (
    <React.Fragment>
      <View style={styles.sheetHero}>
        {info.bannerImage ? (
          <Image
            style={styles.sheetHeroImage}
            source={{ uri: info.bannerImage }}
            resizeMode="cover"
          />
        ) : null}
        <View style={styles.sheetHeroScrim} />
        <View style={styles.sheetHeroContent}>
          {info.code ? (
            <View style={styles.sheetHeroBadge}>
              <Text style={styles.sheetHeroBadgeText}>{info.code}</Text>
            </View>
          ) : null}
          <Text style={styles.sheetHeroTitle} numberOfLines={1}>
            {info.name}
          </Text>
          {info.subtitle ? (
            <Text style={styles.sheetHeroSubtitle} numberOfLines={2}>
              {info.subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {stats.length > 0 ? (
        <View style={styles.sheetSection}>
          <Text style={styles.sheetSectionTitle}>{SHEET_STATS_TITLE}</Text>
          <View style={styles.sheetStatGrid}>
            {stats.map((stat, index) => (
              <View key={`${stat.label}-${index}`} style={styles.sheetStatCard}>
                <View style={styles.sheetStatCardInner}>
                  <Text style={styles.sheetStatLabel} numberOfLines={2}>
                    {stat.label}
                  </Text>
                  <Text style={styles.sheetStatValue} numberOfLines={1}>
                    {stat.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {info.overviewContent ? (
        <View style={styles.sheetSection}>
          {info.overviewTitle ? (
            <Text style={styles.sheetSectionTitle}>{info.overviewTitle}</Text>
          ) : null}
          <View style={styles.sheetOverviewBox}>
            <Text style={styles.sheetOverviewText}>{info.overviewContent}</Text>
          </View>
        </View>
      ) : null}

      {sectors.length > 0 ? (
        <View style={styles.sheetSection}>
          {info.sectorsTitle ? (
            <Text style={styles.sheetSectionTitle}>{info.sectorsTitle}</Text>
          ) : null}
          <View style={styles.sheetChipRow}>
            {sectors.map((sector, index) => (
              <View key={`${sector}-${index}`} style={styles.sheetChip}>
                <Text style={styles.sheetChipText}>{sector}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {info.industrialZones != null ? (
        <View style={styles.sheetSection}>
          <View style={styles.sheetCountCard}>
            <Text style={styles.sheetCountLabel}>
              {SHEET_INDUSTRIAL_ZONES_TITLE}
            </Text>
            <Text style={styles.sheetCountValue}>{`${info.industrialZones}`}</Text>
          </View>
        </View>
      ) : null}

      {hasContact ? (
        <View style={styles.sheetSection}>
          {info.contactTitle ? (
            <Text style={styles.sheetSectionTitle}>{info.contactTitle}</Text>
          ) : null}
          <View style={styles.sheetContactBox}>
            {info.contactPhone ? (
              <View style={styles.sheetContactRow}>
                <Text style={styles.sheetContactIcon}>✆</Text>
                <Text style={styles.sheetContactText} numberOfLines={1}>
                  {info.contactPhone}
                </Text>
              </View>
            ) : null}
            {info.contactEmail ? (
              <View style={styles.sheetContactRow}>
                <Text style={styles.sheetContactIcon}>✉</Text>
                <Text style={styles.sheetContactText} numberOfLines={1}>
                  {info.contactEmail}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}
    </React.Fragment>
  );
}

function ZoneChipSection({ title, items, danger }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.sheetSection}>
      <Text style={styles.sheetSectionTitle}>{title}</Text>
      <View style={styles.sheetChipRow}>
        {items.map((item, index) => (
          <View
            key={`${item}-${index}`}
            style={[styles.sheetChip, danger && styles.zoneChipDanger]}
          >
            <Text
              style={[
                styles.sheetChipText,
                danger && styles.zoneChipDangerText,
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ZoneSheetBody({ info, onPressProjects }) {
  const stats = Array.isArray(info.stats) ? info.stats : [];
  const introParagraphs = Array.isArray(info.introParagraphs)
    ? info.introParagraphs
    : [];
  const investors = Array.isArray(info.investors) ? info.investors : [];

  return (
    <React.Fragment>
      <View style={styles.sheetHero}>
        {info.bannerImage ? (
          <Image
            style={styles.sheetHeroImage}
            source={{ uri: info.bannerImage }}
            resizeMode="cover"
          />
        ) : null}
        <View style={styles.sheetHeroScrim} />
        <View style={styles.sheetHeroContent}>
          {info.typeLabel ? (
            <View style={styles.sheetHeroBadge}>
              <Text style={styles.sheetHeroBadgeText}>{info.typeLabel}</Text>
            </View>
          ) : null}
          <Text style={styles.sheetHeroTitle} numberOfLines={2}>
            {info.name}
          </Text>
          {info.subtitle ? (
            <Text style={styles.sheetHeroSubtitle} numberOfLines={2}>
              {info.subtitle}
            </Text>
          ) : null}
          {info.code ? (
            <View style={styles.zoneHeroCode}>
              <Text style={styles.zoneHeroCodeText}>{info.code}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {info.status ? (
        <View style={styles.zoneStatusRow}>
          <View
            style={[
              styles.zoneStatusPill,
              !info.isPublished && styles.zoneStatusPillMuted,
            ]}
          >
            <Text
              style={[
                styles.zoneStatusText,
                !info.isPublished && styles.zoneStatusTextMuted,
              ]}
            >
              {info.status}
            </Text>
          </View>
        </View>
      ) : null}

      {stats.length > 0 ? (
        <View style={styles.sheetSection}>
          <Text style={styles.sheetSectionTitle}>{ZONE_MAIN_INFO_TITLE}</Text>
          <View style={styles.sheetStatGrid}>
            {stats.map((stat, index) => (
              <View key={`${stat.label}-${index}`} style={styles.sheetStatCard}>
                <View style={styles.sheetStatCardInner}>
                  <Text style={styles.sheetStatLabel} numberOfLines={2}>
                    {stat.label}
                  </Text>
                  <Text style={styles.sheetStatValue} numberOfLines={2}>
                    {stat.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {info.address ? (
        <View style={styles.sheetSection}>
          <Text style={styles.sheetSectionTitle}>{ZONE_LOCATION_TITLE}</Text>
          <View style={styles.zoneLabeledBox}>
            <Text style={styles.zoneLabeledBoxLabel}>{ZONE_ADDRESS_LABEL}</Text>
            <Text style={styles.zoneLabeledBoxText}>{info.address}</Text>
          </View>
        </View>
      ) : null}

      {introParagraphs.length > 0 ? (
        <View style={styles.sheetSection}>
          <Text style={styles.sheetSectionTitle}>{ZONE_INTRO_TITLE}</Text>
          {introParagraphs.map((paragraph, index) => (
            <View
              key={`${paragraph}-${index}`}
              style={[
                styles.sheetOverviewBox,
                index > 0 && styles.zoneParagraphSpacing,
              ]}
            >
              <Text style={styles.sheetOverviewText}>{paragraph}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <ZoneChipSection
        title={ZONE_ATTRACTED_SECTORS_TITLE}
        items={info.attractedSectors}
      />
      <ZoneChipSection
        title={ZONE_RESTRICTED_SECTORS_TITLE}
        items={info.restrictedSectors}
        danger
      />
      <ZoneChipSection title={ZONE_ADVANTAGES_TITLE} items={info.advantages} />

      {investors.length > 0 ? (
        <View style={styles.sheetSection}>
          <Text style={styles.sheetSectionTitle}>{ZONE_INVESTOR_TITLE}</Text>
          {investors.map((investor, index) => (
            <View
              key={`${investor.name}-${index}`}
              style={[
                styles.zoneInvestorCard,
                index > 0 && styles.zoneParagraphSpacing,
              ]}
            >
              <Text style={styles.zoneInvestorName} numberOfLines={2}>
                {investor.name}
              </Text>
              {investor.year ? (
                <Text style={styles.zoneInvestorYear}>{investor.year}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.zoneProjectButtonRow}>
        <Pressable
          style={styles.zoneProjectButton}
          onPress={() => onPressProjects(ZONE_PROJECT_KIND_INVESTMENT)}
        >
          <Text style={styles.zoneProjectButtonLabel}>
            {ZONE_INVESTMENT_PROJECTS_LABEL}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.zoneProjectButton, styles.zoneProjectButtonPrimary]}
          onPress={() => onPressProjects(ZONE_PROJECT_KIND_ATTRACTED)}
        >
          <Text
            style={[
              styles.zoneProjectButtonLabel,
              styles.zoneProjectButtonLabelPrimary,
            ]}
          >
            {ZONE_ATTRACTED_PROJECTS_LABEL}
          </Text>
        </Pressable>
      </View>
    </React.Fragment>
  );
}

function ZoneProjectsBody({ zoneName, loading, statusText, projects }) {
  // The count is only meaningful once the request has settled, so the badge
  // waits rather than flashing "0 du an" while loading.
  const header = zoneName ? (
    <View style={styles.zoneProjectsHeader}>
      <Text style={styles.zoneProjectsHeaderTitle} numberOfLines={2}>
        {zoneName}
      </Text>
      <View style={styles.zoneProjectsHeaderRow}>
        <Text style={styles.zoneProjectsHeaderSubtitle} numberOfLines={1}>
          {ZONE_PROJECTS_SUBTITLE}
        </Text>
        {loading ? null : (
          <View style={styles.zoneProjectsCountBadge}>
            <Text style={styles.zoneProjectsCountText}>
              {`${projects.length}${ZONE_PROJECTS_COUNT_SUFFIX}`}
            </Text>
          </View>
        )}
      </View>
    </View>
  ) : null;

  if (loading || projects.length === 0) {
    return (
      <React.Fragment>
        {header}
        <View style={styles.sheetStatusBox}>
          {loading ? <ActivityIndicator color="#b91c1c" /> : null}
          <Text style={styles.sheetStatusText}>{statusText}</Text>
        </View>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {header}
      <View style={styles.zoneProjectList}>
        {projects.map((project) => (
          <View key={project.key} style={styles.zoneProjectCard}>
            <View style={styles.zoneProjectCardHeader}>
              <Text style={styles.zoneProjectName} numberOfLines={2}>
                {project.name}
              </Text>
              {project.status ? (
                <View style={styles.zoneProjectStatusPill}>
                  <Text style={styles.zoneProjectStatusText}>
                    {project.status}
                  </Text>
                </View>
              ) : null}
            </View>

            {project.code ? (
              <Text style={styles.zoneProjectCode}>{project.code}</Text>
            ) : null}

            {project.sector ? (
              <View style={styles.zoneProjectSector}>
                <Text style={styles.zoneProjectSectorText}>
                  {project.sector}
                </Text>
              </View>
            ) : null}

            {project.area || project.investment ? (
              <View style={styles.zoneProjectStatRow}>
                {project.area ? (
                  <View style={styles.zoneProjectStatCell}>
                    <Text style={styles.zoneProjectStatLabel} numberOfLines={2}>
                      {ZONE_PROJECT_AREA_LABEL}
                    </Text>
                    <Text style={styles.zoneProjectStatValue} numberOfLines={1}>
                      {project.area}
                    </Text>
                  </View>
                ) : null}
                {project.investment ? (
                  <View style={styles.zoneProjectStatCell}>
                    <Text style={styles.zoneProjectStatLabel} numberOfLines={2}>
                      {ZONE_PROJECT_INVESTMENT_LABEL}
                    </Text>
                    <Text style={styles.zoneProjectStatValue} numberOfLines={1}>
                      {project.investment}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </React.Fragment>
  );
}

const SHEET_SNAP_FULL = 1;

/**
 * Anchors a drag may settle on. Closing is deliberately not one of them — the
 * sheet is dismissed only through its close button — so dragging down stops at
 * the smallest anchor instead of throwing the sheet away.
 */
function getSheetSnapAnchors() {
  return [SHEET_HALF_SNAP_RATIO, SHEET_SNAP_FULL].sort((a, b) => a - b);
}

function clampSnapValue(value) {
  const anchors = getSheetSnapAnchors();
  return Math.max(anchors[0], Math.min(anchors[anchors.length - 1], value));
}

/**
 * Picks the anchor a released drag should settle on. A fast flick moves one
 * anchor in the flick direction regardless of distance travelled; a slow drag
 * settles on whichever anchor the panel ended up closest to.
 */
function resolveSheetSnapTarget(releasedValue, velocity, startValue) {
  const anchors = getSheetSnapAnchors();

  if (velocity > SHEET_SWIPE_FLICK_VELOCITY) {
    const lower = anchors.filter((anchor) => anchor < startValue - 0.001);
    return lower.length > 0 ? lower[lower.length - 1] : anchors[0];
  }

  if (velocity < -SHEET_SWIPE_FLICK_VELOCITY) {
    const higher = anchors.filter((anchor) => anchor > startValue + 0.001);
    return higher.length > 0 ? higher[0] : anchors[anchors.length - 1];
  }

  return anchors.reduce(
    (best, anchor) =>
      Math.abs(anchor - releasedValue) < Math.abs(best - releasedValue)
        ? anchor
        : best,
    anchors[0]
  );
}

const SHEET_KIND_ZONE = 'zone';

function InvestmentSheet({
  show,
  title,
  kind,
  loading,
  statusText,
  info,
  showProjects,
  projects,
  projectsLoading,
  projectsStatusText,
  showDirections,
  directionsRoute,
  directionsLoading,
  directionsStatusText,
  directionsOriginText,
  directionsDestinationText,
  pickingEndpoint,
  dragAnim,
  snapValue,
  onClose,
  onBack,
  onSnapTo,
  onPanelHeightChange,
  onFocusProvince,
  onPressProjects,
  onPressDirections,
  onPickEndpoint,
}) {
  const [containerHeight, setContainerHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const availableHeight = containerHeight || Dimensions.get('window').height;
  const panelHeight = Math.max(0, Math.round(availableHeight - SHEET_TOP_PEEK));

  // How much map the sheet hides is only known here, where the map area is
  // measured, but the camera fit that has to work around it lives in MFBanDoSo.
  useEffect(() => {
    if (typeof onPanelHeightChange === 'function') {
      onPanelHeightChange(panelHeight);
    }
  }, [panelHeight, onPanelHeightChange]);
  // The animated value is the fraction of the panel left visible, so a drag and
  // the anchors it settles on share one travel distance: the panel's own
  // height. Without that the drag would stop tracking the finger 1:1.
  const travel = panelHeight || SHEET_TRANSLATE_Y;
  const travelRef = useRef(travel);
  travelRef.current = travel;
  const snapValueRef = useRef(snapValue);
  snapValueRef.current = snapValue;
  const gestureStartValueRef = useRef(snapValue);
  const handlersRef = useRef({ onSnapTo });
  handlersRef.current = { onSnapTo };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dy) > SHEET_SWIPE_ACTIVATION_DISTANCE &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderGrant: () => {
        gestureStartValueRef.current = snapValueRef.current;
      },
      onPanResponderMove: (evt, gestureState) => {
        dragAnim.setValue(
          clampSnapValue(
            gestureStartValueRef.current - gestureState.dy / travelRef.current
          )
        );
      },
      onPanResponderRelease: (evt, gestureState) => {
        const releasedValue = clampSnapValue(
          gestureStartValueRef.current - gestureState.dy / travelRef.current
        );

        handlersRef.current.onSnapTo(
          resolveSheetSnapTarget(
            releasedValue,
            gestureState.vy,
            gestureStartValueRef.current
          )
        );
      },
      onPanResponderTerminate: () => {
        handlersRef.current.onSnapTo(gestureStartValueRef.current);
      },
    })
  ).current;

  if (!show) {
    return null;
  }

  const panelAnimatedStyle = {
    transform: [
      {
        translateY: dragAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [travel, 0],
        }),
      },
    ],
  };

  // The action bar sits outside the panel, so it needs no transform to stay at
  // the bottom of the screen. It only fades once the sheet is nearly closed;
  // without that it would still be sitting there after the panel slid away.
  const footerFadeAt = Math.max(
    0.01,
    Math.min(SHEET_FOOTER_FADE_RATIO, SHEET_HALF_SNAP_RATIO / 2)
  );
  const footerAnimatedStyle = {
    opacity: dragAnim.interpolate({
      inputRange: [0, footerFadeAt, 1],
      outputRange: [0, 1, 1],
    }),
  };

  // At the smaller anchors the bottom of the scroll viewport sits off-screen,
  // so the tail of the content could never be scrolled into view. Padding it by
  // the hidden slice makes the last row reachable at every anchor, plus the
  // action bar's own height: it no longer takes a slot in the panel's flow, so
  // it now covers the bottom of the scroll area rather than sitting below it.
  const scrollTailSpace = Math.max(
    0,
    Math.round(panelHeight * (1 - clampSnapValue(snapValue))) + footerHeight
  );

  const measure = (event, setter) => {
    const nextHeight = event?.nativeEvent?.layout?.height;
    if (typeof nextHeight !== 'number' || nextHeight <= 0) {
      return;
    }

    setter((prevHeight) =>
      Math.abs(prevHeight - nextHeight) < 1 ? prevHeight : nextHeight
    );
  };

  const onContainerLayout = (event) => measure(event, setContainerHeight);
  const onFooterLayout = (event) => measure(event, setFooterHeight);

  // Only the province detail carries these actions — not the zone sheet, and
  // not the drilled-down project or directions views.
  const showActionBar =
    !showDirections &&
    !showProjects &&
    !loading &&
    info != null &&
    info.focusProvince != null;

  return (
    // box-none so only the panel itself takes touches: the map underneath stays
    // pannable and tappable while the sheet is open. That rules out a dimming
    // backdrop, which would both block the map and read as "map disabled".
    <View
      style={styles.sheetContainer}
      onLayout={onContainerLayout}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[styles.sheetPanel, { height: panelHeight }, panelAnimatedStyle]}
      >
        <View style={styles.sheetHeader} {...panResponder.panHandlers}>
          {onBack ? (
            <Pressable style={styles.sheetBackButton} onPress={onBack}>
              <View style={styles.sheetBackChevron} />
            </Pressable>
          ) : null}
          <Text style={styles.sheetHeaderTitle} numberOfLines={1}>
            {title}
          </Text>
          <Pressable style={styles.sheetCloseButton} onPress={onClose}>
            <Text style={styles.sheetCloseMark}>✕</Text>
          </Pressable>
        </View>

        {showDirections ? (
          <ScrollView
            key="directions"
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <DirectionsBody
              loading={directionsLoading}
              statusText={directionsStatusText}
              route={directionsRoute}
              originText={directionsOriginText}
              destinationText={directionsDestinationText}
              pickingEndpoint={pickingEndpoint}
              onPickEndpoint={onPickEndpoint}
            />
            {scrollTailSpace > 0 ? (
              <View style={{ height: scrollTailSpace }} />
            ) : null}
          </ScrollView>
        ) : showProjects ? (
          // Keyed apart from the detail scroller so switching views starts at
          // the top instead of keeping the detail's scroll offset.
          <ScrollView
            key="projects"
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <ZoneProjectsBody
              zoneName={info?.name}
              loading={projectsLoading}
              statusText={projectsStatusText}
              projects={Array.isArray(projects) ? projects : []}
            />
            {scrollTailSpace > 0 ? (
              <View style={{ height: scrollTailSpace }} />
            ) : null}
          </ScrollView>
        ) : loading || !info ? (
          <View style={styles.sheetStatusBox}>
            {loading ? <ActivityIndicator color="#b91c1c" /> : null}
            <Text style={styles.sheetStatusText}>{statusText}</Text>
          </View>
        ) : (
          <ScrollView
            key="detail"
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {kind === SHEET_KIND_ZONE ? (
              <ZoneSheetBody info={info} onPressProjects={onPressProjects} />
            ) : (
              <InvestmentSheetBody info={info} />
            )}
            {scrollTailSpace > 0 ? (
              <View style={{ height: scrollTailSpace }} />
            ) : null}
          </ScrollView>
        )}
      </Animated.View>

      {showActionBar ? (
        <Animated.View
          style={[styles.sheetActionBar, footerAnimatedStyle]}
          onLayout={onFooterLayout}
        >
          <Pressable
            style={[styles.sheetActionButton, styles.sheetActionButtonGhost]}
            onPress={onPressDirections}
          >
            <View style={styles.directionsIcon}>
              <View style={styles.directionsIconDiamond} />
              <View style={styles.directionsIconArrow} />
            </View>
            <Text
              style={[styles.sheetActionLabel, styles.sheetActionLabelGhost]}
            >
              {DIRECTIONS_ACTION_LABEL}
            </Text>
          </Pressable>
          <Pressable style={styles.sheetActionButton} onPress={onFocusProvince}>
            <View style={styles.sheetActionIcon} />
            <Text style={styles.sheetActionLabel}>
              {SHEET_FOCUS_ACTION_LABEL}
            </Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

export {
  InvestmentSheet,
  LayerButton,
  LegendButton,
  LegendDrawer,
  PickOriginBanner,
  SearchBox,
  SelectorDrawer,
};
