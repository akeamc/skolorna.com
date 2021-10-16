import React, { FunctionComponent } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { ArrowRight } from "react-feather";
import * as Yup from "yup";
import zxcvbn from "zxcvbn";
import { RegisterUser } from "../../lib/auth/client";
import { useAuth } from "../../lib/auth/context";
import Button from "../button/Button";
import TextField from "../form/TextField";

const RegistrationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().test(
    "oh no",
    (value, { parent, path, createError }) => {
      const { password, ...fields } = parent;

      const { score, feedback } = zxcvbn(value ?? "", Object.values(fields));

      if (score >= 3) {
        return true;
      }

      return createError({
        path,
        message: feedback.suggestions.toString(),
      });
    }
  ),
  full_name: Yup.string().required("Required"),
});

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
      validationSchema={RegistrationSchema}
    >
      <Form>
        <TextField name="email" type="email" placeholder="E-postadress" />
        <TextField name="password" type="password" placeholder="Lösenord" />
        <TextField name="full_name" type="text" placeholder="Namn" />
        <Button type="submit" icon={ArrowRight}>
          Registrera
        </Button>
      </Form>
    </Formik>
  );
};

export default Register;
