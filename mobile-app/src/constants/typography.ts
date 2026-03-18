export const TYPOGRAPHY = {
  FONT_FAMILY: {
    REGULAR: 'Inter_400Regular',
    MEDIUM: 'Inter_500Medium',
    SEMIBOLD: 'Inter_600SemiBold',
    BOLD: 'Inter_700Bold',
  },

  FONT_SIZE: {
    XS: 11,
    SM: 12,
    MD: 13,
    LG: 14,
    XL: 15,
    XXL: 16,
    TITLE_SM: 18,
    TITLE_MD: 24,
    TITLE_LG: 30,
  },

  FONT_WEIGHT: {
    REGULAR: '400' as const,
    MEDIUM: '500' as const,
    SEMIBOLD: '600' as const,
    BOLD: '700' as const,
  },

  LINE_HEIGHT: {
    XS: 16,
    SM: 18,
    MD: 20,
    LG: 22,
    XL: 24,
    TITLE: 36,
  },

  LETTER_SPACING: {
    NORMAL: 0,
    WIDE: 1.2,
  },
} as const;