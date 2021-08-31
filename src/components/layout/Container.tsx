import React, { FunctionComponent } from "react";
import classNames from "classnames/bind";
import styles from "./Container.module.scss";

const cx = classNames.bind(styles);

export interface ContainerProps {
  document?: boolean;
}

const Container: FunctionComponent<ContainerProps> = ({
  children,
  document,
}) => <div className={cx("container", { document })}>{children}</div>;

export default Container;
