import { useHistory } from "../utils/history";

export function useMenuHistory() {
  return useHistory("menu_history");
}
