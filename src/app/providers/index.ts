import { compose } from '@/shared/lib/compose';
import { withAuth } from './with-auth';
import { withI18n } from './with-i18n';
import { withTheme } from './with-theme';
import { withViewer } from './with-viewer';

export const withProviders = compose(withI18n, withTheme, withViewer, withAuth);
