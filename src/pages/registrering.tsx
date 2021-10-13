import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Main from "../components/layout/Main";
import { useAuth } from "../lib/auth/context";
import Container from "../components/layout/Container";
import PageHeading from "../components/typography/PageHeading";
import Register from "../components/auth/Register";
import LogoutButton from "../components/auth/Logout";

const RegistrationPage: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push("/konto");

    return null;
  }

  return (
    <Main title="Konto">
      <Container>
        <PageHeading>Skapa konto</PageHeading>
        <Register />
        <LogoutButton />
      </Container>
    </Main>
  );
};

export default RegistrationPage;
