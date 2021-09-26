/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Text,
  Button,
  NativeModules,
} from 'react-native';

import {MFMapView, MFMarker, MFCircle, MFPOI} from 'react-native-map4d-map'

export default class MapScreen extends React.Component {

  constructor(props){
    super(props)
    console.log("MapScreen iiiiiiiiiii!!!");
    this.state = {
      rotate: 0
    }

    this.onCameraMove = this.onCameraMove.bind(this);
    this.onCameraIdle = this.onCameraIdle.bind(this);
    this.onCameraMoveStart = this.onCameraMoveStart.bind(this);
  }

  handleClick() {
    this.fitBounds();
    // this.enable3DMode();
    // this.updateCircle1();
    // this.updatePolyline();
  }

  async pointForCoordinate() {
    const pt = await this.map.pointForCoordinate({latitude: 10.7881732, longitude: 106.7000933})
    console.log("point: " + pt.x + "  " + pt.y)
  }

  async coordinateForPoint() {
    const coordinate = await this.map.coordinateForPoint({x: 0, y: 0})
    console.log("coordinate: " + coordinate.latitude + "  " + coordinate.longitude)
  }

  rotateImage() {
    this.setState({
      rotate: this.state.rotate + 10
    })
  }

  updateCircle1() {
    this.circle1.setCenter({latitude: 16.07205799574648, longitude: 108.22610914707184})
    this.circle1.setRadius(300)
    this.circle1.setFillColor('#FF00007F')
    this.circle1.setStrokeColor('#0000FFFF')
    this.circle1.setStrokeWidth(1)
  }

  updatePolyline() {
    this.polyline.setColor("#00FFFF7F")
    this.polyline.setLineStyle("solid")
    this.polyline.setWidth(5)
    let coordinates = [
      { longitude: 108.22186589241028, latitude: 16.07102188912311 },
      { longitude: 108.21941971778870, latitude: 16.07288790810347 },
      { longitude: 108.22152256965637, latitude: 16.07507349922961 },
      { longitude: 108.22343230247496, latitude: 16.07437246318347 },
      { longitude: 108.22534203529358, latitude: 16.07627968781805 }
    ]
    this.polyline.setCoordinates(coordinates)
  }

  async enable3DMode() {
    const mode3d = await this.map.is3DMode();
    this.map.enable3DMode(!mode3d);
  }

  animateCamera() {
    this.map.animateCamera({
      tilt: 0,
      bearing: 0,
      zoom: 17,
      center: {latitude: 10.772002, longitude: 106.704294}
    })
  }

  fitBounds() {
    this.map.fitBounds({
      bounds: {
        northEast: { latitude: 16.07102188912311, longitude: 108.22186589241028 },
        southWest: { latitude: 16.07302188912311, longitude: 108.25186589241028 }
      },
      padding: { top: 1, right: 2, bottom: 3, left: 4 }
    })
  }

  async cameraForBounds() {
    const camera = await this.map.cameraForBounds({
      bounds: {
        northEast: { latitude: 16.09723733448094, longitude: 108.22108268737793 },
        southWest: { latitude: 16.09410362136537, longitude: 108.22616815567017 }
      },
      padding: { top: 1, right: 2, bottom: 3, left: 4 }
    })
    console.log('Camera:', camera)
    this.map.moveCamera(camera)
  }

  async getCamera() {
    const camera = await this.map.getCamera();
    console.log(camera)
    return camera
  }

  onPressCircle(event) {
    console.log('press circle:', event.nativeEvent)
  }

  onPressPolyline(event) {
    console.log('press polyline:', event.nativeEvent)
  }

  onPressPOI(event) {
    console.log('press poi:', event.nativeEvent)
  }

  onPressMapView(event) {
    console.log('on press coordinate:', event.nativeEvent)
  }

  moveCamera() {    
    this.map.moveCamera({
      tilt: 0,
      bearing: 0,
      zoom: 17,
      center: {latitude: 10.7881732, longitude: 106.7000933}
    })
  }

  onCameraMove(e) {
    //rotate during camera move
    this.setState({
      rotate: -e.nativeEvent.bearing || 0
    })
  }

  onCameraIdle(e) {
    //rotate at the end of camera move
    this.setState({
      rotate: -e.nativeEvent.bearing || 0
    })
  }

  onCameraMoveStart(e) {
    console.log(e.nativeEvent);
  }


  render() {
    // let markerIcon = require('./assets/ic_marker_tracking.png')
    let markerIcon = 'https://b.thumbs.redditmedia.com/F82n9T2HtoYxNmxbe1CL0RKxBdeUEw-HVyd-F-Lb91o.png'
    return(
      <SafeAreaView style={this.styles.safeView}>        
        <MFMapView ref={ref => this.map = ref}
          onMapReady={
            data => {
              this.map.setMyLocationEnabled(true)
              this.getCamera();
              this.moveCamera()
            }
          }
          onPoiPress={(event)=>{console.log('place:', event.nativeEvent)}}
          onCameraMove={this.onCameraMove}
          onCameraMoveStart={this.onCameraMoveStart}
          onCameraIdle={this.onCameraIdle}
          onModeChange={(event)=>{console.log('mode change:', event.nativeEvent)}}
          style={this.styles.container}
          onPress={this.onPressMapView}
          showsMyLocationButton={true}
          showsBuildings={true}
          camera={{
            center: {latitude: 10.7881732, longitude: 106.7000933},
            zoom: 16,
            bearing: 0,
            tilt: 0,
          }}
          >         
          <MFMarker
            draggable={true}
            ref={ref => this.marker = ref}
            onDragStart={
              (event) => {
                console.log("startDrag: ", event.nativeEvent)
            }}
            onDrag={
              (event) => {
                console.log("drag: ", event.nativeEvent)
            }}
            onDragEnd={
              (event) => {
                console.log("dragEnd: ", event.nativeEvent)
            }}
            anchor={{x: 0.0, y: 0.0}}
            coordinate={{latitude: 10.7881732, longitude: 106.7000933}}>
              <View style={{
              width:30,
              height:35,
              borderWidth:1,
              borderColor:'yellow'
            }}>
              <Image source={{ uri: 'https://b.thumbs.redditmedia.com/F82n9T2HtoYxNmxbe1CL0RKxBdeUEw-HVyd-F-Lb91o.png' }}
            style={{width:25, height:31}} resizeMode={'contain'} />
            </View>
          </MFMarker>
          <MFCircle
            onPress={this.onPressCircle}
            center={{latitude: 10.7881732, longitude: 106.7000933}}
            radius={50}
            visible={true}
            fillColor="#F00FF07F"
            strokeColor="#0000FF08" strokeWidth={2}
            zIndex ={3.0} />

          <MFMarker
            coordinate={{latitude: 10.7881732, longitude: 106.7000933}}
            draggable={true}
            anchor={{x: 0.5, y: 1.0}}
            userData={{name: "Marker 1", arr:[1, 5, 9], obj:{x:10, y:11}}}
            onPress={(event) => {console.log('on press marker:', event.nativeEvent)}}
            zIndex={20}
          />
          {/*<MFMarker
            coordinate={{latitude: 16.073034, longitude: 108.224315}}
            draggable={true}
            userData={{name: "Marker 1", arr:[1, 5, 9], obj:{x:10, y:11}}}
            onPress={(event) => {console.log('on press marker:', event.nativeEvent)}}
            onDragStart={
              (event) => {
                console.log("startDrag: ", event.nativeEvent)
            }}
            onDrag={
              (event) => {
                console.log("drag: ", event.nativeEvent)
            }}
            onDragEnd={
              (event) => {
                console.log("dragEnd: ", event.nativeEvent)
            }}
            zIndex={20}
          />
          <MFMarker icon={{uri: markerIcon, width: 32, height: 32}} coordinate={{latitude: 16.071364, longitude: 108.224487}} zIndex={3.0} visible={true}></MFMarker>
          <MFCircle ref={ref => this.circle1 = ref}
            onPress={this.onPressCircle}
            userData={{name: "Circle 1", arr:[1, 5, 9], obj:{x:10, y:11}}}
            center={{latitude: 16.071364, longitude: 108.224487}}
            radius={150}
            zIndex={2.0}
            visible={true}
            fillColor="#F00FF07F"
            strokeColor="#00FF00FF"
            strokeWidth={2.5} />
          <MFCircle
            onPress={this.onPressCircle}
            center={{latitude: 16.071805413037357, longitude: 108.22395265102386}}
            radius={50}
            strokeColor="#0000FFFF" strokeWidth={2}
            zIndex ={3.0} />
          <MFPolyline ref={ref => this.polyline = ref}
            coordinates={[
              { longitude: 108.22033166885375, latitude: 16.07134148477669 },
              { longitude: 108.22500944137573, latitude: 16.07196005555040 },
              { longitude: 108.22421550750732, latitude: 16.07571267699986 },
              { longitude: 108.22346448898315, latitude: 16.07554772809458 },
              { longitude: 108.22365760803223, latitude: 16.07426936943880 }
            ]}
            lineStyle="dotted"
            width={5}
            color="#FF00007F"
            onPress={this.onPressPolyline}
            zIndex={4.0}
            userData={{ten: "Dung", id: 10}}
            visible={true}
          />
          <MFPOI ref={ref => this.poi = ref}
            userData={{name: "POI 1", arr:[1, 5, 9], obj:{x:10, y:11}}}
            coordinate={{latitude: 16.075671439786362, longitude: 108.22427988052367}}
            title="Map4D React-Native"
            titleColor="#00FF00FF"
            poiType="cafe"
            onPress={this.onPressPOI}
            zIndex={10}
          /> */}
        </MFMapView>
        <Button title={"Rotate image"} onPress={() => this.rotateImage()}>
        </Button>
        <Button title={"Move Camera"} onPress={() => this.handleClick()}>
        </Button>
        <Button
        title="Go to Details"
        onPress={() => {
          Navigation.push(this.props.componentId, {
            component: {
              name: 'Home',
              options: {
                topBar: {
                  title: {
                    text: 'Home'
                  }
                }
              }
            }

        })
          
      }
    }
      />

      <Image source={require('./assets/compass.png')}
      style={[this.styles.image, {transform: [{ rotate: `${this.state.rotate}deg` }]}]}/>
      </SafeAreaView>
    )
  }

styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 50,
    height:50,
    position:'absolute',
    right:20,
    top:30,
    
}
});

}

