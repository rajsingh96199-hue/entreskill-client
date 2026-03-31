// ── EntreSkill Hub — Premium Design System ────────────────────────────────────
export const COLORS = {
  // Primary Navy
  navy900: '#0A1628',
  navy800: '#0F2040',
  navy700: '#1A3358',
  navy600: '#1E3A5F',
  navy500: '#2C4F7C',
  navy400: '#3D6494',
  navy300: '#6B8DB5',
  navy200: '#A8BDD6',
  navy100: '#E8EEF5',
  navy50:  '#F4F7FB',

  // Gold Accent
  gold600: '#A67C00',
  gold500: '#C9A84C',
  gold400: '#D4B55A',
  gold300: '#E2CC82',
  gold200: '#F0E0A8',
  gold100: '#FAF4E0',
  gold50:  '#FDFAF0',

  // Neutrals
  gray900: '#0F172A',
  gray800: '#1E293B',
  gray700: '#334155',
  gray600: '#475569',
  gray500: '#64748B',
  gray400: '#94A3B8',
  gray300: '#CBD5E1',
  gray200: '#E2E8F0',
  gray100: '#F1F5F9',
  gray50:  '#F8FAFC',
  white:   '#FFFFFF',

  // Status
  success: '#059669',
  successLight: '#D1FAE5',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger:  '#DC2626',
  dangerLight: '#FEE2E2',
  info:    '#0284C7',
  infoLight: '#E0F2FE',
}

export const FONTS = {
  display: "'Playfair Display', Georgia, serif",
  body:    "'Outfit', 'Segoe UI', sans-serif",
  mono:    "'JetBrains Mono', monospace",
}

export const SHADOWS = {
  xs:  '0 1px 2px rgba(10,22,40,0.05)',
  sm:  '0 2px 4px rgba(10,22,40,0.08)',
  md:  '0 4px 12px rgba(10,22,40,0.10)',
  lg:  '0 8px 24px rgba(10,22,40,0.12)',
  xl:  '0 16px 40px rgba(10,22,40,0.15)',
  xxl: '0 24px 60px rgba(10,22,40,0.20)',
  gold: '0 4px 20px rgba(201,168,76,0.25)',
}

export const RADIUS = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  xxl: '28px',
  full: '9999px',
}

// Reusable component styles
export const CARD = {
  background: COLORS.white,
  borderRadius: RADIUS.lg,
  boxShadow: SHADOWS.md,
  border: `1px solid ${COLORS.gray200}`,
  padding: '24px',
}

export const BTN_PRIMARY = {
  background: `linear-gradient(135deg, ${COLORS.gold500}, ${COLORS.gold600})`,
  color: COLORS.navy900,
  border: 'none',
  borderRadius: RADIUS.md,
  padding: '12px 28px',
  fontSize: '14px',
  fontWeight: 700,
  fontFamily: FONTS.body,
  cursor: 'pointer',
  boxShadow: SHADOWS.gold,
  letterSpacing: '0.3px',
}

export const BTN_SECONDARY = {
  background: 'transparent',
  color: COLORS.navy700,
  border: `2px solid ${COLORS.navy200}`,
  borderRadius: RADIUS.md,
  padding: '12px 28px',
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: FONTS.body,
  cursor: 'pointer',
}

export const BTN_GHOST = {
  background: COLORS.navy50,
  color: COLORS.navy700,
  border: `1px solid ${COLORS.navy100}`,
  borderRadius: RADIUS.md,
  padding: '10px 20px',
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: FONTS.body,
  cursor: 'pointer',
}

export const INPUT = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: RADIUS.md,
  border: `1.5px solid ${COLORS.gray200}`,
  fontSize: '14px',
  fontFamily: FONTS.body,
  color: COLORS.gray900,
  outline: 'none',
  background: COLORS.white,
}

export const LABEL = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  color: COLORS.gray700,
  marginBottom: '6px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  fontFamily: FONTS.body,
}

export const PAGE_BG = {
  minHeight: '100vh',
  background: COLORS.gray50,
  fontFamily: FONTS.body,
}

export const NAVBAR = {
  background: COLORS.navy900,
  padding: '0 32px',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: `0 1px 0 rgba(255,255,255,0.06)`,
  position: 'sticky',
  top: 0,
  zIndex: 100,
}