import Link from "next/link";
import React, { FunctionComponent } from "react";
import { Menu } from "../../lib/menu-proxy/types";
import MenuTicker from "./ticker";

export interface MenuTileProps {
  menu: Menu;
}

const MenuTile: FunctionComponent<MenuTileProps> = ({ menu }) => {
  return (
    <Link href={`/menus/${menu.id}`}>
      <a className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-4 my-2 block">
        <div className="font-medium">
          <h3 className="text-gray-400">{menu.provider.name}</h3>
          <h2>{menu.title}</h2>
          <MenuTicker query={{ menu: menu.id }} />
        </div>
      </a>
    </Link>
  );
};

export default MenuTile;
