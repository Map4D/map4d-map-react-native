import React from 'react';
import {
  Animated,
  Easing,
} from 'react-native';
import {
  LEGEND_TITLE,
  SELECTOR_CLOSE_DURATION_MS,
  SELECTOR_DRAWER_TRANSLATE_X,
  SELECTOR_OPEN_DURATION_MS,
  SELECTOR_TITLE,
  getCategoryConfigUrl,
  getSourceUrl,
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
import { MFMapView } from './MFMapView';
import {
  LayerButton,
  LegendButton,
  LegendPanel,
  SelectorDrawer,
} from './MFBanDoSo/ui';
import {
  buildGeojsonStyle,
} from './internal/GeojsonStyleUtils';

class MFBanDoSo extends MFMapView {
  constructor(props) {
    super(props);
    this._appliedGeojsonStyle = null;
    this._isMounted = false;
    this._categoryRequestId = 0;
    this._selectorAnim = new Animated.Value(0);
    this.state = {
      ...this.state,
      categoryItems: [],
      expandedGroupKeys: {},
      groupTitleByKey: {},
      groupOrderedKeys: [],
      isLegendVisible: false,
      isSelectorVisible: false,
      isSelectorMounted: false,
    };

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
