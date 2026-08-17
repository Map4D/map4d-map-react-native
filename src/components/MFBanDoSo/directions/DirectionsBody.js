import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { sharedStyles } from '../shared/styles';
import {
  DIRECTIONS_CHANGE_HINT,
  DIRECTIONS_DESTINATION_LABEL,
  DIRECTIONS_ENDPOINT_DESTINATION,
  DIRECTIONS_ENDPOINT_ORIGIN,
  DIRECTIONS_ORIGIN_LABEL,
  DIRECTIONS_PICK_DESTINATION_TEXT,
  DIRECTIONS_PICK_ORIGIN_TEXT,
  DIRECTIONS_STEPS_TITLE,
} from './constants';
import { ManeuverArrow } from './ManeuverArrow';
import { directionsStyles } from './styles';

function DirectionsEndpointRow({
  label,
  text,
  placeholder,
  markerStyle,
  isPicking,
  onPress,
}) {
  return (
    <Pressable
      style={[
        directionsStyles.directionsEndpointRow,
        isPicking && directionsStyles.directionsEndpointRowPicking,
      ]}
      onPress={onPress}
    >
      <View style={markerStyle} />
      <View style={directionsStyles.directionsEndpointBody}>
        <Text style={directionsStyles.directionsEndpointLabel}>{label}</Text>
        <Text
          style={[
            directionsStyles.directionsEndpointText,
            !text && directionsStyles.directionsEndpointPlaceholder,
          ]}
          numberOfLines={2}
        >
          {text || placeholder}
        </Text>
      </View>
      {/* Nothing to change yet when the row is still asking for a point. */}
      {text ? (
        <Text style={directionsStyles.directionsEndpointHint}>
          {DIRECTIONS_CHANGE_HINT}
        </Text>
      ) : null}
    </Pressable>
  );
}

function DirectionsSummary({ route }) {
  return (
    <View style={directionsStyles.directionsSummary}>
      <View style={directionsStyles.directionsSummaryRow}>
        {route.durationText ? (
          <Text style={directionsStyles.directionsDuration}>
            {route.durationText}
          </Text>
        ) : null}
        {route.distanceText ? (
          <Text style={directionsStyles.directionsDistance}>
            {route.distanceText}
          </Text>
        ) : null}
      </View>
      {route.summary ? (
        <Text style={directionsStyles.directionsSummaryVia} numberOfLines={1}>
          {`Qua ${route.summary}`}
        </Text>
      ) : null}
    </View>
  );
}

function DirectionsStep({ step }) {
  return (
    <View style={directionsStyles.directionsStepRow}>
      <ManeuverArrow maneuver={step.maneuver} />
      <View style={directionsStyles.directionsStepBody}>
        <Text style={directionsStyles.directionsStepInstruction}>
          {step.instruction}
        </Text>
        {step.distanceText ? (
          <Text style={directionsStyles.directionsStepMeta}>
            {step.streetName
              ? `${step.distanceText} · ${step.streetName}`
              : step.distanceText}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/** The route panel: its two endpoints, a summary, and the turn-by-turn list. */
function DirectionsBody({
  loading,
  statusText,
  route,
  originText,
  destinationText,
  pickingEndpoint,
  onPickEndpoint,
}) {
  const steps = route && Array.isArray(route.steps) ? route.steps : [];

  return (
    <React.Fragment>
      {/* Always drawn, even with no route yet: these rows are what a missing
          endpoint gets picked from. */}
      <View style={directionsStyles.directionsEndpoints}>
        <DirectionsEndpointRow
          label={DIRECTIONS_ORIGIN_LABEL}
          text={originText}
          placeholder={DIRECTIONS_PICK_ORIGIN_TEXT}
          markerStyle={directionsStyles.directionsEndpointDot}
          isPicking={pickingEndpoint === DIRECTIONS_ENDPOINT_ORIGIN}
          onPress={() => onPickEndpoint(DIRECTIONS_ENDPOINT_ORIGIN)}
        />
        <View style={directionsStyles.directionsEndpointLine} />
        <DirectionsEndpointRow
          label={DIRECTIONS_DESTINATION_LABEL}
          text={destinationText}
          placeholder={DIRECTIONS_PICK_DESTINATION_TEXT}
          markerStyle={directionsStyles.directionsEndpointSquare}
          isPicking={pickingEndpoint === DIRECTIONS_ENDPOINT_DESTINATION}
          onPress={() => onPickEndpoint(DIRECTIONS_ENDPOINT_DESTINATION)}
        />
      </View>

      {loading || !route ? (
        <View style={sharedStyles.statusBox}>
          {loading ? <ActivityIndicator color="#b91c1c" /> : null}
          <Text style={sharedStyles.statusText}>{statusText}</Text>
        </View>
      ) : null}

      {route ? <DirectionsSummary route={route} /> : null}

      {steps.length > 0 ? (
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>
            {DIRECTIONS_STEPS_TITLE}
          </Text>
        </View>
      ) : null}

      {steps.map((step) => (
        <DirectionsStep key={step.key} step={step} />
      ))}
    </React.Fragment>
  );
}

export { DirectionsBody };
