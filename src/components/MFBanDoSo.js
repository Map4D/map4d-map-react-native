import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import {
  LEGEND_TITLE,
  SELECTOR_CLOSE_DURATION_MS,
  SELECTOR_DRAWER_TRANSLATE_X,
  SELECTOR_OPEN_DURATION_MS,
  SELECTOR_TITLE,
  SHEET_CLOSE_DURATION_MS,
  SHEET_EMPTY_TEXT,
  SHEET_FOCUS_PADDING,
  SHEET_HALF_SNAP_RATIO,
  SHEET_INITIAL_SNAP_RATIO,
  SHEET_LOADING_TEXT,
  SHEET_MARKER_ID,
  SHEET_OPEN_DURATION_MS,
  SHEET_TITLE,
  SHEET_ZONE_EMPTY_TEXT,
  SHEET_ZONE_LOADING_TEXT,
  SHEET_ZONE_TITLE,
  ZONE_HIGHLIGHT_FILL_COLOR,
  ZONE_HIGHLIGHT_STROKE_COLOR,
  ZONE_HIGHLIGHT_STROKE_WIDTH,
  ZONE_HIGHLIGHT_Z_INDEX,
  ZONE_POLYGON_ID_PREFIX,
  getCategoryConfigUrl,
  getProvinceInvestmentInfoUrl,
  getSourceUrl,
  getZoneDetailUrl,
} from './MFBanDoSo/constants';
import {
  createCategoryGroupSections,
  createSelectedCategoryItemsSignature,
  getSelectedCategoryItems,
  normalizeCategoryItems,
  reconcileExpandedGroupKeys,
  resolveCategoryGroupMetadataFromResponse,
  resolveCategoryItemColor,
  resolveItemsFromCategoryResponse,
  toggleCategoryGroupChecked,
  toggleCategoryItemChecked,
} from './MFBanDoSo/helpers';
import {
  banDoSoPropTypes,
} from './MFBanDoSo/propTypes';
import {
  resolveProvinceInvestmentInfo,
} from './MFBanDoSo/investmentInfoHelpers';
import {
  resolveZoneDetailInfo,
  resolveZoneFeatureId,
} from './MFBanDoSo/zoneInfoHelpers';
import {
  areaGeometryToPolygonPaths,
  getViewboxFromGeometry,
} from './extends/area/AreaFocusGeometryUtils';
import { MFMapView } from './MFMapView';
import {
  InvestmentSheet,
  LayerButton,
  LegendButton,
  LegendPanel,
  SelectorDrawer,
} from './MFBanDoSo/ui';
import {
  buildGeojsonStyle,
} from './internal/GeojsonStyleUtils';

const SHEET_KIND_PROVINCE = 'province';
const SHEET_KIND_ZONE = 'zone';
// A tap that hit a data source feature suppresses the plain map press that may
// follow it for the same tap.
const SHEET_FEATURE_PRESS_CLAIM_MS = 400;

class MFBanDoSo extends MFMapView {
  constructor(props) {
    super(props);
    this._appliedGeojsonStyle = null;
    this._isMounted = false;
    this._categoryRequestId = 0;
    this._sheetRequestId = 0;
    this._hasFocusedFromSheet = false;
    this._sheetPanelHeight = 0;
    this._featurePressAt = 0;
    this._zonePolygonIds = [];
    this._selectorAnim = new Animated.Value(0);
    this._sheetAnim = new Animated.Value(0);
    this.state = {
      ...this.state,
      categoryItems: [],
      expandedGroupKeys: {},
      groupTitleByKey: {},
      groupOrderedKeys: [],
      isLegendVisible: false,
      isSelectorVisible: false,
      isSelectorMounted: false,
      sheetInfo: null,
      sheetKind: SHEET_KIND_PROVINCE,
      sheetStatusText: SHEET_LOADING_TEXT,
      isSheetLoading: false,
      isSheetMounted: false,
      sheetSnapValue: SHEET_INITIAL_SNAP_RATIO,
    };

    this._closeSheet = this._closeSheet.bind(this);
    this._focusProvinceFromSheet = this._focusProvinceFromSheet.bind(this);
    this._onSheetPanelHeightChange = this._onSheetPanelHeightChange.bind(this);
    this._snapSheetTo = this._snapSheetTo.bind(this);
    this._toggleItem = this._toggleItem.bind(this);
    this._toggleGroupChecked = this._toggleGroupChecked.bind(this);
    this._toggleGroup = this._toggleGroup.bind(this);
    this._toggleSelectorVisibility = this._toggleSelectorVisibility.bind(this);
    this._toggleLegendVisibility = this._toggleLegendVisibility.bind(this);
    this._openSelector = this._openSelector.bind(this);
    this._closeSelector = this._closeSelector.bind(this);
    this._snapSelectorOpen = this._snapSelectorOpen.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._loadCategoryItems();
    this._syncGeojsonStyle();
  }

  componentDidUpdate(prevProps, prevState) {
    const mapReadyChanged = prevState.isReady !== this.state.isReady;
    const mapStyleChanged = prevProps.mapStyle !== this.props.mapStyle;
    const isStagingChanged = prevProps.isStaging !== this.props.isStaging;

    if (isStagingChanged) {
      this._loadCategoryItems();
    }

    const itemsChanged =
      createSelectedCategoryItemsSignature(prevState.categoryItems) !==
      createSelectedCategoryItemsSignature(this.state.categoryItems);

    if (mapReadyChanged || mapStyleChanged || isStagingChanged || itemsChanged) {
      this._syncGeojsonStyle();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async _loadCategoryItems() {
    const requestId = this._categoryRequestId + 1;
    this._categoryRequestId = requestId;

    try {
      const response = await fetch(getCategoryConfigUrl(this.props.isStaging));
      if (!response.ok) {
        throw new Error(`Failed to fetch category config: ${response.status}`);
      }

      const json = await response.json();
      const nextItems = resolveItemsFromCategoryResponse(json);
      const groupMetadata = resolveCategoryGroupMetadataFromResponse(json);

      if (!this._isMounted || requestId !== this._categoryRequestId) {
        return;
      }

      this.setState((prevState) => {
        const categoryItems = normalizeCategoryItems(nextItems);
        const groupSections = createCategoryGroupSections(
          categoryItems,
          groupMetadata.titleByKey,
          groupMetadata.orderedKeys
        );

        return {
          categoryItems,
          groupTitleByKey: groupMetadata.titleByKey,
          groupOrderedKeys: groupMetadata.orderedKeys,
          expandedGroupKeys: reconcileExpandedGroupKeys(
            groupSections,
            prevState.expandedGroupKeys
          ),
        };
      });
    } catch (error) {
      if (requestId !== this._categoryRequestId) {
        return;
      }
      console.warn('Cannot load category items', error);
    }
  }

  _onPress(event) {
    super._onPress(event);

    // A tap on a zone can reach the SDK's plain map-click listener as well as
    // its feature-click listener. The feature press is the more specific of the
    // two, so once it has claimed a tap the map press for it is ignored.
    if (Date.now() - this._featurePressAt < SHEET_FEATURE_PRESS_CLAIM_MS) {
      return;
    }

    const location = event?.nativeEvent?.location;
    const latitude = location?.latitude;
    const longitude = location?.longitude;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return;
    }

    this._prepareSheetForTap(latitude, longitude);
    this._loadProvinceInfo(latitude, longitude);
  }

  _onDataSourceFeaturePress(event) {
    super._onDataSourceFeaturePress(event);

    const feature = event?.nativeEvent?.feature;
    const zoneId = resolveZoneFeatureId(feature);
    const location = feature?.location ?? event?.nativeEvent?.location;
    const latitude = location?.latitude;
    const longitude = location?.longitude;

    if (zoneId != null) {
      this._featurePressAt = Date.now();
      this._prepareSheetForTap(latitude, longitude);
      this._loadZoneInfo(zoneId);
      return;
    }

    // The feature carries no id the detail endpoint can be called with, so fall
    // back to what a tap on bare map does. Doing nothing instead would leave
    // taps on non-zone layers dead, since the SDK may route them here rather
    // than to its plain map-click listener. The claim is only taken once there
    // is something to show, so an unusable feature press cannot swallow the map
    // press that may follow it.
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      this._featurePressAt = Date.now();
      this._prepareSheetForTap(latitude, longitude);
      this._loadProvinceInfo(latitude, longitude);
    }
  }

  /**
   * Shared setup for both tap flows: drop a stale highlight, move the marker to
   * the tapped spot and bring the sheet up before its request is started.
   */
  _prepareSheetForTap(latitude, longitude) {
    // Reachable while the sheet is already open, since the map stays
    // interactive: drop the previous highlights so they cannot outlive the info
    // they belong to.
    if (this._hasFocusedFromSheet) {
      this._hasFocusedFromSheet = false;
      this.clearFocusedArea();
    }

    this._clearZoneOverlays();

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      this._addMarker({
        id: SHEET_MARKER_ID,
        coordinate: { latitude, longitude },
      });
    }

    this._openSheet();
  }

  /**
   * Draws the tapped zone with the geometry the detail endpoint returned, and
   * moves the marker from the point the user hit onto the zone's own pin.
   */
  _renderZoneOverlays(info) {
    this._clearZoneOverlays();

    if (!info) {
      return;
    }

    if (info.pin) {
      this._addMarker({
        id: SHEET_MARKER_ID,
        coordinate: info.pin,
      });
    }

    areaGeometryToPolygonPaths(info.geometry).forEach((coordinates, index) => {
      const id = `${ZONE_POLYGON_ID_PREFIX}-${index}`;

      this._addPolygon({
        id,
        coordinates,
        fillColor: ZONE_HIGHLIGHT_FILL_COLOR,
        strokeColor: ZONE_HIGHLIGHT_STROKE_COLOR,
        strokeWidth: ZONE_HIGHLIGHT_STROKE_WIDTH,
        zIndex: ZONE_HIGHLIGHT_Z_INDEX,
      });
      this._zonePolygonIds.push(id);
    });
  }

  _clearZoneOverlays() {
    this._zonePolygonIds.forEach((id) => this._removePolygon(id));
    this._zonePolygonIds = [];
  }

  /**
   * Starts a sheet request, invalidating whatever was in flight. Both sources
   * share one request id so a province tap cannot be overwritten by a zone
   * response that was already on its way, or the other way round.
   */
  _beginSheetRequest(kind, loadingText) {
    const requestId = this._sheetRequestId + 1;
    this._sheetRequestId = requestId;

    this.setState({
      sheetKind: kind,
      sheetInfo: null,
      sheetStatusText: loadingText,
      isSheetLoading: true,
    });

    return () => this._isMounted && requestId === this._sheetRequestId;
  }

  _resolveSheetResult(isCurrentRequest, info, emptyText) {
    if (!isCurrentRequest()) {
      return;
    }

    this.setState({
      sheetInfo: info,
      sheetStatusText: info ? '' : emptyText,
      isSheetLoading: false,
    });
  }

  async _loadProvinceInfo(latitude, longitude) {
    const isCurrentRequest = this._beginSheetRequest(
      SHEET_KIND_PROVINCE,
      SHEET_LOADING_TEXT
    );

    try {
      const response = await fetch(
        getProvinceInvestmentInfoUrl(this.props.isStaging, latitude, longitude)
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch investment info: ${response.status}`);
      }

      const json = await response.json();
      this._resolveSheetResult(
        isCurrentRequest,
        resolveProvinceInvestmentInfo(json),
        SHEET_EMPTY_TEXT
      );
    } catch (error) {
      if (!isCurrentRequest()) {
        return;
      }

      console.warn('Cannot load investment info', error);
      this._resolveSheetResult(isCurrentRequest, null, SHEET_EMPTY_TEXT);
    }
  }

  async _loadZoneInfo(zoneId) {
    const isCurrentRequest = this._beginSheetRequest(
      SHEET_KIND_ZONE,
      SHEET_ZONE_LOADING_TEXT
    );

    try {
      const response = await fetch(
        getZoneDetailUrl(this.props.isStaging, zoneId)
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch zone detail: ${response.status}`);
      }

      const json = await response.json();
      const info = resolveZoneDetailInfo(json);

      if (isCurrentRequest()) {
        this._renderZoneOverlays(info);
        this._fitCameraToZone(info);
      }

      this._resolveSheetResult(isCurrentRequest, info, SHEET_ZONE_EMPTY_TEXT);
    } catch (error) {
      if (!isCurrentRequest()) {
        return;
      }

      console.warn('Cannot load zone detail', error);
      this._resolveSheetResult(isCurrentRequest, null, SHEET_ZONE_EMPTY_TEXT);
    }
  }

  _animateSheetTo(toValue, duration, easing, onDone) {
    Animated.timing(this._sheetAnim, {
      toValue,
      duration,
      easing,
      useNativeDriver: true,
    }).start(onDone);
  }

  _openSheet() {
    this.setState({
      isSheetMounted: true,
      sheetSnapValue: SHEET_INITIAL_SNAP_RATIO,
    }, () => {
      this._animateSheetTo(
        SHEET_INITIAL_SNAP_RATIO,
        SHEET_OPEN_DURATION_MS,
        Easing.out(Easing.cubic)
      );
    });
  }

  /**
   * Settles the sheet on one of its open anchors (see SHEET_HALF_SNAP_RATIO).
   * It never closes the sheet: dismissing is the close button's job alone, and
   * goes through `_closeSheet`, which also unmounts.
   */
  _snapSheetTo(snapValue) {
    if (typeof snapValue !== 'number' || snapValue <= 0) {
      return;
    }

    this.setState({ sheetSnapValue: snapValue });
    this._animateSheetTo(
      snapValue,
      SHEET_OPEN_DURATION_MS,
      Easing.out(Easing.cubic)
    );
  }

  _closeSheet() {
    this._sheetRequestId += 1;
    this._removeMarker(SHEET_MARKER_ID);
    this._clearZoneOverlays();

    this._animateSheetTo(
      0,
      SHEET_CLOSE_DURATION_MS,
      Easing.in(Easing.cubic),
      () => {
        if (!this._isMounted) {
          return;
        }

        this.setState({
          sheetInfo: null,
          isSheetLoading: false,
          isSheetMounted: false,
          sheetSnapValue: SHEET_INITIAL_SNAP_RATIO,
        });
      }
    );

    if (this._hasFocusedFromSheet) {
      this._hasFocusedFromSheet = false;
      this.clearFocusedArea();
    }
  }

  _onSheetPanelHeightChange(panelHeight) {
    this._sheetPanelHeight =
      typeof panelHeight === 'number' && panelHeight > 0 ? panelHeight : 0;
  }

  /**
   * fitBounds padding is in dp on both platforms, so the measured layout
   * heights can be handed over as they are.
   */
  _getFocusPadding(snapValue) {
    const panelHeight =
      this._sheetPanelHeight || Dimensions.get('window').height;
    const coveredHeight = Math.max(0, Math.round(panelHeight * snapValue));

    return {
      top: SHEET_FOCUS_PADDING,
      left: SHEET_FOCUS_PADDING,
      right: SHEET_FOCUS_PADDING,
      bottom: coveredHeight + SHEET_FOCUS_PADDING,
    };
  }

  /**
   * Gets the map ready to frame something the sheet must not cover: fitting a
   * camera into the strip of map left uncovered only makes sense if there is
   * one, so a fully open sheet is collapsed first. Returns the padding the fit
   * needs to clear whatever the sheet still hides.
   */
  _makeRoomForCameraFit() {
    const snapValue = Math.min(
      this.state.sheetSnapValue,
      SHEET_HALF_SNAP_RATIO
    );

    if (this.state.sheetSnapValue > snapValue) {
      this._snapSheetTo(snapValue);
    }

    return this._getFocusPadding(snapValue);
  }

  _fitCameraToZone(info) {
    const bounds = getViewboxFromGeometry(info?.geometry);
    if (!bounds) {
      return;
    }

    this.fitBounds({
      bounds: {
        southWest: {
          latitude: bounds.minLat,
          longitude: bounds.minLng,
        },
        northEast: {
          latitude: bounds.maxLat,
          longitude: bounds.maxLng,
        },
      },
      padding: this._makeRoomForCameraFit(),
    });
  }

  _focusProvinceFromSheet() {
    const focusProvince = this.state.sheetInfo?.focusProvince;
    if (!focusProvince || !this.areaFocusManager) {
      return;
    }

    this._hasFocusedFromSheet = true;
    this.areaFocusManager.focus({
      type: 'province',
      name: focusProvince.name,
      display: focusProvince.highlight === true ? 'highlight' : 'normal',
      padding: this._makeRoomForCameraFit(),
    });
  }

  _toggleItem(targetKey, targetIndex) {
    this.setState((prevState) => ({
      categoryItems: toggleCategoryItemChecked(
        prevState.categoryItems,
        targetKey,
        targetIndex
      ),
    }));
  }

  _toggleGroup(groupKey) {
    if (typeof groupKey !== 'string' || groupKey.length === 0) {
      return;
    }

    this.setState((prevState) => ({
      expandedGroupKeys: {
        ...prevState.expandedGroupKeys,
        [groupKey]: !(prevState.expandedGroupKeys[groupKey] !== false),
      },
    }));
  }

  _toggleGroupChecked(groupKey, checkedValue) {
    this.setState((prevState) => ({
      categoryItems: toggleCategoryGroupChecked(
        prevState.categoryItems,
        groupKey,
        checkedValue
      ),
    }));
  }

  _toggleSelectorVisibility() {
    if (this.state.isSelectorVisible) {
      this._closeSelector();
      return;
    }

    this._openSelector();
  }

  _toggleLegendVisibility() {
    this.setState((prevState) => ({
      isLegendVisible: !prevState.isLegendVisible,
    }));
  }

  _openSelector() {
    this.setState({
      isSelectorMounted: true,
      isSelectorVisible: true,
    }, () => {
      Animated.timing(this._selectorAnim, {
        toValue: 1,
        duration: SELECTOR_OPEN_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }

  _closeSelector() {
    Animated.timing(this._selectorAnim, {
      toValue: 0,
      duration: SELECTOR_CLOSE_DURATION_MS,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      if (!this._isMounted) {
        return;
      }

      this.setState({
        isSelectorVisible: false,
        isSelectorMounted: false,
      });
    });
  }

  _snapSelectorOpen() {
    Animated.timing(this._selectorAnim, {
      toValue: 1,
      duration: SELECTOR_OPEN_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  _syncGeojsonStyle() {
    if (!this.state.isReady) {
      return;
    }

    const items = getSelectedCategoryItems(this.state.categoryItems);

    const geojsonStyle = buildGeojsonStyle(
      this.props.mapStyle,
      getSourceUrl(this.props.isStaging),
      items
    );

    if (!geojsonStyle || geojsonStyle === this._appliedGeojsonStyle) {
      return;
    }

    this._appliedGeojsonStyle = geojsonStyle;
    this._runCommand('setMapStyle', [geojsonStyle]);
  }

  render() {
    const items = this.state.categoryItems;
    const groupSections = createCategoryGroupSections(
      items,
      this.state.groupTitleByKey,
      this.state.groupOrderedKeys
    );
    const hasItems = Array.isArray(items) && items.length > 0;
    const showLayerButton = hasItems;
    const showSelector = this.state.isSelectorMounted && hasItems;
    const showLegendButton = hasItems;
    const showLegend = this.state.isLegendVisible && hasItems;
    const selectorTitle = SELECTOR_TITLE;
    const legendTitle = LEGEND_TITLE;
    const isZoneSheet = this.state.sheetKind === SHEET_KIND_ZONE;
    const backdropAnimatedStyle = {
      opacity: this._selectorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };
    const panelAnimatedStyle = {
      transform: [
        {
          translateX: this._selectorAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [SELECTOR_DRAWER_TRANSLATE_X, 0],
          }),
        },
      ],
    };

    return (
      <React.Fragment>
        {super.render()}
        <LayerButton
          show={showLayerButton}
          isActive={this.state.isSelectorVisible}
          onPress={this._toggleSelectorVisibility}
        />
        <LegendButton
          show={showLegendButton}
          isActive={this.state.isLegendVisible}
          onPress={this._toggleLegendVisibility}
        />
        <SelectorDrawer
          show={showSelector}
          title={selectorTitle}
          groupSections={groupSections}
          expandedGroupKeys={this.state.expandedGroupKeys}
          dragAnim={this._selectorAnim}
          backdropAnimatedStyle={backdropAnimatedStyle}
          panelAnimatedStyle={panelAnimatedStyle}
          onClose={this._toggleSelectorVisibility}
          onDragCancel={this._snapSelectorOpen}
          onToggleGroup={this._toggleGroup}
          onToggleGroupChecked={this._toggleGroupChecked}
          onToggleItem={this._toggleItem}
        />
        <LegendPanel
          show={showLegend}
          title={legendTitle}
          items={items}
          getItemColor={(item) => resolveCategoryItemColor(item)}
        />
        <InvestmentSheet
          show={this.state.isSheetMounted}
          title={isZoneSheet ? SHEET_ZONE_TITLE : SHEET_TITLE}
          kind={this.state.sheetKind}
          loading={this.state.isSheetLoading}
          statusText={this.state.sheetStatusText}
          info={this.state.sheetInfo}
          dragAnim={this._sheetAnim}
          snapValue={this.state.sheetSnapValue}
          onClose={this._closeSheet}
          onSnapTo={this._snapSheetTo}
          onPanelHeightChange={this._onSheetPanelHeightChange}
          onFocusProvince={this._focusProvinceFromSheet}
        />
      </React.Fragment>
    );
  }
}

MFBanDoSo.propTypes = banDoSoPropTypes;
MFBanDoSo.defaultProps = {
  ...MFMapView.defaultProps,
  isStaging: true,
};

export { MFBanDoSo };
