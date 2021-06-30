import Link from "next/link";
import React, { FunctionComponent } from "react";
import { Menu } from "../../lib/menu-proxy/types";
import NextDayList from "./NextDayList";

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
  <Link href={`/menus/${menu.id}`}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-4 my-2 block text-sm font-medium">
      <h2 className="text-2xl font-semibold mb-2 tracking-tight">
        {menu.title}
      </h2>
      <NextDayList menu={menu.id} />
    </a>
  </Link>
);

export default MenuTile;
