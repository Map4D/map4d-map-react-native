import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import {
  ADVANCED_PICKER_SEARCH_PLACEHOLDER,
  ADVANCED_SELECT_PLACEHOLDER,
} from './constants';
import { advancedSearchStyles as styles } from './styles';

/** Shared chrome for both full screens: a back arrow, a title, and a close. */
function ScreenHeader({ title, onBack, onClose }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable style={styles.headerButton} onPress={onBack}>
          <View style={styles.headerBackChevron} />
        </Pressable>
      ) : null}
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      {onClose ? (
        <Pressable style={styles.headerButton} onPress={onClose}>
          <Text style={styles.selectClearMark}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/**
 * The closed state of a filter: what is picked, a caret, and — once something
 * is picked — a way to unpick it without opening the list again.
 */
function SelectField({
  label,
  value,
  options,
  disabled,
  hint,
  onPress,
  onClear,
}) {
  const selected = options.find((option) => option.value === value);
  // The hint says what has to happen before this field can be used, so it is
  // only the right thing to read once that is no longer true.
  const text =
    selected?.label ??
    (disabled
      ? hint ?? ADVANCED_SELECT_PLACEHOLDER
      : ADVANCED_SELECT_PLACEHOLDER);

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        style={[styles.select, disabled && styles.selectDisabled]}
        onPress={disabled ? undefined : onPress}
      >
        <Text
          style={[styles.selectText, !selected && styles.selectPlaceholder]}
          numberOfLines={1}
        >
          {text}
        </Text>
        {selected ? (
          <Pressable style={styles.selectClear} onPress={onClear}>
            <Text style={styles.selectClearMark}>✕</Text>
          </Pressable>
        ) : (
          <View style={styles.selectCaret} />
        )}
      </Pressable>
    </View>
  );
}

/**
 * The open state, as a screen of its own. A ward list runs to thousands of
 * entries, so it is filtered as you type rather than only scrolled.
 */
function OptionPicker({ title, options, value, onSelect, onClose }) {
  const [keyword, setKeyword] = useState('');
  const normalizeText = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();

  const normalizedOptions = useMemo(
    () =>
      options.map((option) => ({
        option,
        normalizedLabel: normalizeText(option.label),
      })),
    [options]
  );

  const visible = useMemo(() => {
    const needle = normalizeText(keyword.trim());

    if (!needle) {
      return options;
    }

    return normalizedOptions
      .filter(({ normalizedLabel }) => normalizedLabel.includes(needle))
      .map(({ option }) => option);
  }, [keyword, options, normalizedOptions]);

  return (
    <View style={styles.pickerScreen}>
      <ScreenHeader title={title} onBack={onClose} />
      <View style={styles.pickerSearchBox}>
        <TextInput
          style={styles.input}
          value={keyword}
          placeholder={ADVANCED_PICKER_SEARCH_PLACEHOLDER}
          placeholderTextColor="#9ca3af"
          autoCorrect={false}
          onChangeText={setKeyword}
        />
      </View>
      <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
        {visible.map((option) => (
          <Pressable
            key={option.value}
            style={styles.pickerRow}
            onPress={() => onSelect(option.value)}
          >
            <Text
              style={[
                styles.pickerRowText,
                option.value === value && styles.pickerRowTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export { OptionPicker, ScreenHeader, SelectField };
