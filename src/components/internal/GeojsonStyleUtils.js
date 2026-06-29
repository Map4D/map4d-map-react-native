import defaultRoadmapStyle from './DefaultRoadmapStyle';

const GEOJSON_SOURCE_NAME = 'geojson';

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toStyleObject(mapStyle) {
  const defaultStyle = deepClone(defaultRoadmapStyle);
  if (mapStyle == null) {
    return defaultStyle;
  }

  if (typeof mapStyle === 'string') {
    try {
      return JSON.parse(mapStyle);
    } catch (error) {
      return defaultStyle;
    }
  }

  if (typeof mapStyle === 'object' && !Array.isArray(mapStyle)) {
    try {
      return deepClone(mapStyle);
    } catch (error) {
      return defaultStyle;
    }
  }

  return defaultStyle;
}

function generateLayerStyle(source, items) {
  const layers = [];

  items.forEach((item) => {
    const key = item?.key;
    const style = item?.style;
    if (!key || !style || typeof style !== 'object') {
      return;
    }

    if (Array.isArray(style.line)) {
      style.line.forEach((line, index) => {
        layers.push({
          id: `${key}-line-${index}`,
          type: 'line',
          source,
          source_layer: line.layer,
          filter: line.filter,
          draw: line.draw,
        });
      });
    }

    if (Array.isArray(style.fill)) {
      style.fill.forEach((fill, index) => {
        layers.push({
          id: `${key}-fill-${index}`,
          type: 'fill',
          source,
          source_layer: fill.layer,
          filter: fill.filter,
          draw: fill.draw,
        });
      });
    }

    if (Array.isArray(style.symbol)) {
      style.symbol.forEach((symbol, index) => {
        layers.push({
          id: `${key}-symbol-${index}`,
          type: 'symbol',
          source,
          source_layer: symbol.layer,
          filter: symbol.filter,
          draw: symbol.draw,
        });
      });
    }
  });

  return layers;
}

function createCategoryItemsSignature(items) {
  if (!Array.isArray(items)) {
    return '';
  }

  const normalized = items.map((item) => ({
    key: item?.key || '',
    checked: !!item?.checked,
    style: item?.style || null,
  }));

  return JSON.stringify(normalized);
}

function buildGeojsonStyle(mapStyle, sourceUrl, items) {
  const result = toStyleObject(mapStyle);
  result.sources = result.sources || {};

  const defaultGeojsonSource =
    typeof result.sources[GEOJSON_SOURCE_NAME] === 'object' &&
    result.sources[GEOJSON_SOURCE_NAME] !== null
      ? result.sources[GEOJSON_SOURCE_NAME]
      : {};

  result.sources[GEOJSON_SOURCE_NAME] = {
    ...defaultGeojsonSource,
    type: 'vector',
  };

  if (typeof sourceUrl === 'string' && sourceUrl.trim().length > 0) {
    result.sources[GEOJSON_SOURCE_NAME].url = sourceUrl;
  }

  const normalizeItems = Array.isArray(items) ? items : [];
  const layerStyle = generateLayerStyle(GEOJSON_SOURCE_NAME, normalizeItems);

  const baseLayers = (Array.isArray(result.layers) ? result.layers : []).filter(
    (layer) => {
      if (!layer || typeof layer !== 'object') {
        return false;
      }

      if (layer.source_layer === 'pois') {
        return false;
      }

      const metadata = layer.metadata;
      return !(metadata && metadata.managedBy === 'MFBanDoSo');
    }
  );

  result.layers = baseLayers.concat(layerStyle);

  return JSON.stringify(result);
}

export { buildGeojsonStyle, createCategoryItemsSignature };
