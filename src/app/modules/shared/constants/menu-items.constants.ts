import { RoutesEnum } from "src/app/core/routes.enum";
import { ROLE_VISIBILITY } from "./role-visibility.constants";


export const MENU_ITEMS = [
    {
      title: 'MENU.SIDENAV.CLIENTI',
      icon: 'settings',
      content: RoutesEnum.ELENCO_CLIENTI,
      permission: ROLE_VISIBILITY.CLIENTI,
      subMenu: [
        {
          title: 'MENU.SIDENAV.ELENCO_CLIENTI',
          icon: 'assignment_ind',
          link: RoutesEnum.CLIENTI + "/" + RoutesEnum.ELENCO_CLIENTI,
          content: RoutesEnum.ELENCO_CLIENTI,
          permission: ROLE_VISIBILITY.CLIENTI
        },

        /*
        {
          title: 'MENU.SIDENAV.USER_MANAGEMENT',
          icon: 'group',
          link: RoutesEnum.MANAGEMENT + "/" + RoutesEnum.USERS,
          content: RoutesEnum.USERS,
          permission: ROLE_VISIBILITY.USERS
        },
        {
          title: 'MENU.SIDENAV.UNIT_MANAGEMENT',
          icon: 'domain',
          link: RoutesEnum.MANAGEMENT + "/" + RoutesEnum.UNITS,
          content: RoutesEnum.UNITS,
          permission: ROLE_VISIBILITY.UNITS
        },
        {
          title: 'MENU.SIDENAV.PROJECT_MANAGEMENT',
          icon: 'work',
          link: RoutesEnum.MANAGEMENT + "/" + RoutesEnum.PROJECTS,
          content: RoutesEnum.PROJECTS,
          permission: ROLE_VISIBILITY.PROJECTS
        },
        */
      ]
    },
    {
      title: 'MENU.SIDENAV.LICENZE',
      icon: 'person_pin',
      content: RoutesEnum.ELENCO_LICENZE,
      permission: ROLE_VISIBILITY.LICENZE,
      subMenu: [ {
        title: 'MENU.SIDENAV.ELENCO_LICENZE',
        icon: 'contacts',
        link: RoutesEnum.LICENZE + "/" + RoutesEnum.ELENCO_LICENZE,
        content: RoutesEnum.ELENCO_LICENZE,
        permission: ROLE_VISIBILITY.LICENZE
      }
    ]
    },
    {
      title: 'MENU.SIDENAV.SCADENZIARIO',
      icon: 'insert_chart',
      content: RoutesEnum.ELENCO_SCADENZIARIO,
      permission: ROLE_VISIBILITY.EVERYBODY,
      subMenu: [ {
        title: 'MENU.SIDENAV.ELENCO_SCADENZIARIO',
        icon: 'contacts',
        link: RoutesEnum.SCADENZIARIO + "/" + RoutesEnum.ELENCO_SCADENZIARIO,
        content: RoutesEnum.ELENCO_SCADENZIARIO,
        permission: ROLE_VISIBILITY.EVERYBODY
      }
    ]
    }
    /*
    {
      title: 'MENU.SIDENAV.TIMESHEET',
      icon: 'add_alarm',
      content: RoutesEnum.TIMESHEET,
      permission: ROLE_VISIBILITY.RESOURCES,
      subMenu: [
        {
          title: 'MENU.SIDENAV.RESOURCE_TIMESHEET',
          icon: 'calendar_today',
          link: RoutesEnum.TIMESHEET + "/" + RoutesEnum.RESOURCE_TIMESHEET,
          content: RoutesEnum.TIMESHEET,
          permission: ROLE_VISIBILITY.TIMESHEETS
        },
        {
          title: 'MENU.SIDENAV.UNIT_TIMESHEET',
          icon: 'alarm_on',
          link: RoutesEnum.TIMESHEET + "/" + RoutesEnum.UNIT_TIMESHEET,
          content: RoutesEnum.UNIT_TIMESHEET,
          permission: ROLE_VISIBILITY.TIMESHEETS
        }
      ]
    },
    {
      title: 'MENU.SIDENAV.GANTT',
      icon: 'insert_chart',
      content: RoutesEnum.GANTT,
      permission: ROLE_VISIBILITY.UNITS,
      subMenu: [ {
        title: 'MENU.SIDENAV.RESOURCE_GANT_OVERVIEW',
        icon: 'bar_chart',
        link: RoutesEnum.GANTT + "/" + RoutesEnum.RESOURCE_GANT_OVERVIEW,
        content: RoutesEnum.RESOURCE_GANT_OVERVIEW,
        permission: ROLE_VISIBILITY.GANTT
      }, 
      {
        title: 'MENU.SIDENAV.PROJECTS_GANT_OVERVIEW',
        icon: 'table_chart',
        link: RoutesEnum.GANTT + "/" + RoutesEnum.PROJECTS_GANT_OVERVIEW,
        content: RoutesEnum.PROJECTS_GANT_OVERVIEW,
        permission: ROLE_VISIBILITY.GANTT
      }
    ]
    },
    {
      title: 'MENU.SIDENAV.SKILL_OVERVIEW',
      icon: 'star_border',
      content: RoutesEnum.SKILLS_OVERVIEW,
      permission: ROLE_VISIBILITY.SKILLS,
      subMenu: [ {
        title: 'MENU.SIDENAV.SKILLS',
        icon: 'star',
        link: RoutesEnum.SKILLS_OVERVIEW + "/" + RoutesEnum.SKILLS,
        content: RoutesEnum.SKILLS,
        permission: ROLE_VISIBILITY.SKILLS
      }
    ]
    },
    {
      title: 'MENU.SIDENAV.IMPORT_OVERVIEW',
      icon: 'cloud',
      content: RoutesEnum.IMPORT_OVERVIEW,
      permission: ROLE_VISIBILITY.IMPORT,
      subMenu: [ {
        title: 'MENU.SIDENAV.IMPORT',
        icon: 'cloud_upload',
        link: RoutesEnum.IMPORT_OVERVIEW + "/" + RoutesEnum.IMPORT,
        content: RoutesEnum.IMPORT,
        permission: ROLE_VISIBILITY.IMPORT
      }, 
      {
        title: 'MENU.SIDENAV.IMPORT_RESOURCES',
        icon: 'cloud_upload',
        link: RoutesEnum.IMPORT_OVERVIEW + "/" + RoutesEnum.IMPORT_RESOURCES,
        content: RoutesEnum.IMPORT_RESOURCES,
        permission: ROLE_VISIBILITY.IMPORT_RESOURCES
      }
    ]
    }
    */
  ];
