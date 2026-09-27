import { mapTgUserToViewer, viewerModel } from '@/entities/viewer';
import { Api } from '@/shared/api';
import { isTelegramMiniApp, TgUser } from '@/shared/lib/telegram';
import { retrieveLaunchParams, retrieveRawInitData } from '@tma.js/sdk-react';
import { isAxiosError } from 'axios';

export type AuthStatus =
  | 'idle'
  | 'authenticating'
  | 'authenticated'
  | 'consent_required'
  | 'forbidden'
  | 'error';

type AuthSnapshot = {
  status: AuthStatus;
  user: ReturnType<typeof viewerModel.getViewerState>;
  pendingUser: TgUser | null;
  error: unknown;
};

export class ConsentRequiredError extends Error {
  constructor() {
    super('User consent is required');
    this.name = 'ConsentRequiredError';
  }
}

export class AuthForbiddenError extends Error {
  constructor() {
    super('Authentication is forbidden');
    this.name = 'AuthForbiddenError';
  }
}

let snapshot: AuthSnapshot = {
  status: 'idle',
  user: viewerModel.getViewerState(),
  pendingUser: null,
  error: null,
};

let inFlight: Promise<NonNullable<AuthSnapshot['user']>> | null = null;

const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

const update = (next: Partial<AuthSnapshot>) => {
  snapshot = { ...snapshot, ...next };
  emit();
};

const getTelegramUser = (): TgUser => {
  const user = retrieveLaunchParams().tgWebAppData?.user;

  if (!user) {
    throw new Error('Telegram user is unavailable');
  }

  return user;
};

const getTelegramInitData = () => {
  const initData = retrieveRawInitData();

  if (!initData) {
    throw new Error('Telegram init data is unavailable');
  }

  return initData;
};

const authenticate = async () => {
  update({ status: 'authenticating', error: null });

  try {
    const user = getTelegramUser();

    const response = isTelegramMiniApp()
      ? await Api.auth.getUserToken({ init_data: getTelegramInitData() })
      : await Api.auth.getDevUserTokenAuthDevSigninPost({
          telegram_id: user.id,
        });

    Api.setSecurityData(response.token);
    viewerModel.setViewer(response.user);

    update({ status: 'authenticated', user: response.user, pendingUser: null });

    return response.user;
  } catch (error) {
    if (isAxiosError(error) && error.status === 404) {
      const pendingUser = getTelegramUser();
      update({ status: 'consent_required', pendingUser, error });
      throw new ConsentRequiredError();
    }

    if (isAxiosError(error) && error.status === 403) {
      update({ status: 'forbidden', error });
      throw new AuthForbiddenError();
    }

    update({ status: 'error', error });
    throw error;
  }
};

export const authService = {
  ensureAuthenticated: (): Promise<NonNullable<AuthSnapshot['user']>> => {
    if (snapshot.status === 'authenticated' && snapshot.user) {
      return Promise.resolve(snapshot.user);
    }

    if (snapshot.status === 'consent_required') {
      return Promise.reject(new ConsentRequiredError());
    }

    if (snapshot.status === 'forbidden') {
      return Promise.reject(new AuthForbiddenError());
    }

    if (!inFlight) {
      inFlight = authenticate().finally(() => {
        inFlight = null;
      });
    }

    return inFlight;
  },

  completeSignup: async () => {
    const user = snapshot.pendingUser;

    if (!user) {
      return;
    }

    update({ status: 'authenticating', error: null });

    try {
      const response = isTelegramMiniApp()
        ? await Api.auth.createUserByInitData({
            init_data: getTelegramInitData(),
          })
        : await Api.auth.createDevUserTokenAuthDevSignupPost(
            mapTgUserToViewer(user),
          );

      Api.setSecurityData(response.token);
      viewerModel.setViewer(response.user);
      update({
        status: 'authenticated',
        user: response.user,
        pendingUser: null,
      });
    } catch (error) {
      if (isAxiosError(error) && error.status === 403) {
        update({ status: 'forbidden', error, pendingUser: null });
        throw new AuthForbiddenError();
      }

      update({ status: 'error', error });
      throw error;
    }
  },

  getSnapshot: () => snapshot,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
