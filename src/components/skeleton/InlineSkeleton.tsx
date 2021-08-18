import React, { FunctionComponent } from "react";
import Skeleton, { SkeletonProps } from "./Skeleton";

export interface InlineSkeletonProps extends SkeletonProps {
  count?: number;
}

/**
 * An inline skeleton.
 *
 * @param {React.PropsWithChildren<InlineSkeletonProps>} props Props.
 *
 * @returns {React.ReactElement} The rendered skeleton.
 */
const InlineSkeleton: FunctionComponent<InlineSkeletonProps> = ({
  count = 1,
  className,
  ...skeletonProps
}) => (
  <span>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        className={className}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...skeletonProps}
      >
        &zwnj;
      </Skeleton>
    ))}
  </span>
);

export default InlineSkeleton;
