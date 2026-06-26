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

function normalizeLayerIds(layerIds) {
  if (!Array.isArray(layerIds)) {
    return [];
  }

  return layerIds
    .map((layerId) => String(layerId).trim())
    .filter((layerId) => layerId.length > 0);
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

function createCategoryItemsSignature(categoryItems) {
  if (!Array.isArray(categoryItems)) {
    return '';
  }

  const normalized = categoryItems.map((item) => ({
    key: item?.key || '',
    checked: !!item?.checked,
    style: item?.style || null,
  }));

  return JSON.stringify(normalized);
}

function buildGeojsonStyle(mapStyle, sourceUrl, layerIds, categoryItems) {
  const result = toStyleObject(mapStyle);
  result.sources = result.sources || {};

  const prevGeojsonSource =
    typeof result.sources[GEOJSON_SOURCE_NAME] === 'object' &&
    result.sources[GEOJSON_SOURCE_NAME] !== null
      ? result.sources[GEOJSON_SOURCE_NAME]
      : {};

  result.sources[GEOJSON_SOURCE_NAME] = {
    ...prevGeojsonSource,
    type: 'vector',
  };

  if (typeof sourceUrl === 'string' && sourceUrl.trim().length > 0) {
    result.sources[GEOJSON_SOURCE_NAME].url = sourceUrl;
  }

  const nextLayerKeys = normalizeLayerIds(layerIds);
  const selectedLayerKeySet = new Set(nextLayerKeys);
  const nextCategoryItems = Array.isArray(categoryItems) ? categoryItems : [];
  const checkedItems = nextCategoryItems.filter((item) =>
    selectedLayerKeySet.has(String(item?.key || ''))
  );

  const checkedStyles = generateLayerStyle(GEOJSON_SOURCE_NAME, checkedItems);

  const baseLayers = (Array.isArray(result.layers) ? result.layers : []).filter(
    (layer) => {
      if (!layer || typeof layer !== 'object') {
        return false;
      }

      if (layer.source_layer === 'pois') {
        return false;
      }

      const metadata = layer.metadata;
      return !(metadata && metadata.managedBy === 'MFGeojsonView');
    }
  );

  result.layers = baseLayers.concat(checkedStyles);

  return JSON.stringify(result);
}

export { buildGeojsonStyle, createCategoryItemsSignature, isSameLayerIds };
