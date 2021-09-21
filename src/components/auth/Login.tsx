import React, { FunctionComponent, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { decode } from "jsonwebtoken";
import { refreshAccessToken, login, LoginUser } from "../../lib/auth/api";
import { useAuth } from "../../lib/auth/context";

const Login: FunctionComponent = () => {
  const { setRefreshToken, setAccessToken } = useAuth();

  useEffect(() => {
    async function bruh() {
      const token = await refreshAccessToken("");
      const decoded = decode(token);
      console.log(decoded);
      console.log(new Date(decoded.exp * 1000));
    }

    bruh();
  }, []);

  const initialValues: LoginUser = {
    email: "",
    password: "",
  };

  return (
    <Formik
      onSubmit={async (values) => {
        const { refresh_token, access_token } = await login(values);
        setRefreshToken(refresh_token);
        setAccessToken(access_token);
      }}
      initialValues={initialValues}
    >
      <Form>
        <Field name="email" type="email" />
        <Field name="password" type="password" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default Login;
