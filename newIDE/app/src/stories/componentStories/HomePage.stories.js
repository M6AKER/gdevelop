// @flow
import * as React from 'react';
import { action } from '@storybook/addon-actions';
import muiDecorator from '../ThemeDecorator';
import { HomePage } from '../../MainFrame/EditorContainers/HomePage';
import GDevelopJsInitializerDecorator, {
  testProject,
} from '../GDevelopJsInitializerDecorator';
import { ExampleStoreStateProvider } from '../../AssetStore/ExampleStore/ExampleStoreContext';
import { GamesShowcaseStateProvider } from '../../GamesShowcase/GamesShowcaseContext';
import { TutorialStateProvider } from '../../Tutorial/TutorialContext';
import PreferencesContext, {
  initialPreferences,
} from '../../MainFrame/Preferences/PreferencesContext';
import { type FileMetadataAndStorageProviderName } from '../../ProjectsStorage';
import FixedHeightFlexContainer from '../FixedHeightFlexContainer';
import AuthenticatedUserContext, {
  initialAuthenticatedUser,
  type AuthenticatedUser,
} from '../../Profile/AuthenticatedUserContext';
import {
  fakeIndieAuthenticatedUser,
  indieUserProfile,
} from '../../fixtures/GDevelopServicesTestData';

const getRecentProjectFiles = (count: number) =>
  new Array(count).fill(0).map((_, index) => ({
    fileMetadata: {
      fileIdentifier: `Users/Gdevelop/project ${index}`,
    },
    storageProviderName: 'test',
  }));

const WrappedHomePage = ({
  project,
  recentProjectFiles,
  user,
}: {|
  project: ?gdProject,
  recentProjectFiles: FileMetadataAndStorageProviderName[],
  user: AuthenticatedUser,
|}) => (
  <FixedHeightFlexContainer height={500}>
    <PreferencesContext.Provider
      value={{
        ...initialPreferences,
        getRecentProjectFiles: () => recentProjectFiles,
      }}
    >
      <AuthenticatedUserContext.Provider value={user}>
        <ExampleStoreStateProvider>
          <TutorialStateProvider>
            <GamesShowcaseStateProvider>
              <HomePage
                project={project}
                isActive={true}
                projectItemName={null}
                setToolbar={() => {}}
                canOpen={true}
                onOpen={() => action('onOpen')()}
                onOpenRecentFile={() => action('onOpenRecentFile')()}
                onOpenExamples={() => action('onOpenExamples')()}
                onOpenProjectManager={() => action('onOpenProjectManager')()}
                onOpenHelpFinder={() => action('onOpenHelpFinder')()}
                onOpenLanguageDialog={() => action('open language dialog')()}
                onOpenOnboardingDialog={() =>
                  action('open onboarding dialog')()
                }
                onCreateFromExampleShortHeader={() =>
                  action('create from example')()
                }
                onOpenProjectAfterCreation={() =>
                  action('call callback after project creation')()
                }
                onOpenProfile={() => action('open profile')()}
                onCreateBlank={() => action('create blank')()}
              />
            </GamesShowcaseStateProvider>
          </TutorialStateProvider>
        </ExampleStoreStateProvider>
      </AuthenticatedUserContext.Provider>
    </PreferencesContext.Provider>
  </FixedHeightFlexContainer>
);

export default {
  title: 'HomePage',
  component: WrappedHomePage,
  decorators: [muiDecorator, GDevelopJsInitializerDecorator],
};

export const NoProjectOpened = () => (
  <WrappedHomePage
    project={null}
    recentProjectFiles={getRecentProjectFiles(5)}
    user={fakeIndieAuthenticatedUser}
  />
);
export const ProjectOpened = () => (
  <WrappedHomePage
    project={testProject.project}
    recentProjectFiles={getRecentProjectFiles(5)}
    user={fakeIndieAuthenticatedUser}
  />
);
export const NoRecentFiles = () => (
  <WrappedHomePage
    project={testProject.project}
    recentProjectFiles={[]}
    user={fakeIndieAuthenticatedUser}
  />
);
export const LotOfRecentFiles = () => (
  <WrappedHomePage
    project={testProject.project}
    recentProjectFiles={getRecentProjectFiles(20)}
    user={fakeIndieAuthenticatedUser}
  />
);

export const Connected = () => (
  <WrappedHomePage
    project={testProject.project}
    recentProjectFiles={getRecentProjectFiles(20)}
    user={fakeIndieAuthenticatedUser}
  />
);

export const ConnectedWithLongName = () => (
  <WrappedHomePage
    project={testProject.project}
    recentProjectFiles={getRecentProjectFiles(20)}
    user={{
      ...fakeIndieAuthenticatedUser,
      profile: {
        ...indieUserProfile,
        username: 'This is a very long username that should be truncated',
      },
    }}
  />
);

export const NotConnected = () => (
  <WrappedHomePage
    project={testProject.project}
    recentProjectFiles={getRecentProjectFiles(20)}
    user={initialAuthenticatedUser}
  />
);
