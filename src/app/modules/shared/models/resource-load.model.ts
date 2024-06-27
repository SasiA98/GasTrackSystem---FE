import { BaseModel } from "src/app/base/models/base-model.model";

export interface ResourceLoadModel extends BaseModel {
    unitTrigram: string;
    fullName: string;
    year: number,
    cw?: string,
    weeklyRealCommitmentPct: { [month: string]: { [week: string]: number } };
    weeklySaleCommitmentPct: { [month: string]: { [week: string]: number } };
}

export interface ContentResponse {
    content: ResourceLoadModel[];
    first: boolean;
    last: boolean;
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
    size: number;
    number: number;
    sort: any[];
  }