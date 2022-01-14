import classNames from "classnames/bind";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import styles from "./Skeleton.module.scss";

const cx = classNames.bind(styles);

export interface SkeletonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  width?: string;
  height?: string;
}

/**
 * A loading skeleton, used as a placeholder.
 *
 * @param {React.PropsWithChildren<SkeletonProps>} props Props.
 *
 * @returns {React.ReactElement} The skeleton.
 */
export const Skeleton: FunctionComponent<SkeletonProps> = ({
  className,
  width,
  height,
  ...props
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  const handleResize = useCallback(() => {
    if (ref.current) {
      ref.current.style.setProperty(
        "--offset-left",
        `${ref.current.offsetLeft}px`
      );
    }
  }, []);

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <span
      className={cx("skeleton", className)}
      style={{
        width,
        height,
      }}
      ref={ref}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};
