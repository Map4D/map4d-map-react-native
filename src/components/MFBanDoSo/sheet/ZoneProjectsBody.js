import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { sharedStyles } from '../shared/styles';
import {
  ZONE_PROJECTS_COUNT_SUFFIX,
  ZONE_PROJECTS_SUBTITLE,
  ZONE_PROJECT_AREA_LABEL,
  ZONE_PROJECT_INVESTMENT_LABEL,
} from './constants';
import { sheetStyles } from './styles';

function ZoneProjectsHeader({ zoneName, loading, count }) {
  if (!zoneName) {
    return null;
  }

  return (
    <View style={sheetStyles.zoneProjectsHeader}>
      <Text style={sheetStyles.zoneProjectsHeaderTitle} numberOfLines={2}>
        {zoneName}
      </Text>
      <View style={sheetStyles.zoneProjectsHeaderRow}>
        <Text style={sheetStyles.zoneProjectsHeaderSubtitle} numberOfLines={1}>
          {ZONE_PROJECTS_SUBTITLE}
        </Text>
        {/* The count is only meaningful once the request has settled, so the
            badge waits rather than flashing "0 du an" while loading. */}
        {loading ? null : (
          <View style={sheetStyles.zoneProjectsCountBadge}>
            <Text style={sheetStyles.zoneProjectsCountText}>
              {`${count}${ZONE_PROJECTS_COUNT_SUFFIX}`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function ZoneProjectStat({ label, value }) {
  return (
    <View style={sheetStyles.zoneProjectStatCell}>
      <Text style={sheetStyles.zoneProjectStatLabel} numberOfLines={2}>
        {label}
      </Text>
      <Text style={sheetStyles.zoneProjectStatValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ZoneProjectCard({ project }) {
  return (
    <View style={sheetStyles.zoneProjectCard}>
      <View style={sheetStyles.zoneProjectCardHeader}>
        <Text style={sheetStyles.zoneProjectName} numberOfLines={2}>
          {project.name}
        </Text>
        {project.status ? (
          <View style={sheetStyles.zoneProjectStatusPill}>
            <Text style={sheetStyles.zoneProjectStatusText}>
              {project.status}
            </Text>
          </View>
        ) : null}
      </View>

      {project.code ? (
        <Text style={sheetStyles.zoneProjectCode}>{project.code}</Text>
      ) : null}

      {project.sector ? (
        <View style={sheetStyles.zoneProjectSector}>
          <Text style={sheetStyles.zoneProjectSectorText}>
            {project.sector}
          </Text>
        </View>
      ) : null}

      {project.area || project.investment ? (
        <View style={sheetStyles.zoneProjectStatRow}>
          {project.area ? (
            <ZoneProjectStat
              label={ZONE_PROJECT_AREA_LABEL}
              value={project.area}
            />
          ) : null}
          {project.investment ? (
            <ZoneProjectStat
              label={ZONE_PROJECT_INVESTMENT_LABEL}
              value={project.investment}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/** The drilled-down project list a zone's two buttons open. */
function ZoneProjectsBody({ zoneName, loading, statusText, projects }) {
  const header = (
    <ZoneProjectsHeader
      zoneName={zoneName}
      loading={loading}
      count={projects.length}
    />
  );

  if (loading || projects.length === 0) {
    return (
      <React.Fragment>
        {header}
        <View style={sharedStyles.statusBox}>
          {loading ? <ActivityIndicator color="#b91c1c" /> : null}
          <Text style={sharedStyles.statusText}>{statusText}</Text>
        </View>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {header}
      <View style={sheetStyles.zoneProjectList}>
        {projects.map((project) => (
          <ZoneProjectCard key={project.key} project={project} />
        ))}
      </View>
    </React.Fragment>
  );
}

export { ZoneProjectsBody };
