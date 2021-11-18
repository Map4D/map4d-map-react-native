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

import {MFMapView} from './components/MFMapView'
import {MFMarker} from './components/MFMarker'
import {MFCircle} from './components/MFCircle'
import {MFPolyline} from './components/MFPolyline'
import {MFPolygon} from './components/MFPolygon'
import {MFPOI} from './components/MFPOI'
import {MFDirectionsRenderer} from './components/MFDirectionsRenderer'
import { Navigation } from 'react-native-navigation';

//From NPM
/*
import {MFMapView, MFMarker, MFCircle, MFPolyline} from 'react-native-map4d-map'
*/
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
    this.onShouldChangeMapMode = this.onShouldChangeMapMode.bind(this);
  }

  handleClick() {
    // this.getBounds();
    // this.fitBounds();
    // this.enable3DMode();
    // this.updateCircle1();
    // this.updatePolyline();
    this.setDirections()
  }

  setDirections() {
    let json = '{"code":"ok","result":{"routes":[{"legs":[{"distance":{"text":"385.81300000000005m","value":385.81300000000005},"duration":{"text":"29 giây","value":29.0},"endAddress":"Chặng dừng chân 1","startAddress":"Phan Bội Châu","endLocation":{"lng":108.21955,"lat":16.07723},"startLocation":{"lng":108.22159,"lat":16.07881},"steps":[{"distance":{"text":"1.96m","value":1.96},"duration":{"text":"","value":0.0},"endLocation":{"lng":108.22159,"lat":16.07883},"startLocation":{"lng":108.22159,"lat":16.07881},"htmlInstructions":"Tiếp tục theo Phan Bội Châu","maneuver":"straight","polyline":"qkcaB}_psSC?","travelMode":"car","streetName":"Phan Bội Châu"},{"distance":{"text":"232.295m","value":232.295},"duration":{"text":"18 giây","value":18.0},"endLocation":{"lng":108.21943,"lat":16.07853},"startLocation":{"lng":108.22159,"lat":16.07883},"htmlInstructions":"Rẽ trái vào Nguyễn Du","maneuver":"turn-left","polyline":"ukcaB}_psSRzBf@rH","travelMode":"car","streetName":"Nguyễn Du"},{"distance":{"text":"144.917m","value":144.917},"duration":{"text":"10 giây","value":10.0},"endLocation":{"lng":108.21961,"lat":16.07723},"startLocation":{"lng":108.21943,"lat":16.07853},"htmlInstructions":"Rẽ trái vào Lê Lợi","maneuver":"turn-left","polyline":"yicaBmrosSbGc@","travelMode":"car","streetName":"Lê Lợi"},{"distance":{"text":"6.641m","value":6.641},"duration":{"text":"","value":0.0},"endLocation":{"lng":108.21955,"lat":16.07723},"startLocation":{"lng":108.21961,"lat":16.07723},"htmlInstructions":"Rẽ phải vào Lý Tự Trọng","maneuver":"turn-right","polyline":"uacaBqsosS?J","travelMode":"car","streetName":"Lý Tự Trọng"},{"distance":{"text":"0m","value":0.0},"duration":{"text":"","value":0.0},"endLocation":{"lng":108.21955,"lat":16.07723},"startLocation":{"lng":108.21955,"lat":16.07723},"htmlInstructions":"Chặng dừng chân 1","maneuver":"reached-via","polyline":"uacaBesosS","travelMode":"car","streetName":""}]},{"distance":{"text":"687.8860000000001m","value":687.8860000000001},"duration":{"text":"44 giây","value":44.0},"endAddress":"Kết thúc!","startAddress":"Lý Tự Trọng","endLocation":{"lng":108.22352,"lat":16.07535},"startLocation":{"lng":108.21955,"lat":16.07723},"steps":[{"distance":{"text":"6.641m","value":6.641},"duration":{"text":"","value":0.0},"endLocation":{"lng":108.21961,"lat":16.07723},"startLocation":{"lng":108.21955,"lat":16.07723},"htmlInstructions":"Quay đầu xe vào Lý Tự Trọng","maneuver":"straight","polyline":"uacaBesosS?K","travelMode":"car","streetName":"Lý Tự Trọng"},{"distance":{"text":"276.562m","value":276.562},"duration":{"text":"19 giây","value":19.0},"endLocation":{"lng":108.21994,"lat":16.07477},"startLocation":{"lng":108.21961,"lat":16.07723},"htmlInstructions":"Rẽ phải vào Lê Lợi","maneuver":"turn-right","polyline":"uacaBqsosSjNaA","travelMode":"car","streetName":"Lê Lợi"},{"distance":{"text":"388.954m","value":388.954},"duration":{"text":"23 giây","value":23.0},"endLocation":{"lng":108.2235,"lat":16.07549},"startLocation":{"lng":108.21994,"lat":16.07477},"htmlInstructions":"Rẽ trái vào Quang Trung","maneuver":"turn-left","polyline":"irbaBsuosSoCgU","travelMode":"car","streetName":"Quang Trung"},{"distance":{"text":"15.729m","value":15.729},"duration":{"text":"","value":0.0},"endLocation":{"lng":108.22352,"lat":16.07535},"startLocation":{"lng":108.2235,"lat":16.07549},"htmlInstructions":"Rẽ phải vào Trần Phú","maneuver":"turn-right","polyline":"yvbaB{kpsSZC","travelMode":"car","streetName":"Trần Phú"},{"distance":{"text":"0m","value":0.0},"duration":{"text":"","value":0.0},"endLocation":{"lng":108.22352,"lat":16.07535},"startLocation":{"lng":108.22352,"lat":16.07535},"htmlInstructions":"Kết thúc!","maneuver":"finish","polyline":"}ubaB_lpsS","travelMode":"car","streetName":""}]}],"overviewPolyline":"qkcaB}_psSC?RzBf@rHbGc@?J?KjNaAoCgUZC","summary":"Phan Bội Châu","distance":{"text":"1.07km","value":1073.699},"duration":{"text":"1 phút 14 giây","value":74.0},"snappedWaypoints":[{"lng":108.22159,"lat":16.07881},{"lng":108.21955,"lat":16.07723},{"lng":108.22352,"lat":16.07535}]}],"geocoded_waypoints":null}}'
    this.directions.setDirections(json)
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

  async getBounds() {
    const bounds = await this.map.getBounds()
    console.log('bounds:', bounds)
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

  onPressBuilding(event) {
    console.log('press map building:', event.nativeEvent)
  }

  onPressPlace(event) {
    console.log('press map place:', event.nativeEvent)
  }

  onPressMapView(event) {
    console.log('on press coordinate:', event.nativeEvent)
  }

  moveCamera() {
    this.map.moveCamera({
      tilt: 0,
      bearing: 0,
      zoom: 16,
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

  onShouldChangeMapMode(e) {
    this.enable3DMode()
  }


  render() {
    let markerIcon1 = require('./assets/ic_marker_tracking.png')
    let markerIcon2 = 'https://b.thumbs.redditmedia.com/F82n9T2HtoYxNmxbe1CL0RKxBdeUEw-HVyd-F-Lb91o.png'
    return(
      <SafeAreaView style={this.styles.safeView}>        
        <MFMapView ref={ref => this.map = ref}
          onMapReady={
            data => {
              this.map.setMyLocationEnabled(true)
              // this.map.setPOIsEnabled(false)
              // this.getCamera();
              // this.moveCamera()
            }
          }
          mapType="roadmap"
          // onShouldChangeMapMode={this.onShouldChangeMapMode}
          onPoiPress={(event)=>{console.log('press map poi:', event.nativeEvent)}}
          onBuildingPress={this.onPressBuilding}
          onPlacePress={this.onPressPlace}
          onCameraMove={this.onCameraMove}
          onCameraMoveStart={this.onCameraMoveStart}
          onCameraIdle={this.onCameraIdle}
          onModeChange={(event)=>{console.log('mode change:', event.nativeEvent)}}
          style={this.styles.container}
          onPress={this.onPressMapView}
          showsMyLocationButton={true}
          showsBuildings={true}
          showsPOIs={true}
          camera={{
            center: { latitude: 16.077491, longitude: 108.221735 },
            // center: {latitude: 10.7881732, longitude: 106.7000933},
            zoom: 16,
            bearing: 0,
            tilt: 0,
          }}
          >
          <MFDirectionsRenderer
            ref={ref => this.directions = ref}
            routes={[
              [
                { latitude: 16.078814, longitude: 108.221592 },
                { latitude: 16.078972, longitude: 108.223034 },
                { latitude: 16.075353, longitude: 108.223513 },
              ],
              [
                { latitude: 16.078814, longitude: 108.221592 },
                { latitude: 16.077491, longitude: 108.221735 },
                { latitude: 16.077659, longitude: 108.223212 },
                { latitude: 16.075353, longitude: 108.223513 }
              ]
            ]}
            activedIndex={1}
            activeStrokeWidth={10}
            activeStrokeColor="#edf75c"
            activeOutlineWidth={2}
            activeOutlineColor="#e3b314"
            inactiveStrokeWidth={10}
            inactiveStrokeColor="#3d1294"
            inactiveOutlineWidth={1}
            inactiveOutlineColor="#1f113b"
            originPOIOptions={{
              coordinate: { latitude: 16.079774, longitude: 108.220534 },
              title: "Begin Position",
              titleColor: "#ff0000",
              icon:{ uri: require('./assets/marker-pink.png') },
              visible: true
            }}
            destinationPOIOptions={{
              title: "End",
              titleColor: "#0c4503",
              icon:{ uri: require('./assets/marker-green.png') },
              visible: true
            }}
            onPress={
              (event) => {
                console.log("Press Directions Renderer:", event.nativeEvent)
                this.directions.setActivedIndex(event.nativeEvent.routeIndex)
              }
            }
          />
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
              borderColor:'yellow'}}>
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
          */}
          <MFPOI ref={ref => this.poi = ref}
            userData={{name: "POI 1", arr:[1, 5, 9], obj:{x:10, y:11}}}
            coordinate={{latitude: 16.075671439786362, longitude: 108.22427988052367}}
            title="Map4D React-Native"
            titleColor="#00FF00FF"
            // poiType="cafe"
            icon={{uri: markerIcon2}}
            onPress={this.onPressPOI}
            zIndex={10}
          />
          <MFPolyline ref={ref => this.polyline = ref}
            coordinates={[
              { longitude: 106.69870376586914, latitude: 10.787569188027405 },
              { longitude: 106.69998586177826, latitude: 10.787247741194244 },
              { longitude: 106.70092999935150, latitude: 10.78798548751378 }
            ]}
            // lineStyle="dotted"
            width={15}
            color="#00FFFFFF"
            onPress={this.onPressPolyline}
            zIndex={4.0}
            userData={{ten: "Dung", id: 10}}
            visible={true}
          />
          <MFPolygon
            coordinates={[
              { longitude: 106.70058667659760, latitude: 10.789113181961360 },
              { longitude: 106.70086562633514, latitude: 10.787869556069147 },
              { longitude: 106.70188486576080, latitude: 10.787816859943165 },
              { longitude: 106.70218527317047, latitude: 10.788417595231817 },
              { longitude: 106.70169711112976, latitude: 10.789234382514742 },
              { longitude: 106.70058667659760, latitude: 10.789113181961360 }
            ]}
            holes={[
              [
                { longitude: 106.70073151588440, latitude: 10.788754849604677 },
                { longitude: 106.70108020305634, latitude: 10.788754849604677 },
                { longitude: 106.70108020305634, latitude: 10.789055216462020 },
                { longitude: 106.70073151588440, latitude: 10.789055216462020 },
                { longitude: 106.70073151588440, latitude: 10.788754849604677 }
              ],
              [
                { longitude: 106.70157909393310, latitude: 10.788449212845343 },
                { longitude: 106.70140743255614, latitude: 10.788127766952915 },
                { longitude: 106.70179367065430, latitude: 10.788059262046180 },
                { longitude: 106.70190095901489, latitude: 10.788375438408615 },
                { longitude: 106.70157909393310, latitude: 10.788449212845343 }
              ]
            ]}
            fillColor="#00FF00FF"
            strokeColor="#FF0000FF"
            strokeWidth={5}
            visible={true}
            zIndex={7}
            userData={{data: 1}}
            onPress={(e) => { console.log('Press Polygon:', e.nativeEvent) }}
          />
        </MFMapView>
        <Button title={"Rotate image"} onPress={() => this.rotateImage()}>
        </Button>
        <Button title={"Click Action"} onPress={() => this.handleClick()}>
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
          })}
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

