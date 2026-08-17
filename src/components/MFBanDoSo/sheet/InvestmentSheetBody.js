import React from 'react';
import { Text, View } from 'react-native';

import { sharedStyles } from '../shared/styles';
import { SHEET_INDUSTRIAL_ZONES_TITLE, SHEET_STATS_TITLE } from './constants';
import { SheetHero, SheetStatGrid } from './SheetHero';
import { sheetStyles } from './styles';

/** The province detail: what a tap on bare map opens. */
function InvestmentSheetBody({ info }) {
  const stats = Array.isArray(info.stats) ? info.stats : [];
  const sectors = Array.isArray(info.sectors) ? info.sectors : [];
  const hasContact = !!(info.contactPhone || info.contactEmail);

  return (
    <React.Fragment>
      <SheetHero
        bannerImage={info.bannerImage}
        badge={info.code}
        title={info.name}
        subtitle={info.subtitle}
      />

      {stats.length > 0 ? (
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>{SHEET_STATS_TITLE}</Text>
          <SheetStatGrid stats={stats} />
        </View>
      ) : null}

      {info.overviewContent ? (
        <View style={sharedStyles.section}>
          {info.overviewTitle ? (
            <Text style={sharedStyles.sectionTitle}>{info.overviewTitle}</Text>
          ) : null}
          <View style={sheetStyles.sheetOverviewBox}>
            <Text style={sheetStyles.sheetOverviewText}>
              {info.overviewContent}
            </Text>
          </View>
        </View>
      ) : null}

      {sectors.length > 0 ? (
        <View style={sharedStyles.section}>
          {info.sectorsTitle ? (
            <Text style={sharedStyles.sectionTitle}>{info.sectorsTitle}</Text>
          ) : null}
          <View style={sheetStyles.sheetChipRow}>
            {sectors.map((sector, index) => (
              <View key={`${sector}-${index}`} style={sheetStyles.sheetChip}>
                <Text style={sheetStyles.sheetChipText}>{sector}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {info.industrialZones != null ? (
        <View style={sharedStyles.section}>
          <View style={sheetStyles.sheetCountCard}>
            <Text style={sheetStyles.sheetCountLabel}>
              {SHEET_INDUSTRIAL_ZONES_TITLE}
            </Text>
            <Text
              style={sheetStyles.sheetCountValue}
            >{`${info.industrialZones}`}</Text>
          </View>
        </View>
      ) : null}

      {hasContact ? (
        <View style={sharedStyles.section}>
          {info.contactTitle ? (
            <Text style={sharedStyles.sectionTitle}>{info.contactTitle}</Text>
          ) : null}
          <View style={sheetStyles.sheetContactBox}>
            {info.contactPhone ? (
              <View style={sheetStyles.sheetContactRow}>
                <Text style={sheetStyles.sheetContactIcon}>✆</Text>
                <Text style={sheetStyles.sheetContactText} numberOfLines={1}>
                  {info.contactPhone}
                </Text>
              </View>
            ) : null}
            {info.contactEmail ? (
              <View style={sheetStyles.sheetContactRow}>
                <Text style={sheetStyles.sheetContactIcon}>✉</Text>
                <Text style={sheetStyles.sheetContactText} numberOfLines={1}>
                  {info.contactEmail}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}
    </React.Fragment>
  );
}

export { InvestmentSheetBody };
