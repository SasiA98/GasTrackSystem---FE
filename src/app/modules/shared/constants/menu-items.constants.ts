import { Role } from "@shared/enums/role.enum";
import { RoutesEnum } from "src/app/core/routes.enum";
import { ROLE_VISIBILITY } from "./role-visibility.constants";
import { title } from "process";
import { Content } from "@angular/compiler/src/render3/r3_ast";
import { link } from "fs";
import { ICON_REGISTRY_PROVIDER } from "@angular/material/icon";

export const MENU_ITEMS = [
    {
      title: 'MENU.SIDENAV.MANAGEMENT',
      icon: 'settings',
      content: RoutesEnum.MANAGEMENT,
      permission: ROLE_VISIBILITY.RESOURCES,
      subMenu: [
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
          title: 'MENU.SIDENAV.RESOURCE_MANAGEMENT',
          icon: 'assignment_ind',
          link: RoutesEnum.MANAGEMENT + "/" + RoutesEnum.RESOURCES,
          content: RoutesEnum.RESOURCES,
          permission: ROLE_VISIBILITY.RESOURCES
        },
        {
          title: 'MENU.SIDENAV.PROJECT_MANAGEMENT',
          icon: 'work',
          link: RoutesEnum.MANAGEMENT + "/" + RoutesEnum.PROJECTS,
          content: RoutesEnum.PROJECTS,
          permission: ROLE_VISIBILITY.PROJECTS
        },
      ]
    },
    {
      title: 'MENU.SIDENAV.OPERATIONS_TRIGRAMS',
      icon: 'person_pin',
      content: RoutesEnum.OPERATIONS_TRIGRAMS,
      permission: ROLE_VISIBILITY.OFFICIAL_TRIGRAMS,
      subMenu: [ {
        title: 'MENU.SIDENAV.OFFICIAL_TRIGRAMS',
        icon: 'contacts',
        link: RoutesEnum.OFFICIAL_TRIGRAMS + "/" + RoutesEnum.OPERATIONS_TRIGRAMS,
        content: RoutesEnum.OPERATIONS_TRIGRAMS,
        permission: ROLE_VISIBILITY.OFFICIAL_TRIGRAMS
      }
    ]
    },
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
    },
  ];
