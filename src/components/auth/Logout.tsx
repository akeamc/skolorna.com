import React, { FunctionComponent } from "react";
import { LogOut } from "react-feather";
import { useAuth } from "../../lib/auth/context";
import Button from "../button/Button";

const LogoutButton: FunctionComponent = () => {
  const { logout, unauthenticated } = useAuth();

  return (
    <Button
      type="button"
      mood="danger"
      onClick={() => logout()}
      icon={LogOut}
      disabled={unauthenticated}
    >
      Logga ut
    </Button>
  );
};

export default LogoutButton;
