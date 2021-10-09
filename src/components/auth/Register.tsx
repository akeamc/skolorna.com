import React, { FunctionComponent } from "react";
import { Formik, Field, Form } from "formik";
import { useRouter } from "next/router";
import { ArrowRight } from "react-feather";
import { RegisterUser } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import Button from "../button/Button";

const Register: FunctionComponent = () => {
  const { register } = useAuth();
  const router = useRouter();

  const initialValues: RegisterUser = {
    email: "",
    password: "",
    full_name: "",
  };

  return (
    <Formik
      onSubmit={(v) => register(v).then(() => router.push("/konto"))}
      initialValues={initialValues}
    >
      <Form>
        <Field name="email" type="email" />
        <Field name="password" type="password" />
        <Field name="full_name" />
        <Button type="submit" icon={ArrowRight}>
          Registrera
        </Button>
      </Form>
    </Formik>
  );
};

export default Register;
