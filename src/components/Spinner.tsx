import React, { FunctionComponent } from "react";
import classNames from "classnames/bind";
import { HTMLMotionProps, motion } from "framer-motion";
import styles from "./Spinner.module.scss";

const cx = classNames.bind(styles);

export const Spinner: FunctionComponent<HTMLMotionProps<"div">> = ({
  className,
  ...props
}) => <motion.div className={cx("spinner", className)} {...props} />;
