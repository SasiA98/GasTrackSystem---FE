// project-load.model.ts
import { BaseModel } from 'src/app/base/models/base-model.model';

export interface ProjectLoadModel extends BaseModel {
  unitTrigram: string;
  name: string;
  year: number;
  status: string;
  cw?: string;
  estimatedCostPct: { [month: string]: { [week: string]: number } };
  estimatedCost: { [month: string]: { [week: string]: number } };
  actualCostPct: { [month: string]: { [week: string]: number } };
  actualCost: { [month: string]: { [week: string]: number } };
}

export interface ApiResponse {
  content: ProjectLoadModel[];
  first: boolean;
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  sort: any[];
}
