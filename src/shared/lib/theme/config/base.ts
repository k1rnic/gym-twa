import { ThemeConfig, theme } from 'antd';

const BG_BASE = 'rgb(15, 20, 25)';
const BG_SECONDARY = 'rgb(23, 26, 31)';
const COLOR_PRIMARY = 'rgb(46, 58, 165)';
const COLOR_BORDER = 'rgba(215,170,175,0.04)';

export const BASE_THEME_CONFIG: ThemeConfig = {
  cssVar: true,
  components: {
    Segmented: {
      itemHoverBg: 'transparent',
      itemActiveBg: 'transparent',
    },
    Card: {
      headerBg: BG_SECONDARY,
      colorBgContainer: BG_SECONDARY,
    },
    Input: {
      activeBg: BG_SECONDARY,
      colorBgContainerDisabled: BG_SECONDARY,
      colorBorder: 'transparent',
    },
    InputNumber: {
      activeBg: BG_SECONDARY,
      colorBgContainerDisabled: BG_SECONDARY,
      colorBorder: 'transparent',
    },
    Select: {
      colorBgContainerDisabled: BG_SECONDARY,
      colorBorder: 'transparent',
    },
    Button: {
      defaultBorderColor: COLOR_PRIMARY,
      defaultColor: COLOR_PRIMARY,
      defaultShadow: 'none',
    },
    Drawer: {
      colorBgElevated: BG_SECONDARY,
    },
    List: {},
  },
  token: {
    controlHeight: 40,
    colorBgContainer: BG_BASE,
    colorBgElevated: BG_BASE,
    colorBgLayout: BG_SECONDARY,
    colorPrimary: COLOR_PRIMARY,
    colorBorderSecondary: COLOR_BORDER,
    colorSplit: COLOR_BORDER,
    colorBgMask: 'rgba(15, 20, 25, 0.4)',
    colorFillTertiary: BG_SECONDARY,
    borderRadius: 8,
  },
  algorithm: theme.darkAlgorithm,
};
