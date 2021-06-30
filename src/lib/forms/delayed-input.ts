import { useCallback, useState } from "react";

export type SetInput = (value: string) => void;

export interface DelayedInput {
  setInput: SetInput;
  value: string;
  typing: boolean;
}

/**
 * Delay the effects of user input until the user has finished typing.
 *
 * @param {number} delay How many milliseconds to wait after the user pressed the latest key before considering the input "complete".
 *
 * @returns {DelayedInput} State info.
 */
export function useDelayedInput(delay = 500): DelayedInput {
  const [delayedValue, setDelayedValue] = useState<string>("");
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [typing, setTyping] = useState(false);

	const setInput: SetInput = useCallback((value) => {
		setTyping(true);

    if (timer) {
      clearTimeout(timer);
    }

    const timeout = setTimeout(() => {
      setDelayedValue(value);
      setTyping(false);
    }, delay);

    setTimer(timeout);
	}, [delay, timer]);

  return {
    setInput,
    value: delayedValue,
    typing,
  };
}
