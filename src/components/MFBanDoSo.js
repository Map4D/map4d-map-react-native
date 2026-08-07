import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
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
  SEARCH_DEBOUNCE_MS,
  SEARCH_MIN_KEYWORD_LENGTH,
  DIRECTIONS_ACTIVE_OUTLINE_COLOR,
  DIRECTIONS_ACTIVE_OUTLINE_WIDTH,
  DIRECTIONS_ORIGIN_POI_COLOR,
  DIRECTIONS_DESTINATION_POI_COLOR,
  DIRECTIONS_ACTIVE_STROKE_COLOR,
  DIRECTIONS_ACTIVE_STROKE_WIDTH,
  DIRECTIONS_ACTION_LABEL,
  DIRECTIONS_EMPTY_TEXT,
  DIRECTIONS_LOADING_TEXT,
  DIRECTIONS_MY_LOCATION_TEXT,
  DIRECTIONS_PICKED_POINT_TEXT,
  DIRECTIONS_PICK_DESTINATION_TEXT,
  DIRECTIONS_PICK_ORIGIN_TEXT,
  DIRECTIONS_ENDPOINT_ORIGIN,
  DIRECTIONS_DESTINATION_LABEL,
  ZONE_PROJECT_KINDS,
  ZONE_PROJECTS_LOADING_TEXT,
  ZONE_HIGHLIGHT_FILL_COLOR,
  ZONE_HIGHLIGHT_STROKE_COLOR,
  ZONE_HIGHLIGHT_STROKE_WIDTH,
  ZONE_HIGHLIGHT_Z_INDEX,
  ZONE_POLYGON_ID_PREFIX,
  getCategoryConfigUrl,
  getProvinceInvestmentInfoUrl,
  getRouteUrl,
  getSearchUrl,
  getSourceUrl,
  getZoneDetailUrl,
  getZoneProjectsUrl,
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
  resolveZoneProjects,
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
  PickOriginBanner,
  SearchBox,
  SelectorDrawer,
} from './MFBanDoSo/ui';
import {
  countSearchResults,
  resolveSearchSections,
} from './MFBanDoSo/searchHelpers';
import { resolveRoute } from './MFBanDoSo/directionsHelpers';
import {
  DIRECTIONS_DESTINATION_ICON,
  DIRECTIONS_ORIGIN_ICON,
} from './MFBanDoSo/directionsIcons';
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
    this._zoneProjectsRequestId = 0;
    this._searchRequestId = 0;
    this._searchDebounceTimer = null;
    this._routeRequestId = 0;
    this._sheetPin = null;
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
      projectsKind: null,
      zoneProjects: [],
      zoneProjectsStatusText: ZONE_PROJECTS_LOADING_TEXT,
      isZoneProjectsLoading: false,
      searchKeyword: '',
      searchSections: [],
      isSearchLoading: false,
      isSearchOpen: false,
      isDirectionsVisible: false,
      isDirectionsLoading: false,
      directionsRoute: null,
      directionsStatusText: DIRECTIONS_LOADING_TEXT,
      directionsOrigin: null,
      directionsDestination: null,
      pickingEndpoint: null,
    };

    this._closeSheet = this._closeSheet.bind(this);
    this._focusProvinceFromSheet = this._focusProvinceFromSheet.bind(this);
    this._onSheetPanelHeightChange = this._onSheetPanelHeightChange.bind(this);
    this._openZoneProjects = this._openZoneProjects.bind(this);
    this._closeZoneProjects = this._closeZoneProjects.bind(this);
    this._onSearchKeywordChange = this._onSearchKeywordChange.bind(this);
    this._onSearchFocus = this._onSearchFocus.bind(this);
    this._clearSearch = this._clearSearch.bind(this);
    this._onSelectSearchResult = this._onSelectSearchResult.bind(this);
    this._startDirections = this._startDirections.bind(this);
    this._closeDirections = this._closeDirections.bind(this);
    this._cancelPickOrigin = this._cancelPickOrigin.bind(this);
    this._pickDirectionsEndpoint = this._pickDirectionsEndpoint.bind(this);
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
    this._cancelPendingSearch();
  }

  _cancelPendingSearch() {
    if (this._searchDebounceTimer != null) {
      clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = null;
    }
  }

  /**
   * Typing schedules a search rather than firing one per keystroke, and every
   * change invalidates whatever was already in flight, so a slow response for
   * an earlier prefix cannot overwrite the results for what is typed now.
   */
  _onSearchKeywordChange(keyword) {
    this._cancelPendingSearch();
    this._searchRequestId += 1;

    const trimmed = keyword.trim();
    const canSearch = trimmed.length >= SEARCH_MIN_KEYWORD_LENGTH;

    this.setState({
      searchKeyword: keyword,
      isSearchOpen: canSearch,
      isSearchLoading: canSearch,
      searchSections: canSearch ? this.state.searchSections : [],
    });

    if (!canSearch) {
      return;
    }

    this._searchDebounceTimer = setTimeout(() => {
      this._searchDebounceTimer = null;
      this._loadSearchResults(trimmed);
    }, SEARCH_DEBOUNCE_MS);
  }

  _onSearchFocus() {
    if (countSearchResults(this.state.searchSections) > 0) {
      this.setState({ isSearchOpen: true });
    }
  }

  _clearSearch() {
    this._cancelPendingSearch();
    this._searchRequestId += 1;

    this.setState({
      searchKeyword: '',
      searchSections: [],
      isSearchLoading: false,
      isSearchOpen: false,
    });
  }

  _closeSearchResults() {
    if (!this.state.isSearchOpen) {
      return;
    }

    // The list is gone, so the keyboard has nothing left to type into and would
    // just be sitting over the map.
    Keyboard.dismiss();
    this.setState({ isSearchOpen: false });
  }

  async _loadSearchResults(keyword) {
    const requestId = this._searchRequestId + 1;
    this._searchRequestId = requestId;

    const isCurrentRequest = () =>
      this._isMounted && requestId === this._searchRequestId;

    try {
      const response = await fetch(getSearchUrl(this.props.isStaging, keyword));
      if (!response.ok) {
        throw new Error(`Failed to search: ${response.status}`);
      }

      const json = await response.json();
      if (!isCurrentRequest()) {
        return;
      }

      this.setState({
        searchSections: resolveSearchSections(json),
        isSearchLoading: false,
      });
    } catch (error) {
      if (!isCurrentRequest()) {
        return;
      }

      console.warn('Cannot search', error);
      this.setState({ searchSections: [], isSearchLoading: false });
    }
  }

  /**
   * A picked result is handled as a tap on its pin: same marker, same sheet,
   * same province highlight. The highlight fits the camera itself, so no
   * separate move is needed when there is a pin to reverse-geocode.
   */
  _onSelectSearchResult(item) {
    this._closeSearchResults();

    if (item?.pin) {
      this._prepareSheetForTap(item.pin.latitude, item.pin.longitude);
      this._loadProvinceInfo(item.pin.latitude, item.pin.longitude, {
        highlightProvince: true,
      });
      return;
    }

    // No pin to look up, so the best that can be done is framing the result.
    if (item?.bounds) {
      this.fitBounds({
        bounds: {
          southWest: {
            latitude: item.bounds.minLat,
            longitude: item.bounds.minLng,
          },
          northEast: {
            latitude: item.bounds.maxLat,
            longitude: item.bounds.maxLng,
          },
        },
        padding: this._makeRoomForCameraFit(),
      });
    }
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

    // While suggestions are up, a tap on the map is a dismissal — the same way
    // it reads in any search UI — rather than a request for a new sheet.
    if (this.state.isSearchOpen) {
      this._closeSearchResults();
      return;
    }

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

    // While an end of the route is being picked, a tap supplies that point
    // instead of opening a sheet for wherever was tapped.
    if (this.state.pickingEndpoint) {
      this._setDirectionsEndpoint(this.state.pickingEndpoint, {
        latitude,
        longitude,
      });
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

    // Picking an end of the route wins over opening anything: a tap that landed
    // on a zone is still a tap on a place the route can run to or from.
    if (this.state.pickingEndpoint) {
      if (typeof latitude === 'number' && typeof longitude === 'number') {
        this._featurePressAt = Date.now();
        this._setDirectionsEndpoint(this.state.pickingEndpoint, {
          latitude,
          longitude,
        });
      }
      return;
    }

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
      this._sheetPin = { latitude, longitude };
      this._addMarker({
        id: SHEET_MARKER_ID,
        coordinate: this._sheetPin,
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
    // Whatever the sheet was showing belonged to the previous target — the
    // drilled-down project list and any drawn route included.
    this._zoneProjectsRequestId += 1;
    this._routeRequestId += 1;
    this._clearDirections();

    this.setState({
      sheetKind: kind,
      sheetInfo: null,
      sheetStatusText: loadingText,
      isSheetLoading: true,
      projectsKind: null,
      zoneProjects: [],
      isDirectionsVisible: false,
      directionsRoute: null,
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

  async _loadProvinceInfo(latitude, longitude, options) {
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
      const info = resolveProvinceInvestmentInfo(json);

      this._resolveSheetResult(isCurrentRequest, info, SHEET_EMPTY_TEXT);

      if (options?.highlightProvince && info && isCurrentRequest()) {
        this._focusProvince(info.focusProvince);
      }
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

  /**
   * A project list is a drill-down inside the same sheet: the zone detail stays
   * in state so going back needs no refetch, and the list keeps its own request
   * id so a slow list response cannot land on a different zone — or on the
   * other list, since both kinds share this one slot.
   */
  _openZoneProjects(kind) {
    const zoneId = this.state.sheetInfo?.id;
    const url = getZoneProjectsUrl(this.props.isStaging, zoneId, kind);

    if (zoneId == null || !url) {
      return;
    }

    this.setState({ projectsKind: kind });
    this._loadZoneProjects(url, kind);
  }

  _closeZoneProjects() {
    this._zoneProjectsRequestId += 1;
    this.setState({ projectsKind: null });
  }

  async _loadZoneProjects(url, kind) {
    const requestId = this._zoneProjectsRequestId + 1;
    this._zoneProjectsRequestId = requestId;
    const emptyText = ZONE_PROJECT_KINDS[kind].emptyText;

    this.setState({
      zoneProjects: [],
      zoneProjectsStatusText: ZONE_PROJECTS_LOADING_TEXT,
      isZoneProjectsLoading: true,
    });

    const isCurrentRequest = () =>
      this._isMounted && requestId === this._zoneProjectsRequestId;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch zone projects: ${response.status}`);
      }

      const json = await response.json();
      if (!isCurrentRequest()) {
        return;
      }

      this.setState({
        zoneProjects: resolveZoneProjects(json),
        zoneProjectsStatusText: emptyText,
        isZoneProjectsLoading: false,
      });
    } catch (error) {
      if (!isCurrentRequest()) {
        return;
      }

      console.warn('Cannot load zone projects', error);
      this.setState({
        zoneProjects: [],
        zoneProjectsStatusText: emptyText,
        isZoneProjectsLoading: false,
      });
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
    this._zoneProjectsRequestId += 1;
    this._routeRequestId += 1;
    this._sheetPin = null;
    this._removeMarker(SHEET_MARKER_ID);
    this._clearZoneOverlays();
    this._clearDirections();

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
          projectsKind: null,
          zoneProjects: [],
          isDirectionsVisible: false,
          directionsRoute: null,
          directionsOrigin: null,
          directionsDestination: null,
          pickingEndpoint: null,
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
    // Nothing is covering the map when the sheet is not up, so a camera fit
    // asked for from elsewhere — search, say — gets the plain margin.
    const coveredHeight = this.state.isSheetMounted
      ? Math.max(0, Math.round(panelHeight * snapValue))
      : 0;

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
    this._fitCameraToBounds(getViewboxFromGeometry(info?.geometry));
  }

  _fitCameraToBounds(bounds) {
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

  /**
   * The destination is the point the sheet was opened from — the tapped spot or
   * a picked search result — since the province payload carries no coordinate
   * of its own. It is kept outside state because it survives sheet reloads.
   */
  async _startDirections() {
    if (!this._sheetPin) {
      return;
    }

    const destination = {
      coordinate: this._sheetPin,
      label: this.state.sheetInfo?.name ?? DIRECTIONS_DESTINATION_LABEL,
    };
    const deviceCoordinate = await this._getDeviceCoordinate();
    const origin = deviceCoordinate
      ? { coordinate: deviceCoordinate, label: DIRECTIONS_MY_LOCATION_TEXT }
      : null;

    // The renderer marks both ends of the route itself, so the sheet's own
    // marker would just sit on top of the destination POI.
    this._removeMarker(SHEET_MARKER_ID);

    // Without a fix there is nothing to route from yet, so the panel opens on
    // the endpoints alone and the map supplies the missing one.
    this.setState({
      isDirectionsVisible: true,
      directionsOrigin: origin,
      directionsDestination: destination,
      directionsRoute: null,
      isDirectionsLoading: origin != null,
      directionsStatusText: origin
        ? DIRECTIONS_LOADING_TEXT
        : DIRECTIONS_PICK_ORIGIN_TEXT,
      pickingEndpoint: origin ? null : DIRECTIONS_ENDPOINT_ORIGIN,
    });

    if (origin) {
      this._loadRoute(origin, destination);
    }
  }

  _pickDirectionsEndpoint(endpoint) {
    this.setState({ pickingEndpoint: endpoint });
  }

  /**
   * Replaces one end of the route and keeps the other, then re-routes once both
   * ends are known. Reading the next pair here rather than from state avoids
   * routing against the value `setState` has not applied yet.
   */
  _setDirectionsEndpoint(endpoint, coordinate) {
    const picked = { coordinate, label: DIRECTIONS_PICKED_POINT_TEXT };
    const isOrigin = endpoint === DIRECTIONS_ENDPOINT_ORIGIN;
    const origin = isOrigin ? picked : this.state.directionsOrigin;
    const destination = isOrigin ? this.state.directionsDestination : picked;

    this.setState({
      directionsOrigin: origin,
      directionsDestination: destination,
      pickingEndpoint: null,
    });

    if (origin && destination) {
      this._loadRoute(origin, destination);
    }
  }

  async _getDeviceCoordinate() {
    try {
      const location = await this.getMyLocation();
      const coordinate = location?.coordinate;

      return typeof coordinate?.latitude === 'number' &&
        typeof coordinate?.longitude === 'number'
        ? coordinate
        : null;
    } catch (error) {
      // Permission denied or my-location not enabled: not an error worth
      // reporting, the caller falls back to picking a point.
      return null;
    }
  }

  _cancelPickOrigin() {
    this.setState({ pickingEndpoint: null });
  }

  _closeDirections() {
    this._routeRequestId += 1;
    this._clearDirections();

    // Back on the detail view the sheet owns the map again, so its marker comes
    // back to the point the info belongs to.
    if (this._sheetPin) {
      this._addMarker({
        id: SHEET_MARKER_ID,
        coordinate: this._sheetPin,
      });
    }

    this.setState({
      isDirectionsVisible: false,
      directionsRoute: null,
      directionsOrigin: null,
      directionsDestination: null,
      pickingEndpoint: null,
    });
  }

  async _loadRoute(origin, destination) {
    const url = getRouteUrl(
      this.props.isStaging,
      origin?.coordinate,
      destination?.coordinate
    );
    if (!url) {
      return;
    }

    const requestId = this._routeRequestId + 1;
    this._routeRequestId = requestId;

    this.setState({
      pickingEndpoint: null,
      isDirectionsVisible: true,
      isDirectionsLoading: true,
      directionsRoute: null,
      directionsStatusText: DIRECTIONS_LOADING_TEXT,
    });

    const isCurrentRequest = () =>
      this._isMounted && requestId === this._routeRequestId;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch route: ${response.status}`);
      }

      // The renderer decodes the payload natively, so the untouched response
      // text is what gets handed to it — no polyline decoding in JS.
      const text = await response.text();
      const route = resolveRoute(JSON.parse(text));

      if (!isCurrentRequest()) {
        return;
      }

      if (route) {
        this._setDirections(text, {
          activeStrokeColor: DIRECTIONS_ACTIVE_STROKE_COLOR,
          activeStrokeWidth: DIRECTIONS_ACTIVE_STROKE_WIDTH,
          activeOutlineColor: DIRECTIONS_ACTIVE_OUTLINE_COLOR,
          activeOutlineWidth: DIRECTIONS_ACTIVE_OUTLINE_WIDTH,
          originPOIOptions: {
            coordinate: origin.coordinate,
            icon: { uri: DIRECTIONS_ORIGIN_ICON },
            title: origin.label,
            titleColor: DIRECTIONS_ORIGIN_POI_COLOR,
            visible: true,
          },
          destinationPOIOptions: {
            coordinate: destination.coordinate,
            icon: { uri: DIRECTIONS_DESTINATION_ICON },
            title: destination.label,
            titleColor: DIRECTIONS_DESTINATION_POI_COLOR,
            visible: true,
          },
        });
        this._fitCameraToBounds(route.bounds);
      }

      this.setState({
        directionsRoute: route,
        directionsStatusText: DIRECTIONS_EMPTY_TEXT,
        isDirectionsLoading: false,
      });
    } catch (error) {
      if (!isCurrentRequest()) {
        return;
      }

      console.warn('Cannot load route', error);
      this.setState({
        directionsRoute: null,
        directionsStatusText: DIRECTIONS_EMPTY_TEXT,
        isDirectionsLoading: false,
      });
    }
  }

  /**
   * Takes the province to draw as an argument rather than reading it off state,
   * so it can also be called straight after a response lands — at that point
   * the `setState` carrying it has not been applied yet.
   */
  _focusProvince(focusProvince) {
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

  _focusProvinceFromSheet() {
    this._focusProvince(this.state.sheetInfo?.focusProvince);
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
    const projectsConfig = ZONE_PROJECT_KINDS[this.state.projectsKind];
    const showProjects = isZoneSheet && projectsConfig != null;
    const zoneTitle = showProjects ? projectsConfig.title : SHEET_ZONE_TITLE;
    const showDirections = this.state.isDirectionsVisible;
    const detailTitle = isZoneSheet ? zoneTitle : SHEET_TITLE;
    const sheetTitle = showDirections ? DIRECTIONS_ACTION_LABEL : detailTitle;
    // Only one drill-down is open at a time, so one back handler covers both.
    const projectsBack = showProjects ? this._closeZoneProjects : null;
    const backHandler = showDirections ? this._closeDirections : projectsBack;
    const pickingEndpoint = this.state.pickingEndpoint;
    const pickHintText =
      pickingEndpoint === DIRECTIONS_ENDPOINT_ORIGIN
        ? DIRECTIONS_PICK_ORIGIN_TEXT
        : DIRECTIONS_PICK_DESTINATION_TEXT;
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
        {/* Searching for somewhere else is not what the directions view is
            for, and its pick-a-point banner takes the slot anyway. */}
        <SearchBox
          show={!showDirections}
          keyword={this.state.searchKeyword}
          sections={this.state.searchSections}
          loading={this.state.isSearchLoading}
          showResults={this.state.isSearchOpen}
          onChangeKeyword={this._onSearchKeywordChange}
          onClear={this._clearSearch}
          onFocus={this._onSearchFocus}
          onSelectResult={this._onSelectSearchResult}
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
          title={sheetTitle}
          kind={this.state.sheetKind}
          loading={this.state.isSheetLoading}
          statusText={this.state.sheetStatusText}
          info={this.state.sheetInfo}
          showProjects={showProjects}
          projects={this.state.zoneProjects}
          projectsLoading={this.state.isZoneProjectsLoading}
          projectsStatusText={this.state.zoneProjectsStatusText}
          showDirections={showDirections}
          directionsRoute={this.state.directionsRoute}
          directionsLoading={this.state.isDirectionsLoading}
          directionsStatusText={this.state.directionsStatusText}
          directionsOriginText={this.state.directionsOrigin?.label}
          directionsDestinationText={this.state.directionsDestination?.label}
          pickingEndpoint={pickingEndpoint}
          dragAnim={this._sheetAnim}
          snapValue={this.state.sheetSnapValue}
          onClose={this._closeSheet}
          onBack={backHandler}
          onSnapTo={this._snapSheetTo}
          onPanelHeightChange={this._onSheetPanelHeightChange}
          onFocusProvince={this._focusProvinceFromSheet}
          onPressProjects={this._openZoneProjects}
          onPressDirections={this._startDirections}
          onPickEndpoint={this._pickDirectionsEndpoint}
        />
        <PickOriginBanner
          show={pickingEndpoint != null}
          text={pickHintText}
          onCancel={this._cancelPickOrigin}
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
