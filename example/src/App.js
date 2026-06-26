import { MFGeojsonView, MFBuilding } from 'react-native-map4d-map-dtqg';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Button } from 'react-native';

function App() {
  const mapRef = useRef(null);
  const [categoryItems, setCategoryItems] = useState([]);

  const geojsonSourceUrl =
    'https://cmcdtqg-gateway.dieuhanhso.vn/staging/bds/api/tile/vector/{z}/{x}/{y}.pbf?p=1';
  const categoryConfigUrl =
    'https://cmcdtqg-gateway.dieuhanhso.vn/staging/bds/api/BanDo/dau-tu/category-config';

  const camera = {
    latitude: 20.531421,
    longitude: 106.002009,
  };

  const onDataSourceFeaturePress = async (e) => {
    console.log('Press Data Source Feature:', e.nativeEvent);
  };

  const onPressBuilding = async (e) => {
    console.log('Press Building:', e.nativeEvent);
  };

  const getCategoryItems = async () => {
    try {
      const response = await fetch(categoryConfigUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch category config: ${response.status}`);
      }

      const json = await response.json();
      const data = json?.data ?? json;

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.items)) {
        return data.items;
      }

      if (Array.isArray(json?.items)) {
        return json.items;
      }

      return [];
    } catch (error) {
      console.warn('Cannot load category items', error);
      return [];
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadCategoryItems = async () => {
      const items = await getCategoryItems();
      if (isMounted) {
        setCategoryItems(items);
      }
    };

    loadCategoryItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeView}>
      <MFGeojsonView
        style={styles.container}
        sourceUrl={geojsonSourceUrl}
        layerIds={[
          'khu-cong-nghiep',
          'khu-kinh-te',
          'khu-cong-nghiep-sinh-thai',
          'khu-thuong-mai-tu-do',
        ]}
        categoryItems={categoryItems}
        camera={{
          center: camera,
          zoom: 8,
          bearing: 0,
          tilt: 0,
        }}
        mapType="roadmap"
        ref={mapRef}
        onDataSourceFeaturePress={onDataSourceFeaturePress}
      >
        <MFBuilding
          onPress={onPressBuilding}
          coordinate={{
            latitude: 16.103254,
            longitude: 108.214835,
          }}
          modelUrl="https://maptile.s3-sgn10.fptcloud.com/sdk/models/5db6b4798b4711141457d8a9.obj"
          textureUrl="https://maptile.s3-sgn10.fptcloud.com/sdk/textures/5db6b4798b4711141457d8ab.jpg"
          name="Building test"
        />
      </MFGeojsonView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default App;
