import { DateTime } from "luxon";
import React, { FunctionComponent } from "react";
import { useMenuHistory } from "../../lib/menu/history";
import { useMenu } from "../../lib/menu/menu";
import Grid from "../layout/Grid";
import MenuTile from "./MenuTile";
import styles from "./RecentMenus.module.scss";

interface RecentMenuProps {
  id: string;
  visitedAt: DateTime;
  removeItem: (key: string) => void;
}

const RecentMenu: FunctionComponent<RecentMenuProps> = ({
  id,
  visitedAt,
  removeItem,
}) => {
  const { data } = useMenu(id);

  return (
    <div className={styles.recent}>
      <span> visades {visitedAt.toLocaleString(DateTime.DATETIME_MED)}</span>
      {/* eslint-disable-next-line react/button-has-type */}
      <button onClick={() => removeItem(id)}>ta bort</button>
      <MenuTile menu={data} />
    </div>
  );
};

const RecentMenus: FunctionComponent = () => {
  const { stack, remove } = useMenuHistory();

  return (
    <>
      <h1>senast visade</h1>
      <Grid>
        {stack.map(({ visitedAt, key }) => (
          <RecentMenu
            key={key}
            id={key}
            visitedAt={visitedAt}
            removeItem={remove}
          />
        ))}
      </Grid>
    </>
  );
};

export default RecentMenus;
