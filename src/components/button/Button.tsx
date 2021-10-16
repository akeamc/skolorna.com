import classNames from "classnames/bind";
import Link from "next/link";
import React, { ComponentType, FunctionComponent } from "react";
import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  mood?: "default" | "danger";
  className?: string;
  href?: string;
  icon?: ComponentType<{ className?: string }>;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: FunctionComponent<ButtonProps> = ({
  type = "button",
  variant = "primary",
  mood = "default",
  className: forwardedClassName,
  children,
  icon: Icon,
  href,
  ...forwardedProps
}) => {
  const className = cx("button", mood, variant, forwardedClassName);
  const content = (
    <>
      {children}
      {Icon && <Icon className={cx("icon")} />}
    </>
  );

  if (href) {
    return (
      <Link href={href} passHref>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <a className={className} href={href} {...forwardedProps}>
          {content}
        </a>
      </Link>
    );
  }

  return (
    <button
      className={className}
      // eslint-disable-next-line react/button-has-type
      type={type}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...forwardedProps}
    >
      {content}
    </button>
  );
};

export default Button;
