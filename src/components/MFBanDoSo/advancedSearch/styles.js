import { StyleSheet } from 'react-native';

import { MAP_BUTTON_BAR_OFFSET, MAP_BUTTON_GAP } from '../shared/constants';
import { fullFill } from '../shared/styles';

const advancedSearchStyles = StyleSheet.create({
  // Sits to the right of the search bar, in the same column as the stack below
  // and one pitch above it. Being shorter than the bar, it is centred on it.
  button: {
    marginLeft: MAP_BUTTON_GAP,
    marginTop: MAP_BUTTON_BAR_OFFSET,
  },
  // Three upright sliders in a 16x16 box, so the icon carries the same weight
  // as the layer and legend ones below it and uses their line and dot colours.
  sliders: {
    flexDirection: 'row',
    width: 16,
    justifyContent: 'space-between',
  },
  sliderTrack: {
    width: 4,
    height: 16,
    alignItems: 'center',
  },
  sliderLine: {
    width: 1.5,
    height: 16,
    borderRadius: 1,
    backgroundColor: '#6b7280',
  },
  // Solid rather than a ring: at four pixels a ring reads as a smudge. Its
  // `top` is set per track, which is what makes them read as set differently.
  sliderKnob: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4b5563',
  },
  // A screen of its own rather than a panel: it covers the map outright, so
  // there is room for every filter without the map fighting for space.
  screen: {
    ...fullFill,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Chevron and cross drawn from borders, like the sheet's own controls.
  headerBackChevron: {
    width: 12,
    height: 12,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: '#111827',
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  targetRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  targetTab: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  targetTabActive: {
    borderColor: '#b91c1c',
    backgroundColor: '#b91c1c',
  },
  targetTabSpacing: {
    marginLeft: 8,
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  targetLabelActive: {
    color: '#ffffff',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 12,
    paddingBottom: 24,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#111827',
  },
  select: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectDisabled: {
    backgroundColor: '#f3f4f6',
  },
  selectText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  selectPlaceholder: {
    color: '#9ca3af',
  },
  // Points down when closed; the picker it opens covers the screen.
  selectCaret: {
    width: 9,
    height: 9,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#6b7280',
    transform: [{ rotate: '45deg' }],
    marginBottom: 4,
    marginLeft: 8,
  },
  selectClear: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  selectClearMark: {
    fontSize: 12,
    lineHeight: 14,
    color: '#4b5563',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b91c1c',
  },
  actionButtonGhost: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
    flex: 0,
    paddingHorizontal: 18,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  actionLabelGhost: {
    color: '#374151',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b91c1c',
  },
  statusRow: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  statusText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  resultCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 8,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  resultMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  resultTag: {
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginTop: 4,
  },
  resultTagText: {
    fontSize: 12,
    color: '#475569',
  },
  // The picker is a second full screen laid over the first, so a list of three
  // thousand wards gets the whole height to scroll in.
  pickerScreen: {
    ...fullFill,
    backgroundColor: '#f8fafc',
  },
  pickerSearchBox: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pickerRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  pickerRowText: {
    fontSize: 15,
    color: '#111827',
  },
  pickerRowTextSelected: {
    color: '#b91c1c',
    fontWeight: '700',
  },
  // Stands in for the search box when the list behind it has nothing to
  // search, so it takes roughly the same vertical space rather than leaving
  // the screen looking cut off.
  pickerEmptyState: {
    paddingVertical: 28,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  // A sheet of paper, built only from straight-edged rectangles: a bold
  // title bar over three fading content lines. Reads as "an empty document"
  // without any diagonal edges, which View borders can't render cleanly.
  pickerEmptyIcon: {
    width: 42,
    height: 48,
    marginBottom: 10,
  },
  pickerEmptyIconPage: {
    width: 42,
    height: 48,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  pickerEmptyIconTitle: {
    position: 'absolute',
    top: 10,
    left: 9,
    width: 24,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#d1d5db',
  },
  pickerEmptyIconLine: {
    position: 'absolute',
    left: 9,
    height: 3,
    borderRadius: 1.5,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f3f4f6',
  },
  pickerEmptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
});

export { advancedSearchStyles };
