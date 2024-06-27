export const apiUrl = 'https://scs-springcloud-scs-app.azuremicroservices.io';

export const daggerboard = 'https://localhost:443';

export const environment = {
  production: false,
  endpoints: {
    auth: `${apiUrl}/authentication`,
    users: `${apiUrl}/users/`,
    profile:  `${apiUrl}/profile/`,
    units: `${apiUrl}/units/`,
    products: `${apiUrl}/products/`,
    sbom: `${apiUrl}/sbom/`,
    vulnerability: `${apiUrl}/vulnerabilities/`,
    vulnerabilityNotifications: `${apiUrl}/vulnerability-notifications/`,
    packages: `${apiUrl}/packages/`,
    roles: `${apiUrl}/roles/`,
    sectorCategory: `${apiUrl}/sectorcategory/`,
  },
  jwt: {
    allowedDomain: [apiUrl, apiUrl.replace('https://', '')],
    refresh: {
      minutesBeforeTokenExpiration: 8
    }
  },
  notifications: {
    minutesToRefresh: 4
  }
};

