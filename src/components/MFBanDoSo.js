import PropTypes from 'prop-types';
import { MFMapView } from './MFMapView';
import {
  buildGeojsonStyle,
  createCategoryItemsSignature,
} from './internal/GeojsonStyleUtils';

const FilterStylePropType = PropTypes.shape({
  kind: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  kind_detail: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
});

const DrawLinePropType = PropTypes.shape({
  color: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
});

const DrawFillPropType = PropTypes.shape({
  color: PropTypes.string,
});

const DrawSymbolPropType = PropTypes.shape({
  icon_image: PropTypes.string,
  icon_index: PropTypes.number,
  icon_color: PropTypes.string,
  use_direct_icon_url: PropTypes.bool,
});

const CategoryStylePropType = PropTypes.shape({
  line: PropTypes.arrayOf(
    PropTypes.shape({
      layer: PropTypes.string,
      filter: FilterStylePropType,
      draw: DrawLinePropType,
    })
  ),
  fill: PropTypes.arrayOf(
    PropTypes.shape({
      layer: PropTypes.string,
      filter: FilterStylePropType,
      draw: DrawFillPropType,
    })
  ),
  symbol: PropTypes.arrayOf(
    PropTypes.shape({
      layer: PropTypes.string,
      filter: FilterStylePropType,
      draw: DrawSymbolPropType,
    })
  ),
});

const CategoryItemPropType = PropTypes.shape({
  key: PropTypes.string,
  title: PropTypes.string,
  group: PropTypes.string,
  order: PropTypes.number,
  checked: PropTypes.bool,
  style: CategoryStylePropType,
});

class MFBanDoSo extends MFMapView {
  constructor(props) {
    super(props);
    this._appliedGeojsonStyle = null;
  }

  componentDidMount() {
    this._syncGeojsonStyle();
  }

  componentDidUpdate(prevProps, prevState) {
    const mapReadyChanged = prevState.isReady !== this.state.isReady;
    const mapStyleChanged = prevProps.mapStyle !== this.props.mapStyle;
    const sourceUrlChanged = prevProps.sourceUrl !== this.props.sourceUrl;
    const itemsChanged =
      createCategoryItemsSignature(prevProps.items) !==
      createCategoryItemsSignature(this.props.items);

    if (
      mapReadyChanged ||
      mapStyleChanged ||
      sourceUrlChanged ||
      itemsChanged
    ) {
      this._syncGeojsonStyle();
    }
  }

  _syncGeojsonStyle() {
    if (!this.state.isReady) {
      return;
    }

    const items = this.props.items || [];

    const geojsonStyle = buildGeojsonStyle(
      this.props.mapStyle,
      this.props.sourceUrl,
      items
    );

    if (!geojsonStyle || geojsonStyle === this._appliedGeojsonStyle) {
      return;
    }

    this._appliedGeojsonStyle = geojsonStyle;
    this._runCommand('setMapStyle', [geojsonStyle]);
  }
}

MFBanDoSo.propTypes = {
  ...MFMapView.propTypes,
  items: PropTypes.arrayOf(CategoryItemPropType),
  sourceUrl: PropTypes.string.isRequired,
};

export { MFBanDoSo };
