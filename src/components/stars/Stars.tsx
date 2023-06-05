import { FunctionComponent } from "react";
import Star from "./Star";

export interface StarsProps {
  filled: number;
  count?: number;
  size?: number;
  name?: string;
  onChange?: (value: number) => void;
}

const Stars: FunctionComponent<StarsProps> = ({
  filled,
  count = 5,
  size,
  name,
  onChange,
}) => (
  <div className="flex items-center">
    {[...Array(count)].map((_, i) => {
      const props = {
        size,
        level: Math.min(Math.max(filled - i, 0), 1),
      };

      if (onChange) {
        return (
          <label
            key={i}
            className="flex items-center rounded-sm ring-blue-700 ring-offset-1 focus-within:z-10 focus-within:ring-2"
          >
            <Star {...props} />
            <input
              className="sr-only"
              type="radio"
              name={name}
              value={i + 1}
              checked={filled === i + 1}
              onChange={() => onChange(i + 1)}
            />
          </label>
        );
      }

      return <Star key={i} {...props} />;
    })}
  </div>
);

export default Stars;
