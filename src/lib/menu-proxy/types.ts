import { Document } from "../search/micro-search";

export interface Menu extends Document {
  title: string;
  id: string;
  provider: {
    name: string;
    id: string;
  };
}

export interface Meal {
  value: string;
}

export interface Day {
  date: string;
  meals: Meal[];
}
