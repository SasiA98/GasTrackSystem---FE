import { Role } from "@shared/enums/role.enum";

export interface MenuItem {
    title: string;
    icon: string;
    link?: string;
    subMenu?: MenuItem[];
    roles?: Role[];
    content: string;
    permission?: string[];
  }
