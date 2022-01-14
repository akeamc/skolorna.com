import { Dispatch, SetStateAction, useMemo } from "react";
import createPersistedState from "use-persisted-state";

type UseState<S> = [S, Dispatch<SetStateAction<S>>];

export default function useStickyState<S>(
  key: string,
  initialValue?: S
): UseState<S | undefined> {
  const usePersistedState = useMemo(() => createPersistedState(key), [key]);
  return usePersistedState(initialValue);
}
