import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../theme/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
  },
  notifButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  notifDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  mainContent: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  // Home Stats
  statsRow: {
    flexDirection: 'row',
    padding: 10,
    flexWrap: 'wrap',
  },
  statBox: {
    width: (width - 40) / 2 - 10,
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    margin: 5,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 4,
  },
  // Action Cards
  actionCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  actionIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  actionSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
});

export default styles;
