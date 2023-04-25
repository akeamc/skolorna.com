import { FunctionComponent } from "react";
import Star from "./Star";

const Stars: FunctionComponent<{
  level: number;
  count?: number;
  size?: number;
}> = ({ level, count = 5, size }) => {
  return (
    <div className="flex items-center">
      {[...Array(count)].map((_, i) => (
        <Star
          size={size}
          key={i}
          level={Math.min(Math.max(level * count - i, 0), 1)}
        />
      ))}
    </div>
  );
};

export default Stars;
