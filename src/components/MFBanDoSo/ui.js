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
  View,
} from 'react-native';
import {
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
  ZONE_ADDRESS_LABEL,
  ZONE_ADVANTAGES_TITLE,
  ZONE_ATTRACTED_PROJECTS_LABEL,
  ZONE_ATTRACTED_SECTORS_TITLE,
  ZONE_INTRO_TITLE,
  ZONE_INVESTMENT_PROJECTS_LABEL,
  ZONE_INVESTOR_TITLE,
  ZONE_LOCATION_TITLE,
  ZONE_MAIN_INFO_TITLE,
  ZONE_RESTRICTED_SECTORS_TITLE,
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

function ZoneSheetBody({ info }) {
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
        <View style={styles.zoneProjectButton}>
          <Text style={styles.zoneProjectButtonLabel}>
            {ZONE_INVESTMENT_PROJECTS_LABEL}
          </Text>
        </View>
        <View
          style={[styles.zoneProjectButton, styles.zoneProjectButtonPrimary]}
        >
          <Text
            style={[
              styles.zoneProjectButtonLabel,
              styles.zoneProjectButtonLabelPrimary,
            ]}
          >
            {ZONE_ATTRACTED_PROJECTS_LABEL}
          </Text>
        </View>
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
  dragAnim,
  snapValue,
  onClose,
  onSnapTo,
  onPanelHeightChange,
  onFocusProvince,
}) {
  const [containerHeight, setContainerHeight] = useState(0);
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

  // The action bar cancels out however far the panel was pushed down, so it
  // stays glued to the bottom of the screen at every anchor instead of riding
  // off-screen with the rest of the panel. It only fades once the sheet is
  // nearly closed, otherwise it would still be sitting there after the panel
  // has slid away.
  const footerFadeAt = Math.max(
    0.01,
    Math.min(SHEET_FOOTER_FADE_RATIO, SHEET_HALF_SNAP_RATIO / 2)
  );
  const footerAnimatedStyle = {
    opacity: dragAnim.interpolate({
      inputRange: [0, footerFadeAt, 1],
      outputRange: [0, 1, 1],
    }),
    transform: [
      {
        translateY: dragAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-travel, 0],
        }),
      },
    ],
  };

  // At the smaller anchors the bottom of the scroll viewport sits off-screen,
  // so the tail of the content could never be scrolled into view. Padding it by
  // exactly the hidden slice makes the last row reachable at every anchor. The
  // action bar needs no allowance on top of that: its flow slot already sits
  // below the scroll area, so counter-translating it only moves it up into the
  // slice this padding compensates for.
  const scrollTailSpace = Math.max(
    0,
    Math.round(panelHeight * (1 - clampSnapValue(snapValue)))
  );

  const onContainerLayout = (event) => {
    const nextHeight = event?.nativeEvent?.layout?.height;
    if (typeof nextHeight !== 'number' || nextHeight <= 0) {
      return;
    }

    setContainerHeight((prevHeight) =>
      Math.abs(prevHeight - nextHeight) < 1 ? prevHeight : nextHeight
    );
  };

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
          <Text style={styles.sheetHeaderTitle} numberOfLines={1}>
            {title}
          </Text>
          <Pressable style={styles.sheetCloseButton} onPress={onClose}>
            <Text style={styles.sheetCloseMark}>✕</Text>
          </Pressable>
        </View>

        {loading || !info ? (
          <View style={styles.sheetStatusBox}>
            {loading ? <ActivityIndicator color="#b91c1c" /> : null}
            <Text style={styles.sheetStatusText}>{statusText}</Text>
          </View>
        ) : (
          <React.Fragment>
            <ScrollView
              style={styles.sheetScroll}
              contentContainerStyle={styles.sheetScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {kind === SHEET_KIND_ZONE ? (
                <ZoneSheetBody info={info} />
              ) : (
                <InvestmentSheetBody info={info} />
              )}
              {scrollTailSpace > 0 ? (
                <View style={{ height: scrollTailSpace }} />
              ) : null}
            </ScrollView>
            {info.focusProvince ? (
              <Animated.View
                style={[styles.sheetActionBar, footerAnimatedStyle]}
              >
                <Pressable
                  style={styles.sheetActionButton}
                  onPress={onFocusProvince}
                >
                  <View style={styles.sheetActionIcon} />
                  <Text style={styles.sheetActionLabel}>
                    {SHEET_FOCUS_ACTION_LABEL}
                  </Text>
                </Pressable>
              </Animated.View>
            ) : null}
          </React.Fragment>
        )}
      </Animated.View>
    </View>
  );
}

export {
  InvestmentSheet,
  LayerButton,
  LegendButton,
  LegendPanel,
  SelectorDrawer,
};
