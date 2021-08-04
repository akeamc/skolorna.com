export interface Menu {
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
