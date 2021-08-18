import { useCallback, useState } from "react";

export type SetValue = (value: string) => void;

export interface DelayedInput {
  setInput: SetValue;
  /**
   * Skip the delay and set the output value instantly. Any value that has been sent but not received yet will be exterminated.
   */
  setOutput: SetValue;
  output: string;
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

  const setInput: SetValue = useCallback(
    (value) => {
      setTyping(true);

      if (timer) {
        clearTimeout(timer);
      }

      const timeout = setTimeout(() => {
        setDelayedValue(value);
        setTyping(false);
      }, delay);

      setTimer(timeout);
    },
    [delay, timer]
  );

  const setOutput: SetValue = useCallback(
    (value) => {
      if (timer) {
        clearTimeout(timer);
        setTimer(undefined);
      }

      setDelayedValue(value);
      setTyping(false);
    },
    [timer]
  );

  return {
    setInput,
    setOutput,
    output: delayedValue,
    typing,
  };
}
