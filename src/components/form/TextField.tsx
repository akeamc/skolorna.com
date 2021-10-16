/* eslint-disable react/jsx-props-no-spreading */
import classNames from "classnames/bind";
import { Field, FieldAttributes } from "formik";
import React, { FunctionComponent } from "react";
import styles from "./TextField.module.scss";

const cx = classNames.bind(styles);

export interface TextFieldProps extends FieldAttributes<any> {
  placeholder?: string;
}

const TextField: FunctionComponent<TextFieldProps> = ({
  placeholder,
  ...props
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Field {...props}>
    {(data: { meta: any; field: any }) => {
      const { meta, field } = data;

      return (
        <>
          <input
            {...props}
            {...field}
            placeholder={placeholder}
            className={cx("input", { error: meta.error })}
          />
          {meta.touched && meta.error && <div>{meta.error}</div>}
        </>
      );
    }}
  </Field>
);

export default TextField;
