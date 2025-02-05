import { LucideIcon } from "lucide-react";

export interface ISalary {
  name: string;
  min: number;
  medium: number;
  max: number;
}

export interface ISalaryRange extends Omit<ISalary, "name"> {
  role: string;
  location: string;
}

export interface IMarketOutlookInfo {
  icon: LucideIcon;
  color: string;
}
