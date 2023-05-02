export type View = "month" | "week" | "day";

const VIEWS: View[] = ["month", "week", "day"];

export function isView(view: string): view is View {
  return VIEWS.includes(view as View);
}
