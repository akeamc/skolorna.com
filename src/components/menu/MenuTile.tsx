import React, { FunctionComponent } from "react";
import { Menu } from "../../lib/menu/types";
import NextDayList from "./NextDayList";
import Tile from "../tile/Tile";
import InlineSkeleton from "../skeleton/InlineSkeleton";

export interface MenuTileProps {
  menu?: Menu;
  error?: Error;
}

/**
 * A tile displaying information about a menu.
 *
 * @todo Does this work with SSR?
 *
 * @param {React.PropsWithChildren<MenuTileProps>} props Props.
 * @returns {React.ReactElement} A rendered menu tile.
 */
const MenuTile: FunctionComponent<MenuTileProps> = ({ menu, error }) => {
  if (error) {
    return (
      <Tile heading="???" subHeading="Ett fel inträffade" error>
        {/* Menyn kan inte läsas in. */}
        <NextDayList menu="bruh" />
      </Tile>
    );
  }

  return (
    <Tile
      href={menu?.id ? `/menyer/${menu.id}` : undefined}
      heading={menu?.title ?? <InlineSkeleton />}
      subHeading={
        menu?.provider?.name ? (
          <>
            Via <mark>{menu.provider.name}</mark>
          </>
        ) : (
          <InlineSkeleton width="8em" />
        )
      }
    >
      <NextDayList menu={menu?.id} maxMeals={3} />
    </Tile>
  );
};

export default MenuTile;
