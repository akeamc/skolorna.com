import { DateTime } from "luxon";
import { useMemo } from "react";
// TODO: Make this SSR-safe - the stored value should never be returned on the first render
import createPersistedState from "use-persisted-state";

export type HistoryMap = Record<string, string>;

export interface HistoryItem {
  visitedAt: DateTime;
  key: string;
}

export interface UseHistoryMap {
  add: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  stack: HistoryItem[];
}

export function useHistory(localStorageKey: string): UseHistoryMap {
  const usePersistedState = useMemo(
    () => createPersistedState(localStorageKey),
    [localStorageKey]
  );
  const [values, setValues] = usePersistedState<HistoryMap>({});

  return {
    add: (key, timestamp = DateTime.now()) => {
      setValues({ ...values, [key]: timestamp.toISO() });
    },
    remove: (key) => {
      delete values[key];
      setValues({ ...values });
    },
    clear: () => setValues({}),
    stack: Object.entries(values)
      .map(([key, visitedAt]) => ({
        key,
        visitedAt: DateTime.fromISO(visitedAt),
      }))
      .sort((a, b) => +b.visitedAt - +a.visitedAt),
  };
}
