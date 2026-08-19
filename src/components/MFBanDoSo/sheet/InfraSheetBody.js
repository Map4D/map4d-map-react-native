import React from 'react';
import { Text, View } from 'react-native';

import { NO_GEOMETRY_LABEL } from '../shared/constants';
import { sharedStyles } from '../shared/styles';
import { INFRA_DESCRIPTION_TITLE, ZONE_MAIN_INFO_TITLE } from './constants';
import { SheetHero, SheetStatGrid } from './SheetHero';
import { sheetStyles } from './styles';

/** The connectivity feature detail: what an advanced-search hit opens. */
function InfraSheetBody({ info }) {
  const stats = Array.isArray(info.stats) ? info.stats : [];
  const introParagraphs = Array.isArray(info.introParagraphs)
    ? info.introParagraphs
    : [];

  return (
    <React.Fragment>
      <SheetHero
        bannerImage={info.bannerImage}
        badge={info.typeLabel}
        title={info.name}
        titleLines={2}
        subtitle={info.subtitle}
      />

      {info.status || !info.hasGeometry ? (
        <View style={sheetStyles.zoneStatusRow}>
          {info.status ? (
            <View
              style={[
                sheetStyles.zoneStatusPill,
                !info.isPublished && sheetStyles.zoneStatusPillMuted,
              ]}
            >
              <Text
                style={[
                  sheetStyles.zoneStatusText,
                  !info.isPublished && sheetStyles.zoneStatusTextMuted,
                ]}
              >
                {info.status}
              </Text>
            </View>
          ) : null}
          {!info.hasGeometry ? (
            <View
              style={[
                sheetStyles.zoneStatusPill,
                sheetStyles.zoneGeometryMissingPill,
              ]}
            >
              <Text
                style={[
                  sheetStyles.zoneStatusText,
                  sheetStyles.zoneGeometryMissingText,
                ]}
              >
                {NO_GEOMETRY_LABEL}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {stats.length > 0 ? (
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>{ZONE_MAIN_INFO_TITLE}</Text>
          <SheetStatGrid stats={stats} valueLines={2} />
        </View>
      ) : null}

      {introParagraphs.length > 0 ? (
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>
            {INFRA_DESCRIPTION_TITLE}
          </Text>
          {introParagraphs.map((paragraph, index) => (
            <View
              key={`${paragraph}-${index}`}
              style={[
                sheetStyles.sheetOverviewBox,
                index > 0 && sheetStyles.zoneParagraphSpacing,
              ]}
            >
              <Text style={sheetStyles.sheetOverviewText}>{paragraph}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </React.Fragment>
  );
}

export { InfraSheetBody };
