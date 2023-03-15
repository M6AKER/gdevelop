// @flow
import * as React from 'react';
import { type Profile } from '../Utils/GDevelopServices/Authentication';
import { type CloudProjectWithUserAccessInfo } from '../Utils/GDevelopServices/Project';
import { User as FirebaseUser } from 'firebase/auth';
import { type Badge } from '../Utils/GDevelopServices/Badge';
import {
  type Limits,
  type Usages,
  type Subscription,
} from '../Utils/GDevelopServices/Usage';
import {
  type AssetShortHeader,
  type PrivateAssetPack,
} from '../Utils/GDevelopServices/Asset';

export type AuthenticatedUser = {|
  authenticated: boolean,
  firebaseUser: ?FirebaseUser,
  profile: ?Profile,
  loginState: null | 'loggingIn' | 'done',
  badges: ?Array<Badge>,
  cloudProjects: ?Array<CloudProjectWithUserAccessInfo>,
  cloudProjectsFetchingErrorLabel: ?React.Node,
  receivedAssetPacks: ?Array<PrivateAssetPack>,
  receivedAssetShortHeaders: ?Array<AssetShortHeader>,
  limits: ?Limits,
  usages: ?Usages,
  subscription: ?Subscription,
  onLogout: () => Promise<void>,
  onLogin: () => void,
  onForgotPassword: () => Promise<void>,
  onEdit: () => void,
  onChangeEmail: () => void,
  onCreateAccount: () => void,
  onBadgesChanged: () => Promise<void>,
  onCloudProjectsChanged: () => Promise<void>,
  onRefreshUserProfile: () => Promise<void>,
  onRefreshFirebaseProfile: () => Promise<void>,
  onSubscriptionUpdated: () => Promise<void>,
  onPurchaseSuccessful: () => Promise<void>,
  onSendEmailVerification: () => Promise<void>,
  onOpenEmailVerificationDialog: ({|
    sendEmailAutomatically: boolean,
    showSendEmailButton: boolean,
  |}) => void,
  onAcceptGameStatsEmail: () => Promise<void>,
  getAuthorizationHeader: () => Promise<string>,
|};

export const initialAuthenticatedUser = {
  authenticated: false,
  firebaseUser: null,
  profile: null,
  loginState: null,
  badges: null,
  cloudProjects: null,
  cloudProjectsFetchingErrorLabel: null,
  receivedAssetPacks: null,
  receivedAssetShortHeaders: null,
  subscription: null,
  usages: null,
  limits: null,
  onLogout: async () => {},
  onLogin: () => {},
  onForgotPassword: async () => {},
  onEdit: () => {},
  onChangeEmail: () => {},
  onCreateAccount: () => {},
  onBadgesChanged: async () => {},
  onCloudProjectsChanged: async () => {},
  onRefreshUserProfile: async () => {},
  onRefreshFirebaseProfile: async () => {},
  onSubscriptionUpdated: async () => {},
  onPurchaseSuccessful: async () => {},
  onSendEmailVerification: async () => {},
  onOpenEmailVerificationDialog: () => {},
  onAcceptGameStatsEmail: async () => {},
  getAuthorizationHeader: () => Promise.reject(new Error('Unimplemented')),
};

const AuthenticatedUserContext = React.createContext<AuthenticatedUser>(
  initialAuthenticatedUser
);

export default AuthenticatedUserContext;
