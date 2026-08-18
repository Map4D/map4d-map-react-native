import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { sharedStyles } from '../shared/styles';
import {
  SEARCH_EMPTY_TEXT,
  SEARCH_LOADING_TEXT,
  SEARCH_PLACEHOLDER,
  SEARCH_ZONE_KIND,
} from './constants';
import { searchStyles } from './styles';

function SearchResultRow({ item, isFirst, onPress }) {
  const isZone = item.kind === SEARCH_ZONE_KIND;

  return (
    <Pressable
      style={[
        searchStyles.searchRow,
        !isFirst && searchStyles.searchRowDivider,
      ]}
      onPress={() => onPress(item)}
    >
      <View
        style={[
          searchStyles.searchRowIcon,
          isZone && searchStyles.searchRowIconZone,
        ]}
      >
        <View
          style={
            isZone
              ? searchStyles.searchRowIconSquare
              : searchStyles.searchRowIconDot
          }
        />
      </View>
      <View style={searchStyles.searchRowBody}>
        <Text style={searchStyles.searchRowTitle} numberOfLines={1}>
          {item.name}
        </Text>
        {item.typeLabel ? (
          <Text style={searchStyles.searchRowSubtitle} numberOfLines={1}>
            {item.typeLabel}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function SearchClearButton({ onPress }) {
  return (
    <Pressable style={searchStyles.searchClearButton} onPress={onPress}>
      <View style={searchStyles.searchClearCircle}>
        <View
          style={[
            searchStyles.searchClearBar,
            { transform: [{ rotate: '45deg' }] },
          ]}
        />
        <View
          style={[
            searchStyles.searchClearBar,
            { transform: [{ rotate: '-45deg' }] },
          ]}
        />
      </View>
    </Pressable>
  );
}

function SearchResults({ sections, loading, onSelectResult }) {
  const hasResults = sections.length > 0;

  return (
    <View style={searchStyles.searchResults}>
      {loading || !hasResults ? (
        <View style={searchStyles.searchStatusRow}>
          {loading ? <ActivityIndicator color="#b91c1c" /> : null}
          <Text style={searchStyles.searchStatusText}>
            {loading ? SEARCH_LOADING_TEXT : SEARCH_EMPTY_TEXT}
          </Text>
        </View>
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled">
          {sections.map((group) => (
            <View key={group.key}>
              {group.title ? (
                <Text style={searchStyles.searchGroupTitle}>{group.title}</Text>
              ) : null}
              {group.items.map((item, index) => (
                <SearchResultRow
                  key={item.key}
                  item={item}
                  isFirst={index === 0}
                  onPress={onSelectResult}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

/**
 * The search bar and its suggestion list, floating over the top of the map.
 * `trailing` is whatever sits to the right of the bar — the advanced search
 * button, which belongs beside the plain search rather than off in the map's
 * own button stack.
 */
function SearchBox({
  show,
  keyword,
  sections,
  loading,
  showResults,
  trailing,
  onChangeKeyword,
  onClear,
  onFocus,
  onSelectResult,
}) {
  if (!show) {
    return null;
  }

  return (
    <View style={sharedStyles.topSlot} pointerEvents="box-none">
      <View style={searchStyles.searchTopRow}>
        <View style={searchStyles.searchColumn}>
          <View style={searchStyles.searchBar}>
            <View style={searchStyles.searchIconBox}>
              <View style={searchStyles.searchIconGlass} />
              <View style={searchStyles.searchIconHandle} />
            </View>
            <TextInput
              style={searchStyles.searchInput}
              value={keyword}
              placeholder={SEARCH_PLACEHOLDER}
              placeholderTextColor="#9ca3af"
              returnKeyType="search"
              autoCorrect={false}
              onChangeText={onChangeKeyword}
              onFocus={onFocus}
            />
            {keyword.length > 0 ? (
              <SearchClearButton onPress={onClear} />
            ) : null}
          </View>

          {showResults ? (
            <SearchResults
              sections={sections}
              loading={loading}
              onSelectResult={onSelectResult}
            />
          ) : null}
        </View>
        {trailing}
      </View>
    </View>
  );
}

export { SearchBox };
