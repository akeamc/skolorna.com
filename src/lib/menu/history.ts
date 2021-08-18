import { useHistory } from "../history/history";

export function useMenuHistory() {
  return useHistory("menuHistory");
}
