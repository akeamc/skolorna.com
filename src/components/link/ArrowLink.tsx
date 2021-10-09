import classNames from "classnames/bind";
import React, {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  FunctionComponent,
} from "react";
import { ArrowRight } from "react-feather";
import styles from "./ArrowLink.module.scss";

const cx = classNames.bind(styles);

const ArrowLink: FunctionComponent<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
> = ({ children, className, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <a {...rest} className={cx("link", className)}>
    <span className={cx("text")}>{children}</span>
    <ArrowRight className={cx("icon")} />
  </a>
);

export default ArrowLink;
