import React, { FunctionComponent } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { LogIn as LoginIcon } from "react-feather";
import * as Yup from "yup";
import { LoginUser } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import Button from "../button/Button";
import TextField from "../form/TextField";

const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Required"),
  password: Yup.string().required(),
});

const Login: FunctionComponent = () => {
  const { login } = useAuth();
  const router = useRouter();

  const initialValues: LoginUser = {
    email: "",
    password: "",
  };

  return (
    <Formik
      onSubmit={(v) => login(v).then(() => router.push("/konto"))}
      initialValues={initialValues}
      validationSchema={LoginSchema}
    >
      <Form>
        <TextField name="email" type="email" placeholder="E-postadress" />
        <TextField name="password" type="password" placeholder="Lösenord" />
        <Button type="submit" icon={LoginIcon}>
          Logga in
        </Button>
      </Form>
    </Formik>
  );
};

export default Login;
