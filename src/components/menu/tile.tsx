import { DateTime } from "luxon";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { Menu } from "../../lib/menu-proxy/types";
import MenuTicker from "./ticker";

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
const MenuTile: FunctionComponent<MenuTileProps> = ({ menu }) => {
  const first = DateTime.now();
  const last = first.plus({ weeks: 1 });

  return (
    <Link href={`/menus/${menu.id}`}>
      <a className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-4 my-2 block">
        <div className="font-medium">
          <h3 className="text-gray-400">{menu.provider.name}</h3>
          <h2>{menu.title}</h2>
        </div>
        <MenuTicker query={{ menu: menu.id, first, last }} />
      </a>
    </Link>
  );
};

export default MenuTile;
