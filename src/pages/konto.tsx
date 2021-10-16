import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Main from "../components/layout/Main";
import { useAuth } from "../lib/auth/context";
import Container from "../components/layout/Container";
import PageHeading from "../components/typography/PageHeading";
import InlineSkeleton from "../components/skeleton/InlineSkeleton";
import LogoutButton from "../components/auth/LogoutButton";

const MyAccount: NextPage = () => {
  const { unauthenticated, user } = useAuth();
  const router = useRouter();

  if (unauthenticated) {
    router.push("/");

    return null;
  }

  return (
    <Main title="Konto">
      <Container>
        <PageHeading>
          Hej {user?.full_name ?? <InlineSkeleton width="4em" />}
        </PageHeading>
        <pre>{JSON.stringify(user, undefined, 2)}</pre>
        <LogoutButton />
      </Container>
    </Main>
  );
};

export default MyAccount;
