import React from 'react';
import { Image, Text, View } from 'react-native';

import { sheetStyles } from './styles';

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
    <View style={sheetStyles.sheetHero}>
      {bannerImage ? (
        <Image
          style={sheetStyles.sheetHeroImage}
          source={{ uri: bannerImage }}
          resizeMode="cover"
        />
      ) : null}
      <View style={sheetStyles.sheetHeroScrim} />
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

/** The card grid both sheets show their headline figures in. */
function SheetStatGrid({ stats, valueLines = 1 }) {
  return (
    <View style={sheetStyles.sheetStatGrid}>
      {stats.map((stat, index) => (
        <View key={`${stat.label}-${index}`} style={sheetStyles.sheetStatCard}>
          <View style={sheetStyles.sheetStatCardInner}>
            <Text style={sheetStyles.sheetStatLabel} numberOfLines={2}>
              {stat.label}
            </Text>
            <Text style={sheetStyles.sheetStatValue} numberOfLines={valueLines}>
              {stat.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export { SheetHero, SheetStatGrid };
