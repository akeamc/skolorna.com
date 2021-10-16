import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Main from "../components/layout/Main";
import { useAuth } from "../lib/auth/context";
import Container from "../components/layout/Container";
import PageHeading from "../components/typography/PageHeading";
import Login from "../components/auth/Login";

const LoginPage: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push("/konto");

    return null;
  }

  return (
    <Main title="Logga in">
      <Container>
        <PageHeading>Logga in</PageHeading>
        <Login />
      </Container>
    </Main>
  );
};

export default LoginPage;
