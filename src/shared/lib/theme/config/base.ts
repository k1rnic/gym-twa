import { ThemeConfig, theme } from 'antd';

const BG_BASE = 'rgb(15, 20, 25)';
const BG_SECONDARY = 'rgb(23, 26, 31)';
const COLOR_BORDER = 'rgba(215,170,175,0.04)';
const COLOR_TEXT = 'rgba(255,255,255,0.85)';
const PADDING = 16;

export const BASE_THEME_CONFIG: ThemeConfig = {
  cssVar: true,
  algorithm: theme.darkAlgorithm,
  components: {
    Segmented: {
      itemHoverBg: 'transparent',
      itemActiveBg: 'transparent',
    },
    Card: {
      headerBg: BG_SECONDARY,
      colorBgContainer: BG_SECONDARY,
      headerPadding: 16,
    },
    Form: {
      verticalLabelPadding: `0 ${PADDING * 0.75}px`,
      itemMarginBottom: PADDING * 0.75,
    },
    Input: {
      activeBg: BG_SECONDARY,
      colorBorder: 'transparent',
      colorBgContainerDisabled: 'transparent',
      colorTextDisabled: COLOR_TEXT,
    },
    InputNumber: {
      activeBg: BG_SECONDARY,
      colorBorder: 'transparent',
      colorBgContainerDisabled: 'transparent',
      colorTextDisabled: COLOR_TEXT,
    },
    Select: {
      colorBgContainerDisabled: BG_SECONDARY,
      colorBorder: 'transparent',
    },
    Button: {
      defaultShadow: 'none',
    },
    Drawer: {
      colorBgElevated: BG_SECONDARY,
    },
  },
  token: {
    fontFamily:
      'Oswald, Mulish,"Ubuntu Condensed", Inter, system-ui, sans-serif',
    controlHeight: 40,
    colorText: COLOR_TEXT,
    colorPrimary: '#84C02A',
    colorSuccess: '#32936F',
    colorWarning: '#E9A23B',
    colorError: '#e5383b',
    colorInfo: '#00b4d8',
    colorBgContainer: BG_BASE,
    colorBgElevated: BG_BASE,
    colorBgLayout: BG_SECONDARY,
    colorBorderSecondary: COLOR_BORDER,
    colorSplit: COLOR_BORDER,
    colorBgMask: 'rgba(15, 20, 25, 0.4)',
    colorFillTertiary: BG_SECONDARY,
    borderRadius: 8,
  },
};
