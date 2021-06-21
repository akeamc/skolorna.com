import React from "react";
import { Meta } from "@storybook/react";
import MenuTile from "./MenuTile";

export const Default = () => (
  <MenuTile
    menu={{
      id: "sodexo.10910e60-20ca-4478-b864-abd8007ad970",
      title: "Södermalmsskolan",
      provider: { name: "Sodexo", id: "sodexo" },
    }}
  />
);

export const Error = () => (
  <MenuTile
    menu={{
      id: "invalid-id",
      title: "Invalid id",
      provider: { name: "Some provider", id: "some-provider" },
    }}
  />
);

export default {
  title: "MenuTile",
  component: MenuTile,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "300px" }}>
        <Story />
      </div>
    ),
  ],
} as Meta;
