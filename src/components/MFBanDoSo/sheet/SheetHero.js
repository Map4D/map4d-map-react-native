import React from 'react';
import { Image, Text, View } from 'react-native';

import { sheetStyles } from './styles';

// A figure this long is a sentence, not a number: it wraps inside its card in
// a paragraph style instead of being truncated to one line.
const STAT_PROSE_VALUE_LENGTH = 24;

/**
 * The banner both sheets open with: image, scrim, a badge, a title and an
 * optional subtitle. `footer` is where the zone sheet hangs its code chip.
 */
function SheetHero({
  bannerImage,
  badge,
  title,
  titleLines = 1,
  subtitle,
  footer,
}) {
  return (
    <View
      style={[
        sheetStyles.sheetHero,
        !bannerImage && sheetStyles.sheetHeroPlain,
      ]}
    >
      {bannerImage ? (
        <React.Fragment>
          <Image
            style={sheetStyles.sheetHeroImage}
            source={{ uri: bannerImage }}
            resizeMode="cover"
          />
          <View style={sheetStyles.sheetHeroScrim} />
        </React.Fragment>
      ) : null}
      <View style={sheetStyles.sheetHeroContent}>
        {badge ? (
          <View style={sheetStyles.sheetHeroBadge}>
            <Text style={sheetStyles.sheetHeroBadgeText}>{badge}</Text>
          </View>
        ) : null}
        <Text style={sheetStyles.sheetHeroTitle} numberOfLines={titleLines}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={sheetStyles.sheetHeroSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
        {footer}
      </View>
    </View>
  );
}

/**
 * The card grid both sheets show their headline figures in. Values short
 * enough to read as a figure keep their line cap; anything longer is prose,
 * so it wraps in full rather than being cut off.
 */
function SheetStatGrid({ stats, valueLines = 1 }) {
  return (
    <View style={sheetStyles.sheetStatGrid}>
      {stats.map((stat, index) => {
        const isProse = `${stat.value}`.length > STAT_PROSE_VALUE_LENGTH;

        return (
          <View
            key={`${stat.label}-${index}`}
            style={sheetStyles.sheetStatCard}
          >
            <View style={sheetStyles.sheetStatCardInner}>
              <Text style={sheetStyles.sheetStatLabel}>{stat.label}</Text>
              <Text
                style={[
                  sheetStyles.sheetStatValue,
                  isProse && sheetStyles.sheetStatValueProse,
                ]}
                numberOfLines={isProse ? undefined : valueLines}
              >
                {stat.value}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export { SheetHero, SheetStatGrid };
