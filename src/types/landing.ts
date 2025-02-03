import { LucideIcon } from "lucide-react";

export interface IFaq {
  question: string;
  answer: string;
}

export interface IFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface IIndustry {
  id: string;
  name: string;
  subIndustries: string[];
}

export interface ITestimonial {
  quote: string;
  author: string;
  image: string;
  role: string;
  company: string;
}
