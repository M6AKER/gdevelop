// @flow

import * as React from 'react';
import TeamContext from './TeamContext';
import {
  listTeamGroups,
  listTeamMembers,
  listTeamMemberships,
  listUserTeams,
  updateGroup,
  type Team,
  type TeamGroup,
  type TeamMembership,
  type User,
  updateUserGroup,
} from '../../Utils/GDevelopServices/User';
import AuthenticatedUserContext from '../../Profile/AuthenticatedUserContext';
import { listOtherUserCloudProjects } from '../../Utils/GDevelopServices/Project';

type Props = {| children: React.Node |};

const TeamProvider = ({ children }: Props) => {
  const { profile, getAuthorizationHeader } = React.useContext(
    AuthenticatedUserContext
  );
  const [groups, setGroups] = React.useState<?(TeamGroup[])>(null);
  const [team, setTeam] = React.useState<?Team>(null);
  const [members, setMembers] = React.useState<?(User[])>(null);
  const [memberships, setMemberships] = React.useState<?(TeamMembership[])>(
    null
  );

  React.useEffect(
    () => {
      const fetchTeam = async () => {
        if (!profile || !profile.isTeacher) return;
        const teams = await listUserTeams(getAuthorizationHeader, profile.id);
        // Being admin of multiple teams is not supported at the moment.
        setTeam(teams[0]);
      };
      fetchTeam();
    },
    [getAuthorizationHeader, profile]
  );

  React.useEffect(
    () => {
      const fetchGroups = async () => {
        if (!team || !profile) return;

        const teamGroups = await listTeamGroups(
          getAuthorizationHeader,
          profile.id,
          team.id
        );
        setGroups(teamGroups);
      };
      fetchGroups();
    },
    [team, getAuthorizationHeader, profile]
  );

  React.useEffect(
    () => {
      const fetchMembers = async () => {
        if (!team || !profile) return;

        const teamMembers = await listTeamMembers(
          getAuthorizationHeader,
          profile.id,
          team.id
        );
        setMembers(teamMembers);
      };
      fetchMembers();
    },
    [team, getAuthorizationHeader, profile]
  );

  React.useEffect(
    () => {
      const fetchMemberships = async () => {
        if (!team || !profile) return;

        const teamMemberships = await listTeamMemberships(
          getAuthorizationHeader,
          profile.id,
          team.id
        );
        setMemberships(teamMemberships);
      };
      fetchMemberships();
    },
    [team, getAuthorizationHeader, profile]
  );

  const onChangeGroupName = React.useCallback(
    async (group: TeamGroup, newName: string) => {
      if (!team || !profile || !groups) return;
      const updatedGroup = await updateGroup(
        getAuthorizationHeader,
        profile.id,
        team.id,
        group.id,
        { name: newName }
      );
      const updatedGroupIndex = groups.findIndex(
        group_ => group_.id === group.id
      );
      if (updatedGroupIndex !== -1) {
        setGroups(groups =>
          groups ? groups.with(updatedGroupIndex, updatedGroup) : null
        );
      }
    },
    [team, getAuthorizationHeader, profile, groups]
  );

  const onChangeUserGroup = React.useCallback(
    async (user: User, group: TeamGroup) => {
      if (!team || !profile || !memberships) return;
      try {
        await updateUserGroup(
          getAuthorizationHeader,
          profile.id,
          team.id,
          group.id,
          user.id
        );
        const membershipIndex = memberships.findIndex(
          membership => membership.userId === user.id
        );
        if (membershipIndex !== -1) {
          setMemberships(memberships =>
            memberships
              ? memberships.with(membershipIndex, {
                  ...memberships[membershipIndex],
                  groups: [group.id],
                })
              : null
          );
        }
      } catch (error) {
        console.error('An error occurred while update user group:', error);
      }
    },
    [team, getAuthorizationHeader, profile, memberships]
  );

  const onListUserProjects = React.useCallback(
    async (user: User) => {
      if (!profile) return [];
      return listOtherUserCloudProjects(
        getAuthorizationHeader,
        profile.id,
        user.id
      );
    },
    [getAuthorizationHeader, profile]
  );

  return (
    <TeamContext.Provider
      value={{
        team,
        groups,
        members,
        memberships,
        onChangeGroupName,
        onChangeUserGroup,
        onListUserProjects,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export default TeamProvider;