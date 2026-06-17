import PropTypes from 'prop-types';
import { MFMapView } from './MFMapView';
import defaultRoadmapStyle from './internal/DefaultRoadmapStyle';

const GEOJSON_SOURCE_NAME = 'geojson';

const GEOJSON_LAYER_TEMPLATES = [
  {
    id: 'line',
    source: GEOJSON_SOURCE_NAME,
    source_layer: '',
    type: 'line',
    draw: {
      color: '$line-color',
      outline_color: '$outline-color',
      outline_width: '$outline-width',
      width: '$line-width',
    },
  },
  {
    id: 'area',
    source: GEOJSON_SOURCE_NAME,
    source_layer: '',
    type: 'fill',
    draw: {
      color: '$fill-color',
    },
  },
  {
    id: 'point',
    source: GEOJSON_SOURCE_NAME,
    source_layer: '',
    type: 'symbol',
    draw: {
      icon_image: '$icon-image',
      text_size: '$text-size',
      icon_color: '$icon-color',
      text_color: '$text-color',
      icon_overlap: true,
      use_direct_icon_url: true,
    },
  },
  {
    id: 'label',
    source: GEOJSON_SOURCE_NAME,
    source_layer: '',
    type: 'label',
    draw: {
      text_size: '$label-text-size',
      text_color: '$label-text-color',
      text_field: '@label-property-name',
      position_type: '$label-position-type',
    },
  },
];

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeLayerIds(layerIds) {
  if (!Array.isArray(layerIds)) {
    return [];
  }

  return layerIds
    .map((layerId) => String(layerId).trim())
    .filter((layerId) => layerId.length > 0);
}

function toStyleObject(mapStyle) {
  if (mapStyle == null) {
    return deepClone(defaultRoadmapStyle);
  }

  if (typeof mapStyle === 'string') {
    try {
      return JSON.parse(mapStyle);
    } catch (error) {
      return deepClone(defaultRoadmapStyle);
    }
  }

  if (typeof mapStyle === 'object' && !Array.isArray(mapStyle)) {
    try {
      return deepClone(mapStyle);
    } catch (error) {
      return deepClone(defaultRoadmapStyle);
    }
  }

  return deepClone(defaultRoadmapStyle);
}

function createManagedLayers(layerIds) {
  return layerIds.flatMap((layerId, layerIndex) =>
    GEOJSON_LAYER_TEMPLATES.map((template, templateIndex) => ({
      ...deepClone(template),
      id: `mf-geojson-${template.id}-${layerIndex}-${templateIndex}`,
      source_layer: layerId,
      metadata: {
        managedBy: 'MFGeojsonView',
      },
    }))
  );
}

function buildGeojsonStyle(mapStyle, sourceUrl, layerIds) {
  const nextStyle = toStyleObject(mapStyle);
  nextStyle.sources = nextStyle.sources || {};
  nextStyle.layers = Array.isArray(nextStyle.layers) ? nextStyle.layers : [];

  const prevGeojsonSource =
    typeof nextStyle.sources[GEOJSON_SOURCE_NAME] === 'object' &&
    nextStyle.sources[GEOJSON_SOURCE_NAME] !== null
      ? nextStyle.sources[GEOJSON_SOURCE_NAME]
      : {};

  nextStyle.sources[GEOJSON_SOURCE_NAME] = {
    type: 'geojson',
    ...prevGeojsonSource,
  };

  if (typeof sourceUrl === 'string' && sourceUrl.trim().length > 0) {
    nextStyle.sources[GEOJSON_SOURCE_NAME].url = sourceUrl;
  }

  const baseLayers = nextStyle.layers.filter((layer) => {
    const metadata = layer && typeof layer === 'object' ? layer.metadata : null;
    return !(metadata && metadata.managedBy === 'MFGeojsonView');
  });

  const managedLayers = createManagedLayers(normalizeLayerIds(layerIds));
  nextStyle.layers = baseLayers.concat(managedLayers);

  return JSON.stringify(nextStyle);
}

function isSameLayerIds(prevLayerIds, nextLayerIds) {
  const prev = normalizeLayerIds(prevLayerIds);
  const next = normalizeLayerIds(nextLayerIds);

  if (prev.length !== next.length) {
    return false;
  }

  for (let index = 0; index < prev.length; index += 1) {
    if (prev[index] !== next[index]) {
      return false;
    }
  }

  return true;
}

class MFGeojsonView extends MFMapView {
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
    const layerIdsChanged = !isSameLayerIds(
      prevProps.layerIds,
      this.props.layerIds
    );

    if (
      mapReadyChanged ||
      mapStyleChanged ||
      sourceUrlChanged ||
      layerIdsChanged
    ) {
      this._syncGeojsonStyle();
    }
  }

  _syncGeojsonStyle() {
    if (!this.state.isReady) {
      return;
    }

    const geojsonStyle = buildGeojsonStyle(
      this.props.mapStyle,
      this.props.sourceUrl,
      this.props.layerIds
    );

    if (!geojsonStyle || geojsonStyle === this._appliedGeojsonStyle) {
      return;
    }

    this._appliedGeojsonStyle = geojsonStyle;
    this._runCommand('setMapStyle', [geojsonStyle]);
  }
}

MFGeojsonView.propTypes = {
  ...MFMapView.propTypes,
  layerIds: PropTypes.arrayOf(PropTypes.string),
  sourceUrl: PropTypes.string.isRequired,
};

MFGeojsonView.defaultProps = {
  layerIds: [],
};

export { MFGeojsonView };
