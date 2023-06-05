import { FunctionComponent, useId } from "react";
import styles from "./Star.module.css";

export interface StarProps {
  level: number;
  size?: number;
}

const Star: FunctionComponent<StarProps> = ({ level, size = 16 }) => {
  const gradientId = useId();

  return (
    <svg width={size} height={size} viewBox="0 0 22 22">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop className={styles.filled} offset="0%" />
          <stop className={styles.filled} offset={`${level * 100}%`} />
          <stop className={styles.unfilled} offset={`${level * 100}%`} />
        </linearGradient>
      </defs>
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M10.1033 1.81663C10.4701 1.07346 11.5299 1.07346 11.8967 1.81663L14.1666 6.41509C14.3121 6.70994 14.5933 6.9144 14.9186 6.96195L19.9962 7.70412C20.8161 7.82396 21.1429 8.8318 20.5493 9.40996L16.8768 12.987C16.6409 13.2167 16.5333 13.5479 16.5889 13.8724L17.4554 18.9246C17.5955 19.7416 16.738 20.3646 16.0044 19.9787L11.4655 17.5918C11.1741 17.4385 10.8259 17.4385 10.5345 17.5918L5.99563 19.9787C5.262 20.3646 4.40445 19.7416 4.54457 18.9246L5.41109 13.8724C5.46675 13.5479 5.35908 13.2167 5.12321 12.987L1.45068 9.40996C0.857086 8.8318 1.18387 7.82396 2.00378 7.70412L7.08137 6.96195C7.40672 6.9144 7.68791 6.70994 7.83345 6.41509L10.1033 1.81663Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
};

export default Star;
