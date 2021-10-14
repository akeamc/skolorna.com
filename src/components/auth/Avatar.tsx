import classNames from "classnames";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { useAuth } from "../../lib/auth/context";
import styles from "./Avatar.module.scss";

export interface AvatarProps {
  className?: string;
  clickable?: boolean;
}

const Avatar: FunctionComponent<AvatarProps> = ({
  className: forwardedClassName,
  clickable = false,
}) => {
  const { user } = useAuth();
  const className = classNames(styles.avatar, forwardedClassName);

  const inner = (
    <>
      {user && (
        <img src="http://placekitten.com/480/480" alt="" draggable="false" />
      )}
    </>
  );

  if (clickable) {
    return (
      <Link href="/konto" passHref>
        <a className={className}>{inner}</a>
      </Link>
    );
  }

  return (
    <div className={className}>{inner}</div>
    //
  );
};

export default Avatar;
