
import React, { FunctionComponent } from "react";
import { Formik, Field, Form } from "formik";
import { createUser, CreateUser } from "../../lib/auth/api";

const Signup: FunctionComponent = () => {
	const initialValues: CreateUser = {
		email: "",
		password: "",
		full_name: "",
	};
	
	return (
		<Formik onSubmit={createUser} initialValues={initialValues}>
			<Form>
				<Field name="email" type="email" /> 
				<Field name="password" type="password" /> 
				<Field name="full_name" /> 
				<button type="submit">Submit</button>
			</Form>
		</Formik>
	);
	};

export default Signup;
