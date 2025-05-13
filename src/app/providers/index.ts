import { compose } from '@/shared/lib/compose';
import { withTheme } from './with-theme';

export const withProviders = compose(withTheme);
