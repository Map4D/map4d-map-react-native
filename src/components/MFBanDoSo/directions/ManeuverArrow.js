import React from 'react';
import { View } from 'react-native';

import { directionsStyles } from './styles';

// Which arrow each maneuver gets. Values seen in real payloads: straight,
// keep-left, keep-right, turn-left, turn-right, turn-sharp-left, finish; the
// rest are listed so a route through them still draws something sensible.
// Every left-hand turn reuses its right-hand shape mirrored.
const MANEUVER_ARROWS = {
  'straight': { shape: 'straight' },
  'depart': { shape: 'straight' },
  'start': { shape: 'straight' },
  'finish': { shape: 'finish' },
  'turn-right': { shape: 'turn' },
  'roundabout-right': { shape: 'turn' },
  'turn-left': { shape: 'turn', mirrored: true },
  'roundabout-left': { shape: 'turn', mirrored: true },
  'keep-right': { shape: 'slight' },
  'fork-right': { shape: 'slight' },
  'turn-slight-right': { shape: 'slight' },
  'merge': { shape: 'slight' },
  'keep-left': { shape: 'slight', mirrored: true },
  'fork-left': { shape: 'slight', mirrored: true },
  'turn-slight-left': { shape: 'slight', mirrored: true },
  'turn-sharp-right': { shape: 'sharp' },
  'turn-sharp-left': { shape: 'sharp', mirrored: true },
  'uturn-right': { shape: 'uturn' },
  'uturn-left': { shape: 'uturn', mirrored: true },
};

/** The bars each arrow is drawn from: a stem, an optional arm, and a head. */
function ArrowShape({ shape }) {
  if (shape === 'turn') {
    return (
      <React.Fragment>
        <View style={directionsStyles.arrowTurnStem} />
        <View style={directionsStyles.arrowTurnArm} />
        <View style={directionsStyles.arrowTurnHead} />
      </React.Fragment>
    );
  }

  if (shape === 'slight') {
    return (
      <React.Fragment>
        <View style={directionsStyles.arrowSlightStem} />
        <View style={directionsStyles.arrowSlightArm} />
        <View style={directionsStyles.arrowSlightHead} />
      </React.Fragment>
    );
  }

  if (shape === 'sharp') {
    return (
      <React.Fragment>
        <View style={directionsStyles.arrowSharpStem} />
        <View style={directionsStyles.arrowSharpArm} />
        <View style={directionsStyles.arrowSharpHead} />
      </React.Fragment>
    );
  }

  if (shape === 'uturn') {
    return (
      <React.Fragment>
        <View style={directionsStyles.arrowTurnStem} />
        <View style={directionsStyles.arrowTurnArm} />
        <View style={directionsStyles.arrowUturnDrop} />
        <View style={directionsStyles.arrowUturnHead} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <View style={directionsStyles.arrowStraightStem} />
      <View style={directionsStyles.arrowStraightHead} />
    </React.Fragment>
  );
}

/** The arrow shown beside a step, chosen from that step's maneuver. */
function ManeuverArrow({ maneuver }) {
  const arrow = MANEUVER_ARROWS[maneuver] || MANEUVER_ARROWS.straight;

  if (arrow.shape === 'finish') {
    return (
      <View style={directionsStyles.directionsStepIcon}>
        <View style={directionsStyles.directionsFinishMark} />
      </View>
    );
  }

  return (
    <View style={directionsStyles.directionsStepIcon}>
      <View
        style={[
          directionsStyles.directionsArrow,
          arrow.mirrored && directionsStyles.directionsArrowMirrored,
        ]}
      >
        <ArrowShape shape={arrow.shape} />
      </View>
    </View>
  );
}

export { ManeuverArrow };
