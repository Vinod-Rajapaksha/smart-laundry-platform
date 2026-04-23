import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../theme/colors';

export const styles = StyleSheet.create({
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.SUCCESS_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: COLORS.SUCCESS_BORDER,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginHorizontal: 20,
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    height: 60,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    height: 60,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY_SOFT_BORDER,
    paddingHorizontal: 20,
  },
  secondaryBtnText: {
    flex: 1,
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginLeft: 18,
  }
});

export default styles;
