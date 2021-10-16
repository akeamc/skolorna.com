import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Tile from "./Tile";

export default {
  title: "Tile",
  component: Tile,
  argTypes: {
    heading: {
      control: { type: "text" },
    },
    subHeading: {
      control: { type: "text" },
    },
    children: {
      control: { type: "text" },
    },
  },
} as ComponentMeta<typeof Tile>;

const Template: ComponentStory<typeof Tile> = (args) => <Tile {...args} />;

export const Default = Template.bind({});
Default.args = {
  heading: "This is the default tile",
  subHeading: "Subheading",
};

export const Clickable = Template.bind({});
Clickable.args = {
  heading: "This is a clickable tile",
  subHeading: "Topic",
  href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};
