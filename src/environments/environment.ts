export const apiUrl = 'http://localhost:8080';

export const environment = {
  production: false,
  endpoints: {
    auth: `${apiUrl}/authentication`,
    password: `${apiUrl}/password/`,
    users: `${apiUrl}/users/`,
    profile:  `${apiUrl}/profile/`,
    units: `${apiUrl}/units/`,
    resources: `${apiUrl}/resources/`,
    projects: `${apiUrl}/projects/`,
    timesheet: `${apiUrl}/timesheet/`,
    timesheetsTest: `${apiUrl}/timesheets/`,
    resourcesImport: `${apiUrl}/resources/`,
    skills: `${apiUrl}/skills/`,
    skillgroups: `${apiUrl}/skillsGroups/`,
    timesheetProject: `${apiUrl}/timesheet-projects/`,
    allocations: `${apiUrl}/allocations/`,
    version: `${apiUrl}/version/`,
    vulnerability: `${apiUrl}/vulnerabilities/`,
    vulnerabilityNotifications: `${apiUrl}/vulnerability-notifications/`,
    packages: `${apiUrl}/packages/`,
    roles: `${apiUrl}/roles/`,
    sectorCategory: `${apiUrl}/sectorcategory/`,
    resourcesOverview: `${apiUrl}/resources-overview/`,
    operationManager: `${apiUrl}/operation-manager/`,
  },
  jwt: {
    allowedDomain: [apiUrl, apiUrl.replace('http://', '')],
    refresh: {
      minutesBeforeTokenExpiration: 8
    }
  },
  notifications: {
    minutesToRefresh: 4
  }
};

