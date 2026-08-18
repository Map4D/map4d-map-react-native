import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  ADVANCED_EMPTY_TEXT,
  ADVANCED_ERROR_TEXT,
  ADVANCED_FORM_TYPE_DISABLED_HINT,
  ADVANCED_FORM_TYPE_LABEL,
  ADVANCED_IDLE_TEXT,
  ADVANCED_INFRA_LAYER_LABEL,
  ADVANCED_INFRA_TYPE_LABEL,
  ADVANCED_KEYWORD_LABEL,
  ADVANCED_KEYWORD_PLACEHOLDER,
  ADVANCED_LOADING_TEXT,
  ADVANCED_LOAD_MORE_THRESHOLD,
  ADVANCED_MORE_LOADING_TEXT,
  ADVANCED_PROVINCE_LABEL,
  ADVANCED_RESET_ACTION,
  ADVANCED_RESULT_COUNT_SUFFIX,
  ADVANCED_SEARCH_ACTION,
  ADVANCED_SEARCH_TITLE,
  ADVANCED_STATUS_LABEL,
  ADVANCED_STATUS_OPTIONS,
  ADVANCED_TARGET_INFRA,
  ADVANCED_TARGET_LABELS,
  ADVANCED_TARGET_ZONE,
  ADVANCED_WARD_DISABLED_HINT,
  ADVANCED_WARD_LABEL,
  ADVANCED_ZONE_TYPE_LABEL,
} from './constants';
import { OptionPicker, ScreenHeader, SelectField } from './OptionPicker';
import { advancedSearchStyles as styles } from './styles';

function TargetTabs({ target, onChange }) {
  return (
    <View style={styles.targetRow}>
      {[ADVANCED_TARGET_ZONE, ADVANCED_TARGET_INFRA].map((value, index) => {
        const isActive = value === target;

        return (
          <Pressable
            key={value}
            style={[
              styles.targetTab,
              index > 0 && styles.targetTabSpacing,
              isActive && styles.targetTabActive,
            ]}
            onPress={() => onChange(value)}
          >
            <Text
              style={[styles.targetLabel, isActive && styles.targetLabelActive]}
              numberOfLines={1}
            >
              {ADVANCED_TARGET_LABELS[value]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ResultCard({ item, onPress }) {
  const tags = [item.typeLabel, item.statusLabel].filter(Boolean);

  return (
    <Pressable style={styles.resultCard} onPress={() => onPress(item)}>
      <Text style={styles.resultName} numberOfLines={2}>
        {item.name}
      </Text>
      {tags.length > 0 ? (
        <View style={styles.resultMetaRow}>
          {tags.map((tag) => (
            <View key={tag} style={styles.resultTag}>
              <Text style={styles.resultTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

function ResultStatus({ text, loading }) {
  return (
    <View style={styles.statusRow}>
      {loading ? <ActivityIndicator color="#b91c1c" /> : null}
      <Text style={styles.statusText}>{text}</Text>
    </View>
  );
}

/** Which message stands in for an empty list depends on why it is empty. */
function resolveStatusText(results) {
  if (results == null) {
    return ADVANCED_IDLE_TEXT;
  }

  return results.failed ? ADVANCED_ERROR_TEXT : ADVANCED_EMPTY_TEXT;
}

/**
 * Advanced search as a screen of its own, covering the map: a target switch, a
 * filter form per target, and the paged result list. Every filter is optional —
 * the endpoint answers an unfiltered search with everything it has.
 */
function AdvancedSearchView({
  show,
  target,
  filters,
  options,
  results,
  loading,
  loadingMore,
  onClose,
  onChangeTarget,
  onChangeFilter,
  onReset,
  onSearch,
  onLoadMore,
  onSelectResult,
}) {
  // Which filter's list is open, if any. Only one can be, so it is a name
  // rather than a flag per field.
  const [openField, setOpenField] = useState(null);

  if (!show) {
    return null;
  }

  const isZone = target === ADVANCED_TARGET_ZONE;
  const items = results?.items ?? [];
  const fields = isZone
    ? [
        {
          name: 'zoneTypeId',
          label: ADVANCED_ZONE_TYPE_LABEL,
          options: options.zoneTypes,
        },
        {
          name: 'formTypeId',
          label: ADVANCED_FORM_TYPE_LABEL,
          options: options.formTypes,
          // Form types are numbered within their zone type, so one can only be
          // picked — or even meant — once a zone type is.
          disabled: !Number.isFinite(filters.zoneTypeId),
          hint: ADVANCED_FORM_TYPE_DISABLED_HINT,
        },
        {
          name: 'status',
          label: ADVANCED_STATUS_LABEL,
          options: ADVANCED_STATUS_OPTIONS,
        },
        {
          name: 'provinceId',
          label: ADVANCED_PROVINCE_LABEL,
          options: options.provinces,
        },
        {
          name: 'wardId',
          label: ADVANCED_WARD_LABEL,
          options: options.wards,
          // The ward list is fetched for the chosen province, so there is
          // nothing to choose from until one is.
          disabled: !Number.isFinite(filters.provinceId),
          hint: ADVANCED_WARD_DISABLED_HINT,
        },
      ]
    : [
        {
          name: 'infraTypeId',
          label: ADVANCED_INFRA_TYPE_LABEL,
          options: options.infraTypes,
        },
        {
          name: 'infraLayerId',
          label: ADVANCED_INFRA_LAYER_LABEL,
          options: options.infraLayers,
        },
      ];
  const openConfig = fields.find((field) => field.name === openField);

  const onScroll = (event) => {
    if (loading || loadingMore || !results?.hasMore) {
      return;
    }

    const { layoutMeasurement, contentOffset, contentSize } =
      event?.nativeEvent ?? {};
    if (!layoutMeasurement || !contentOffset || !contentSize) {
      return;
    }

    const remaining =
      contentSize.height - contentOffset.y - layoutMeasurement.height;
    if (remaining <= ADVANCED_LOAD_MORE_THRESHOLD) {
      onLoadMore();
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={ADVANCED_SEARCH_TITLE} onClose={onClose} />
      <TargetTabs target={target} onChange={onChangeTarget} />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={80}
        onScroll={onScroll}
      >
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>{ADVANCED_KEYWORD_LABEL}</Text>
          <TextInput
            style={styles.input}
            value={filters.keyword}
            placeholder={ADVANCED_KEYWORD_PLACEHOLDER}
            placeholderTextColor="#9ca3af"
            returnKeyType="search"
            autoCorrect={false}
            onChangeText={(value) => onChangeFilter('keyword', value)}
            onSubmitEditing={onSearch}
          />
        </View>

        {fields.map((field) => (
          <SelectField
            key={field.name}
            label={field.label}
            value={filters[field.name]}
            options={field.options}
            disabled={field.disabled}
            hint={field.hint}
            onPress={() => setOpenField(field.name)}
            onClear={() => onChangeFilter(field.name, null)}
          />
        ))}

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionButton, styles.actionButtonGhost]}
            onPress={onReset}
          >
            <Text style={[styles.actionLabel, styles.actionLabelGhost]}>
              {ADVANCED_RESET_ACTION}
            </Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={onSearch}>
            <Text style={styles.actionLabel}>{ADVANCED_SEARCH_ACTION}</Text>
          </Pressable>
        </View>

        {results != null && items.length > 0 ? (
          <View style={styles.resultHeader}>
            <Text style={styles.resultCount}>
              {`${results.total}${ADVANCED_RESULT_COUNT_SUFFIX}`}
            </Text>
          </View>
        ) : null}

        {loading ? <ResultStatus text={ADVANCED_LOADING_TEXT} loading /> : null}

        {!loading && items.length === 0 ? (
          <ResultStatus text={resolveStatusText(results)} />
        ) : null}

        {!loading
          ? items.map((item) => (
              <ResultCard key={item.key} item={item} onPress={onSelectResult} />
            ))
          : null}

        {loadingMore ? (
          <ResultStatus text={ADVANCED_MORE_LOADING_TEXT} loading />
        ) : null}
      </ScrollView>

      {openConfig ? (
        <OptionPicker
          title={openConfig.label}
          options={openConfig.options}
          value={filters[openConfig.name]}
          onSelect={(value) => {
            onChangeFilter(openConfig.name, value);
            setOpenField(null);
          }}
          onClose={() => setOpenField(null)}
        />
      ) : null}
    </View>
  );
}

export { AdvancedSearchView };
