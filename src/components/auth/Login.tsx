import React, { FunctionComponent, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { LoginUser } from "../../lib/auth/api";
import Auth1Client from "../../lib/auth/client";

const Login: FunctionComponent = () => {
  useEffect(() => {
    async function bruh() {
      const client = new Auth1Client({
        endpoint: "https://api-staging.skolorna.com/v1/auth",
      });
      const token = await client.getAccessToken();
      console.log("got access token:", token);
    }

    bruh();
  }, []);

  const initialValues: LoginUser = {
    email: "",
    password: "",
  };

  return (
    <Formik
      onSubmit={(v) => {
        console.log(v);
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
