import { BaseModel } from "src/app/base/models/base-model.model";
import { SkillGroup } from "./skill-group.model";

export interface Skill extends BaseModel {
  skillGroup: SkillGroup;
  name: string;
}
