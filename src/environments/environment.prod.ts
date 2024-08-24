export const apiUrl = 'http://www.oilsistems.it:8080';

export const environment = {
  production: false,
  endpoints: {
    auth: `${apiUrl}/authentication`,
    password: `${apiUrl}/password/`,
    users: `${apiUrl}/users/`,
    profile:  `${apiUrl}/profile/`,
    companies: `${apiUrl}/companies/`,
    licences: `${apiUrl}/licences/`,
    resources: `${apiUrl}/resources/`,
    companyLicences: `${apiUrl}/company-licences/`,
    version: `${apiUrl}/version/`,
    roles: `${apiUrl}/roles/`,
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

