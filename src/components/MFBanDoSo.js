import React from 'react';
import { Animated, Dimensions, Easing, Keyboard, View } from 'react-native';
import {
  DIRECTIONS_ACTION_LABEL,
  DIRECTIONS_ACTIVE_OUTLINE_COLOR,
  DIRECTIONS_ACTIVE_OUTLINE_WIDTH,
  DIRECTIONS_ACTIVE_STROKE_COLOR,
  DIRECTIONS_ACTIVE_STROKE_WIDTH,
  DIRECTIONS_DESTINATION_ICON,
  DIRECTIONS_DESTINATION_LABEL,
  DIRECTIONS_DESTINATION_POI_COLOR,
  DIRECTIONS_EMPTY_TEXT,
  DIRECTIONS_ENDPOINT_ORIGIN,
  DIRECTIONS_LOADING_TEXT,
  DIRECTIONS_MY_LOCATION_TEXT,
  DIRECTIONS_ORIGIN_ICON,
  DIRECTIONS_ORIGIN_POI_COLOR,
  DIRECTIONS_PICKED_POINT_TEXT,
  DIRECTIONS_PICK_DESTINATION_TEXT,
  DIRECTIONS_PICK_ORIGIN_TEXT,
  PickOriginBanner,
  getRouteUrl,
  resolveRoute,
} from './MFBanDoSo/directions';
import {
  ADVANCED_TARGET_ZONE,
  AdvancedSearchButton,
  AdvancedSearchView,
  getAdvancedInfraSearchUrl,
  getAdvancedZoneSearchUrl,
  getInfraLayerOptionsUrl,
  getInfraTypeOptionsUrl,
  getProvinceOptionsUrl,
  getWardOptionsUrl,
  getZoneFormTypeOptionsUrl,
  getZoneTypeOptionsUrl,
  resolveInfraResults,
  resolveListOptions,
  resolveMapOptions,
  resolveZoneResults,
} from './MFBanDoSo/advancedSearch';
import { CompassButton } from './MFBanDoSo/controls';
import {
  LayerButton,
  SELECTOR_TITLE,
  SelectorDrawer,
  createCategoryGroupSections,
  createSelectedCategoryItemsSignature,
  getCategoryConfigUrl,
  getSelectedCategoryItems,
  getSourceUrl,
  normalizeCategoryItems,
  reconcileExpandedGroupKeys,
  resolveCategoryGroupMetadataFromResponse,
  resolveItemsFromCategoryResponse,
  toggleCategoryGroupChecked,
  toggleCategoryItemChecked,
} from './MFBanDoSo/layers';
import {
  LEGEND_TITLE,
  LegendButton,
  LegendDrawer,
  getLegendConfigUrl,
  resolveLegendGroupSections,
} from './MFBanDoSo/legend';
import { banDoSoPropTypes } from './MFBanDoSo/propTypes';
import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_MIN_KEYWORD_LENGTH,
  SEARCH_ZONE_KIND,
  SearchBox,
  countSearchResults,
  getSearchUrl,
  resolveSearchSections,
} from './MFBanDoSo/search';
import {
  DRAWER_CLOSE_DURATION_MS,
  DRAWER_OPEN_DURATION_MS,
  DRAWER_TRANSLATE_X,
} from './MFBanDoSo/shared/constants';
import { sharedStyles } from './MFBanDoSo/shared/styles';
import {
  InvestmentSheet,
  SHEET_CLOSE_DURATION_MS,
  SHEET_EMPTY_TEXT,
  SHEET_FOCUS_PADDING,
  SHEET_HALF_SNAP_RATIO,
  SHEET_INITIAL_SNAP_RATIO,
  INFRA_FOCUS_DELTA,
  SHEET_INFRA_EMPTY_TEXT,
  SHEET_INFRA_LOADING_TEXT,
  SHEET_INFRA_TITLE,
  SHEET_KIND_INFRA,
  SHEET_KIND_ZONE,
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
  ZONE_PROJECTS_LOADING_TEXT,
  ZONE_PROJECT_KINDS,
  getInfraDetailUrl,
  getProvinceInvestmentInfoUrl,
  getZoneDetailUrl,
  getZoneProjectsUrl,
  resolveInfraDetailInfo,
  resolveProvinceInvestmentInfo,
  resolveZoneDetailInfo,
  resolveZoneFeatureId,
  resolveZoneProjects,
} from './MFBanDoSo/sheet';
import {
  areaGeometryToPolygonPaths,
  getViewboxFromGeometry,
} from './extends/area/AreaFocusGeometryUtils';
import { buildGeojsonStyle } from './internal/GeojsonStyleUtils';
import { MFMapView } from './MFMapView';

const SHEET_KIND_PROVINCE = 'province';
// Every advanced filter is optional, so "unset" is what they all start at and
// what "Xóa lọc" puts them back to.
const EMPTY_ADVANCED_FILTERS = {
  keyword: '',
  zoneTypeId: null,
  formTypeId: null,
  status: null,
  provinceId: null,
  wardId: null,
  infraTypeId: null,
  infraLayerId: null,
};
const EMPTY_ADVANCED_OPTIONS = {
  zoneTypes: [],
  formTypes: [],
  provinces: [],
  wards: [],
  infraTypes: [],
  infraLayers: [],
};
// A tap that hit a data source feature suppresses the plain map press that may
// follow it for the same tap.
const SHEET_FEATURE_PRESS_CLAIM_MS = 400;

class MFBanDoSo extends MFMapView {
  constructor(props) {
    super(props);
    this._appliedGeojsonStyle = null;
    this._isMounted = false;
    this._categoryRequestId = 0;
    this._legendRequestId = 0;
    this._sheetRequestId = 0;
    this._hasFocusedFromSheet = false;
    this._sheetPanelHeight = 0;
    this._featurePressAt = 0;
    this._zonePolygonIds = [];
    this._zoneProjectsRequestId = 0;
    this._searchRequestId = 0;
    this._searchDebounceTimer = null;
    this._routeRequestId = 0;
    this._advancedRequestId = 0;
    this._hasAdvancedOptions = false;
    this._sheetPin = null;
    this._selectorAnim = new Animated.Value(0);
    this._legendAnim = new Animated.Value(0);
    this._sheetAnim = new Animated.Value(0);
    this.state = {
      ...this.state,
      categoryItems: [],
      expandedGroupKeys: {},
      groupTitleByKey: {},
      groupOrderedKeys: [],
      legendSections: [],
      isLegendVisible: false,
      isLegendMounted: false,
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
      mapBearing: 0,
      isAdvancedSearchVisible: false,
      advancedTarget: ADVANCED_TARGET_ZONE,
      advancedFilters: EMPTY_ADVANCED_FILTERS,
      advancedOptions: EMPTY_ADVANCED_OPTIONS,
      advancedResults: null,
      isAdvancedLoading: false,
      isAdvancedLoadingMore: false,
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
    this._closeLegend = this._closeLegend.bind(this);
    this._snapLegendOpen = this._snapLegendOpen.bind(this);
    this._resetBearing = this._resetBearing.bind(this);
    this._openAdvancedSearch = this._openAdvancedSearch.bind(this);
    this._closeAdvancedSearch = this._closeAdvancedSearch.bind(this);
    this._changeAdvancedTarget = this._changeAdvancedTarget.bind(this);
    this._changeAdvancedFilter = this._changeAdvancedFilter.bind(this);
    this._resetAdvancedFilters = this._resetAdvancedFilters.bind(this);
    this._runAdvancedSearch = this._runAdvancedSearch.bind(this);
    this._loadMoreAdvancedResults = this._loadMoreAdvancedResults.bind(this);
    this._onSelectAdvancedResult = this._onSelectAdvancedResult.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this._loadCategoryItems();
    this._loadLegendItems();
    this._syncGeojsonStyle();
  }

  componentDidUpdate(prevProps, prevState) {
    const mapReadyChanged = prevState.isReady !== this.state.isReady;
    const mapStyleChanged = prevProps.mapStyle !== this.props.mapStyle;
    const isStagingChanged = prevProps.isStaging !== this.props.isStaging;

    if (isStagingChanged) {
      this._loadCategoryItems();
      this._loadLegendItems();
    }

    const itemsChanged =
      createSelectedCategoryItemsSignature(prevState.categoryItems) !==
      createSelectedCategoryItemsSignature(this.state.categoryItems);

    if (
      mapReadyChanged ||
      mapStyleChanged ||
      isStagingChanged ||
      itemsChanged
    ) {
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
   * A picked result is handled as a tap on the thing it names: a zone opens its
   * own detail by id, exactly as tapping that zone on the map would, and
   * anything else is reverse-geocoded from its pin into the province sheet.
   *
   * A zone needs no pin of its own to be worth opening — its detail carries the
   * pin and the geometry both — so the id alone is enough.
   */
  _onSelectSearchResult(item) {
    this._closeSearchResults();

    if (item?.kind === SEARCH_ZONE_KIND && item?.id != null) {
      this._prepareSheetForTap(item.pin?.latitude, item.pin?.longitude);
      this._loadZoneInfo(item.id);
      return;
    }

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

  async _fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  }

  _openAdvancedSearch() {
    this.setState({ isAdvancedSearchVisible: true });
    this._loadAdvancedOptions();
  }

  _closeAdvancedSearch() {
    this.setState({ isAdvancedSearchVisible: false });
  }

  /**
   * The dictionaries behind the filters never change within a session, so they
   * are fetched once, the first time the screen is opened. A dictionary that
   * fails leaves its filter with an empty list rather than blocking the rest.
   */
  async _loadAdvancedOptions() {
    if (this._hasAdvancedOptions) {
      return;
    }

    this._hasAdvancedOptions = true;
    const isStaging = this.props.isStaging;
    const sources = [
      ['zoneTypes', getZoneTypeOptionsUrl(isStaging), resolveListOptions],
      ['infraTypes', getInfraTypeOptionsUrl(isStaging), resolveListOptions],
      ['infraLayers', getInfraLayerOptionsUrl(isStaging), resolveListOptions],
      ['provinces', getProvinceOptionsUrl(isStaging), resolveMapOptions],
    ];

    const loaded = await Promise.all(
      sources.map(async ([name, url, resolve]) => {
        try {
          return [name, resolve(await this._fetchJson(url))];
        } catch (error) {
          console.warn(`Cannot load ${name} options`, error);
          return [name, []];
        }
      })
    );

    if (!this._isMounted) {
      return;
    }

    this.setState((prevState) => ({
      advancedOptions: {
        ...prevState.advancedOptions,
        ...Object.fromEntries(loaded),
      },
    }));
  }

  /**
   * The two dependent lists. Each belongs to whatever its parent filter is set
   * to, so it is refetched whenever that moves, and a reply that arrives after
   * the parent has moved again is dropped rather than shown against the wrong
   * one.
   */
  async _loadDependentOptions(name, parentName, parentValue, url, resolve) {
    if (!Number.isFinite(parentValue)) {
      return;
    }

    try {
      const json = await this._fetchJson(url);

      if (
        !this._isMounted ||
        this.state.advancedFilters[parentName] !== parentValue
      ) {
        return;
      }

      this.setState((prevState) => ({
        advancedOptions: {
          ...prevState.advancedOptions,
          [name]: resolve(json),
        },
      }));
    } catch (error) {
      console.warn(`Cannot load ${name} options`, error);
    }
  }

  _loadWardOptions(provinceId) {
    return this._loadDependentOptions(
      'wards',
      'provinceId',
      provinceId,
      getWardOptionsUrl(this.props.isStaging, provinceId),
      resolveMapOptions
    );
  }

  _loadFormTypeOptions(zoneTypeId) {
    return this._loadDependentOptions(
      'formTypes',
      'zoneTypeId',
      zoneTypeId,
      getZoneFormTypeOptionsUrl(this.props.isStaging, zoneTypeId),
      resolveListOptions
    );
  }

  // Results belong to the target they were asked for, so switching drops them.
  _changeAdvancedTarget(target) {
    this.setState({ advancedTarget: target, advancedResults: null });
    this._advancedRequestId += 1;
  }

  // Each dependent filter, by the filter it hangs off and the list it fills.
  static get ADVANCED_DEPENDENTS() {
    return {
      provinceId: {
        child: 'wardId',
        options: 'wards',
        load: '_loadWardOptions',
      },
      zoneTypeId: {
        child: 'formTypeId',
        options: 'formTypes',
        load: '_loadFormTypeOptions',
      },
    };
  }

  _changeAdvancedFilter(name, value) {
    const dependent = MFBanDoSo.ADVANCED_DEPENDENTS[name];

    this.setState((prevState) => {
      const advancedFilters = { ...prevState.advancedFilters, [name]: value };

      // A ward only means anything inside its province, and a form type only
      // inside its zone type — both are dropped when their parent moves.
      if (dependent) {
        advancedFilters[dependent.child] = null;
      }

      return {
        advancedFilters,
        advancedOptions: dependent
          ? { ...prevState.advancedOptions, [dependent.options]: [] }
          : prevState.advancedOptions,
      };
    });

    if (dependent) {
      this[dependent.load](value);
    }
  }

  _resetAdvancedFilters() {
    this._advancedRequestId += 1;
    this.setState((prevState) => ({
      advancedFilters: EMPTY_ADVANCED_FILTERS,
      advancedOptions: {
        ...prevState.advancedOptions,
        wards: [],
        formTypes: [],
      },
      advancedResults: null,
    }));
  }

  _runAdvancedSearch() {
    Keyboard.dismiss();
    this._loadAdvancedPage(1);
  }

  _loadMoreAdvancedResults() {
    const results = this.state.advancedResults;
    if (!results?.hasMore) {
      return;
    }

    this._loadAdvancedPage(results.page + 1);
  }

  /**
   * One page of results. Page 1 replaces whatever was showing; later pages are
   * appended, so a scroll to the bottom grows the list rather than reloading it.
   */
  async _loadAdvancedPage(page) {
    const requestId = this._advancedRequestId + 1;
    this._advancedRequestId = requestId;
    const isFirstPage = page <= 1;
    const isZone = this.state.advancedTarget === ADVANCED_TARGET_ZONE;
    const filters = this.state.advancedFilters;
    const url = isZone
      ? getAdvancedZoneSearchUrl(this.props.isStaging, filters, page)
      : getAdvancedInfraSearchUrl(this.props.isStaging, filters, page);

    this.setState({
      isAdvancedLoading: isFirstPage,
      isAdvancedLoadingMore: !isFirstPage,
      advancedResults: isFirstPage ? null : this.state.advancedResults,
    });

    try {
      const json = await this._fetchJson(url);
      const resolved = isZone
        ? resolveZoneResults(json, page)
        : resolveInfraResults(json, page);

      if (!this._isMounted || this._advancedRequestId !== requestId) {
        return;
      }

      this.setState((prevState) => ({
        isAdvancedLoading: false,
        isAdvancedLoadingMore: false,
        advancedResults: {
          ...resolved,
          items: isFirstPage
            ? resolved.items
            : [...(prevState.advancedResults?.items ?? []), ...resolved.items],
        },
      }));
    } catch (error) {
      if (!this._isMounted || this._advancedRequestId !== requestId) {
        return;
      }

      console.warn('Cannot run advanced search', error);
      this.setState((prevState) => ({
        isAdvancedLoading: false,
        isAdvancedLoadingMore: false,
        advancedResults: isFirstPage
          ? { items: [], total: 0, page, hasMore: false, failed: true }
          : prevState.advancedResults,
      }));
    }
  }

  /**
   * Either hit opens the sheet on its own detail — the zone one a tap on the
   * map would open, or the connectivity one, which only this search reaches.
   */
  _onSelectAdvancedResult(item) {
    this._closeAdvancedSearch();
    this._prepareSheetForTap(item.pin?.latitude, item.pin?.longitude);

    if (this.state.advancedTarget === ADVANCED_TARGET_ZONE) {
      this._loadZoneInfo(item.id);
      return;
    }

    this._loadInfraInfo(item.id);
  }

  async _loadInfraInfo(infraId) {
    const isCurrentRequest = this._beginSheetRequest(
      SHEET_KIND_INFRA,
      SHEET_INFRA_LOADING_TEXT
    );

    try {
      const json = await this._fetchJson(
        getInfraDetailUrl(this.props.isStaging, infraId)
      );
      const info = resolveInfraDetailInfo(json);

      if (isCurrentRequest() && info?.pin) {
        // The detail's own point wins over whatever the result carried, the
        // same way a zone's pin replaces the point that opened its sheet.
        this._sheetPin = info.pin;
        this._addMarker({ id: SHEET_MARKER_ID, coordinate: info.pin });
        this._fitCameraToInfra(info.pin);
      }

      this._resolveSheetResult(isCurrentRequest, info, SHEET_INFRA_EMPTY_TEXT);
    } catch (error) {
      if (!isCurrentRequest()) {
        return;
      }

      console.warn('Cannot load infrastructure detail', error);
      this._resolveSheetResult(isCurrentRequest, null, SHEET_INFRA_EMPTY_TEXT);
    }
  }

  /**
   * A point has no extent to frame, so a small box is put around it and fitted
   * like any other — which is what keeps it clear of the sheet.
   */
  _fitCameraToInfra(pin) {
    this._fitCameraToBounds({
      minLat: pin.latitude - INFRA_FOCUS_DELTA,
      minLng: pin.longitude - INFRA_FOCUS_DELTA,
      maxLat: pin.latitude + INFRA_FOCUS_DELTA,
      maxLng: pin.longitude + INFRA_FOCUS_DELTA,
    });
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

  /**
   * The legend is drawn from its own config, which describes the same
   * categories as the selector's but is the one that names and colours their
   * rules correctly. Nothing is toggled here, so the sections it resolves to
   * are what the drawer renders as they are.
   */
  async _loadLegendItems() {
    const requestId = this._legendRequestId + 1;
    this._legendRequestId = requestId;

    try {
      const response = await fetch(getLegendConfigUrl(this.props.isStaging));
      if (!response.ok) {
        throw new Error(`Failed to fetch legend config: ${response.status}`);
      }

      const json = await response.json();
      const legendSections = resolveLegendGroupSections(json);

      if (!this._isMounted || requestId !== this._legendRequestId) {
        return;
      }

      this.setState({ legendSections });
    } catch (error) {
      if (requestId !== this._legendRequestId) {
        return;
      }
      console.warn('Cannot load legend items', error);
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
    } else {
      // Nothing to point at yet — a zone picked from search, whose pin only
      // arrives with its detail. The previous target has to go all the same, or
      // the marker and the directions destination would still belong to it.
      this._sheetPin = null;
      this._removeMarker(SHEET_MARKER_ID);
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
      // The zone's own pin replaces the point the user hit as what the sheet is
      // about, so routing to it aims at the zone rather than at wherever inside
      // it the tap happened to land.
      this._sheetPin = info.pin;
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
    this.setState(
      {
        isSheetMounted: true,
        sheetSnapValue: SHEET_INITIAL_SNAP_RATIO,
      },
      () => {
        this._animateSheetTo(
          SHEET_INITIAL_SNAP_RATIO,
          SHEET_OPEN_DURATION_MS,
          Easing.out(Easing.cubic)
        );
      }
    );
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
   * The destination is whatever the sheet's marker sits on: the point it was
   * opened from — the tapped spot or a picked search result, since the province
   * payload carries no coordinate of its own — or, once a zone's detail has
   * arrived, that zone's own pin. It is kept outside state because it survives
   * sheet reloads.
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
      return;
    }

    // Same reason as _pickDirectionsEndpoint: the map has to be reachable for
    // the tap that supplies the missing point.
    this._snapSheetTo(SHEET_HALF_SNAP_RATIO);
  }

  /**
   * Collapsing is not cosmetic here: a fully open sheet covers the whole map,
   * leaving nowhere to tap for the point being picked — and the prompt banner
   * would sit over the sheet's own header, so there would be no way back
   * either.
   */
  _pickDirectionsEndpoint(endpoint) {
    this.setState({ pickingEndpoint: endpoint });
    this._snapSheetTo(SHEET_HALF_SNAP_RATIO);
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

  /**
   * Turns the map back to north. Tilt is left alone — the needle only speaks
   * for the bearing, and a 3D view the user set up is not ours to flatten.
   */
  _resetBearing() {
    this.animateCamera({ bearing: 0 });
  }

  /**
   * Follows the camera so the compass needle can hold north. Panning and
   * zooming leave the bearing alone, so this settles into no work at all
   * outside an actual rotation.
   */
  _onCameraMove(event) {
    super._onCameraMove(event);

    const bearing = event?.nativeEvent?.bearing;
    if (typeof bearing !== 'number' || !Number.isFinite(bearing)) {
      return;
    }

    if (Math.abs(bearing - this.state.mapBearing) >= 0.5) {
      this.setState({ mapBearing: bearing });
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
    if (this.state.isLegendVisible) {
      this._closeLegend();
      return;
    }

    this._openLegend();
  }

  _openLegend() {
    this.setState(
      {
        isLegendMounted: true,
        isLegendVisible: true,
      },
      () => {
        Animated.timing(this._legendAnim, {
          toValue: 1,
          duration: DRAWER_OPEN_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    );
  }

  _closeLegend() {
    Animated.timing(this._legendAnim, {
      toValue: 0,
      duration: DRAWER_CLOSE_DURATION_MS,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      if (!this._isMounted) {
        return;
      }

      this.setState({
        isLegendVisible: false,
        isLegendMounted: false,
      });
    });
  }

  _snapLegendOpen() {
    Animated.timing(this._legendAnim, {
      toValue: 1,
      duration: DRAWER_OPEN_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  _openSelector() {
    this.setState(
      {
        isSelectorMounted: true,
        isSelectorVisible: true,
      },
      () => {
        Animated.timing(this._selectorAnim, {
          toValue: 1,
          duration: DRAWER_OPEN_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    );
  }

  _closeSelector() {
    Animated.timing(this._selectorAnim, {
      toValue: 0,
      duration: DRAWER_CLOSE_DURATION_MS,
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
      duration: DRAWER_OPEN_DURATION_MS,
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
    const legendGroupSections = this.state.legendSections;
    const hasItems = Array.isArray(items) && items.length > 0;
    const hasLegendItems = legendGroupSections.length > 0;
    const showLayerButton = hasItems;
    const showSelector = this.state.isSelectorMounted && hasItems;
    const showLegendButton = hasLegendItems;
    const showLegend = this.state.isLegendMounted && hasLegendItems;
    const selectorTitle = SELECTOR_TITLE;
    const legendTitle = LEGEND_TITLE;
    const isZoneSheet = this.state.sheetKind === SHEET_KIND_ZONE;
    const projectsConfig = ZONE_PROJECT_KINDS[this.state.projectsKind];
    const showProjects = isZoneSheet && projectsConfig != null;
    const zoneTitle = showProjects ? projectsConfig.title : SHEET_ZONE_TITLE;
    const showDirections = this.state.isDirectionsVisible;
    const detailTitle = isZoneSheet
      ? zoneTitle
      : this.state.sheetKind === SHEET_KIND_INFRA
      ? SHEET_INFRA_TITLE
      : SHEET_TITLE;
    const sheetTitle = showDirections ? DIRECTIONS_ACTION_LABEL : detailTitle;
    // Only one drill-down is open at a time, so one back handler covers both.
    const projectsBack = showProjects ? this._closeZoneProjects : null;
    const backHandler = showDirections ? this._closeDirections : projectsBack;
    // Pinning the overlays to the map's own frame keeps them aligned with it
    // even when the parent pads the map inward — a SafeAreaView with default
    // edges, for one, which otherwise left the sheet short of the map's bottom.
    const mapFrame = this.state.mapFrame;
    const overlayRootStyle = mapFrame
      ? {
          position: 'absolute',
          left: mapFrame.x,
          top: mapFrame.y,
          width: mapFrame.width,
          height: mapFrame.height,
        }
      : sharedStyles.mapOverlayRoot;
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
            outputRange: [DRAWER_TRANSLATE_X, 0],
          }),
        },
      ],
    };
    // The legend rides its own value so the two drawers animate independently.
    const legendBackdropAnimatedStyle = {
      opacity: this._legendAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };
    const legendPanelAnimatedStyle = {
      transform: [
        {
          translateX: this._legendAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [DRAWER_TRANSLATE_X, 0],
          }),
        },
      ],
    };

    return (
      <React.Fragment>
        {super.render()}
        <View style={overlayRootStyle} pointerEvents="box-none">
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
          <CompassButton
            bearing={this.state.mapBearing}
            onPress={this._resetBearing}
          />
          {/* Searching for somewhere else is not what the directions view is
              for, and its pick-a-point banner takes the slot anyway. */}
          <SearchBox
            show={!showDirections}
            keyword={this.state.searchKeyword}
            sections={this.state.searchSections}
            loading={this.state.isSearchLoading}
            showResults={this.state.isSearchOpen}
            trailing={
              <AdvancedSearchButton
                isActive={this.state.isAdvancedSearchVisible}
                onPress={this._openAdvancedSearch}
              />
            }
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
          <LegendDrawer
            show={showLegend}
            title={legendTitle}
            groupSections={legendGroupSections}
            dragAnim={this._legendAnim}
            backdropAnimatedStyle={legendBackdropAnimatedStyle}
            panelAnimatedStyle={legendPanelAnimatedStyle}
            onClose={this._closeLegend}
            onDragCancel={this._snapLegendOpen}
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
          {/* Last, so it covers everything else: it is a screen, not a panel. */}
          <AdvancedSearchView
            show={this.state.isAdvancedSearchVisible}
            target={this.state.advancedTarget}
            filters={this.state.advancedFilters}
            options={this.state.advancedOptions}
            results={this.state.advancedResults}
            loading={this.state.isAdvancedLoading}
            loadingMore={this.state.isAdvancedLoadingMore}
            onClose={this._closeAdvancedSearch}
            onChangeTarget={this._changeAdvancedTarget}
            onChangeFilter={this._changeAdvancedFilter}
            onReset={this._resetAdvancedFilters}
            onSearch={this._runAdvancedSearch}
            onLoadMore={this._loadMoreAdvancedResults}
            onSelectResult={this._onSelectAdvancedResult}
          />
        </View>
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
