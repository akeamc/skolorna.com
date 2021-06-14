export interface Menu {
  title: string;
  id: string;
  provider: {
    name: string;
    id: string;
  };
}

export interface Day {
  date: string;
  meals: {
    value: string;
  }[];
}
