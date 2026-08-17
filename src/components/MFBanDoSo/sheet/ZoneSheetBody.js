import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { sharedStyles } from '../shared/styles';
import {
  ZONE_ADDRESS_LABEL,
  ZONE_ADVANTAGES_TITLE,
  ZONE_ATTRACTED_PROJECTS_LABEL,
  ZONE_ATTRACTED_SECTORS_TITLE,
  ZONE_INTRO_TITLE,
  ZONE_INVESTMENT_PROJECTS_LABEL,
  ZONE_INVESTOR_TITLE,
  ZONE_LOCATION_TITLE,
  ZONE_MAIN_INFO_TITLE,
  ZONE_PROJECT_KIND_ATTRACTED,
  ZONE_PROJECT_KIND_INVESTMENT,
  ZONE_RESTRICTED_SECTORS_TITLE,
} from './constants';
import { SheetHero, SheetStatGrid } from './SheetHero';
import { sheetStyles } from './styles';

function ZoneChipSection({ title, items, danger }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <View style={sharedStyles.section}>
      <Text style={sharedStyles.sectionTitle}>{title}</Text>
      <View style={sheetStyles.sheetChipRow}>
        {items.map((item, index) => (
          <View
            key={`${item}-${index}`}
            style={[
              sheetStyles.sheetChip,
              danger && sheetStyles.zoneChipDanger,
            ]}
          >
            <Text
              style={[
                sheetStyles.sheetChipText,
                danger && sheetStyles.zoneChipDangerText,
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ZoneProjectButtons({ onPressProjects }) {
  return (
    <View style={sheetStyles.zoneProjectButtonRow}>
      <Pressable
        style={sheetStyles.zoneProjectButton}
        onPress={() => onPressProjects(ZONE_PROJECT_KIND_INVESTMENT)}
      >
        <Text style={sheetStyles.zoneProjectButtonLabel}>
          {ZONE_INVESTMENT_PROJECTS_LABEL}
        </Text>
      </Pressable>
      <Pressable
        style={[
          sheetStyles.zoneProjectButton,
          sheetStyles.zoneProjectButtonPrimary,
        ]}
        onPress={() => onPressProjects(ZONE_PROJECT_KIND_ATTRACTED)}
      >
        <Text
          style={[
            sheetStyles.zoneProjectButtonLabel,
            sheetStyles.zoneProjectButtonLabelPrimary,
          ]}
        >
          {ZONE_ATTRACTED_PROJECTS_LABEL}
        </Text>
      </Pressable>
    </View>
  );
}

/** The KCN/KKT detail: what a tap on a zone feature opens. */
function ZoneSheetBody({ info, onPressProjects }) {
  const stats = Array.isArray(info.stats) ? info.stats : [];
  const introParagraphs = Array.isArray(info.introParagraphs)
    ? info.introParagraphs
    : [];
  const investors = Array.isArray(info.investors) ? info.investors : [];

  return (
    <React.Fragment>
      <SheetHero
        bannerImage={info.bannerImage}
        badge={info.typeLabel}
        title={info.name}
        titleLines={2}
        subtitle={info.subtitle}
        footer={
          info.code ? (
            <View style={sheetStyles.zoneHeroCode}>
              <Text style={sheetStyles.zoneHeroCodeText}>{info.code}</Text>
            </View>
          ) : null
        }
      />

      {info.status ? (
        <View style={sheetStyles.zoneStatusRow}>
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
        </View>
      ) : null}

      {stats.length > 0 ? (
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>{ZONE_MAIN_INFO_TITLE}</Text>
          <SheetStatGrid stats={stats} valueLines={2} />
        </View>
      ) : null}

      {info.address ? (
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>{ZONE_LOCATION_TITLE}</Text>
          <View style={sheetStyles.zoneLabeledBox}>
            <Text style={sheetStyles.zoneLabeledBoxLabel}>
              {ZONE_ADDRESS_LABEL}
            </Text>
            <Text style={sheetStyles.zoneLabeledBoxText}>{info.address}</Text>
          </View>
        </View>
      ) : null}

      {introParagraphs.length > 0 ? (
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>{ZONE_INTRO_TITLE}</Text>
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

      <ZoneChipSection
        title={ZONE_ATTRACTED_SECTORS_TITLE}
        items={info.attractedSectors}
      />
      <ZoneChipSection
        title={ZONE_RESTRICTED_SECTORS_TITLE}
        items={info.restrictedSectors}
        danger
      />
      <ZoneChipSection title={ZONE_ADVANTAGES_TITLE} items={info.advantages} />

      {investors.length > 0 ? (
        <View style={sharedStyles.section}>
          <Text style={sharedStyles.sectionTitle}>{ZONE_INVESTOR_TITLE}</Text>
          {investors.map((investor, index) => (
            <View
              key={`${investor.name}-${index}`}
              style={[
                sheetStyles.zoneInvestorCard,
                index > 0 && sheetStyles.zoneParagraphSpacing,
              ]}
            >
              <Text style={sheetStyles.zoneInvestorName} numberOfLines={2}>
                {investor.name}
              </Text>
              {investor.year ? (
                <Text style={sheetStyles.zoneInvestorYear}>
                  {investor.year}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      <ZoneProjectButtons onPressProjects={onPressProjects} />
    </React.Fragment>
  );
}

export { ZoneSheetBody };
