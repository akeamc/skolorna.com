
import React, { FunctionComponent, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import {decode} from "jsonwebtoken";
import { getAccessToken, login, LoginUser } from "../../lib/auth/api";

const Login: FunctionComponent = () => {
	useEffect(() => {
		async function bruh() {
		const token = await getAccessToken("b9bec1a5-aa6a-42bf-8dc4-3efc89a5d3a9.DXFm6jQGy0mdG5D372ZqOaKY8WQANrSo0DNCrEBDsID7yqmgGvOTUJ0w_nI");
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
