import classNames from "classnames/bind";
import React, {
  ButtonHTMLAttributes,
  ComponentType,
  DetailedHTMLProps,
  FunctionComponent,
} from "react";
import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  type: "button" | "submit" | "reset";
  mood?: "danger";
  icon?: ComponentType<{ className?: string }>;
}

const Button: FunctionComponent<ButtonProps> = ({
  type,
  mood,
  className,
  children,
  icon: Icon,
  ...forwardedProps
}) => (
  <button
    className={cx("button", mood, className)}
    // eslint-disable-next-line react/button-has-type
    type={type}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...forwardedProps}
  >
    {children}
    {Icon && <Icon className={cx("icon")} />}
  </button>
);

export default Button;
