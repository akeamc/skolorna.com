import React, { FunctionComponent } from "react";
import { Menu } from "../../lib/menu-proxy/types";
import NextDayList from "./NextDayList";
import Tile from "../tile/Tile";

export interface MenuTileProps {
  menu: Menu;
}

/**
 * A tile displaying information about a menu.
 *
 * @todo Does this work with SSR?
 *
 * @param {React.PropsWithChildren<MenuTileProps>} props Props.
 * @returns {React.ReactElement} A rendered menu tile.
 */
const MenuTile: FunctionComponent<MenuTileProps> = ({ menu }) => (
  <Tile
    href={`/menus/${menu.id}`}
    heading={menu.title}
    subHeading={
      <>
        Via <mark>{menu.provider.name}</mark>
      </>
    }
  >
    <NextDayList menu={menu.id} />
  </Tile>
);

export default MenuTile;
