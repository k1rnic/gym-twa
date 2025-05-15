import { compose } from '@/shared/lib/compose';
import { withAuth } from './with-auth';
import { withTheme } from './with-theme';
import { withViewer } from './with-viewer';

export const withProviders = compose(withTheme, withViewer, withAuth);
