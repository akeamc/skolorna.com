import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ArrowRight } from "react-feather";
import Button from "./Button";

export default {
  title: "Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = { children: "Save" };

export const Danger = Template.bind({});
Danger.args = { children: "Delete", mood: "danger" };

export const Disabled = Template.bind({});
Disabled.args = { children: "Unclickable", disabled: true };

export const Icon = Template.bind({});
Icon.args = { children: "Continue", icon: ArrowRight };
