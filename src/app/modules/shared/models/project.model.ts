import { BaseModel } from "src/app/base/models/base-model.model";
import { ProjectStatus } from "@shared/enums/project-status.enum";
import { Industry } from '@shared/enums/industry.enum';
import { ProjectType } from "@shared/enums/project-type.enum";

export interface Project extends BaseModel {
  name: string;
  industry: Industry;

  unitId: number;

  presaleId: number;
  dumId: number;

  pmTrigram: string;
  dumTrigram: string;

  presaleTrigram: string;
  bmTrigram: string;

  status?: ProjectStatus;
  projectType: ProjectType;

  crmCode?: string;
  projectId?: string;

  ic: boolean;
  startDate: string | Date;

  preSaleScheduledEndDate: string | Date;
  estimatedEndDate: string | Date;

  komDate?: string | Date;
  endDate?: string | Date;

  currentEstimatedHrCost?: number;
  preSaleEstimatedHrCost?: number;

  preSaleFixedCost?: number;
  currentFixedCost?: number;

  preSaleEstimatedCost?: number;
  currentEstimatedCost?: number;

  actualCost?: number;
  note?: string;

}
