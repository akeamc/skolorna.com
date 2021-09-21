
import React, { FunctionComponent } from "react";
import { Formik, Field, Form } from "formik";
import { login, LoginUser } from "../../lib/auth/api";

const Login: FunctionComponent = () => {
	const initialValues: LoginUser = {
		email: "",
		password: "",
	};
	
	return (
		<Formik onSubmit={login} initialValues={initialValues}>
			<Form>
				<Field name="email" type="email" /> 
				<Field name="password" type="password" />
				<button type="submit">Submit</button>
			</Form>
		</Formik>
	);
	};

export default Login;
