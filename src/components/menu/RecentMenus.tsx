import { DateTime } from "luxon";
import React, { FunctionComponent } from "react";
import { X } from "react-feather";
import { useMenuHistory } from "../../lib/menu/history";
import { useMenu } from "../../lib/menu/menu";
import Grid from "../layout/Grid";
import GridHeading from "../typography/GridHeading";
import InfoText from "../typography/InfoText";
import MenuTile from "./MenuTile";
import styles from "./RecentMenus.module.scss";

interface RecentMenuProps {
  id: string;
  visitedAt: DateTime;
  removeItem: (key: string) => void;
}

const RecentMenu: FunctionComponent<RecentMenuProps> = ({ id, removeItem }) => {
  const { data } = useMenu(id);

  return (
    <div className={styles.recent}>
      {/* eslint-disable-next-line react/button-has-type */}
      {/* <button onClick={() => removeItem(id)}>ta bort</button> */}
      <div className={styles.wrapper}>
        <MenuTile menu={data} />
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          className={styles.floating}
          onClick={() => removeItem(id)}
          title={`Dölj ${data?.title ?? "(okänd)"} från snabbåtkomst`}
        >
          <X />
        </button>
      </div>
    </div>
  );
};

const RecentMenus: FunctionComponent = () => {
  const { stack, remove } = useMenuHistory();
  const slice = stack.slice(0, 3);

  return (
    <>
      <GridHeading>Snabbåtkomst</GridHeading>
      {/* <h1>senast visade</h1> */}
      <Grid>
        {slice.map(({ visitedAt, key }) => (
          <RecentMenu
            key={key}
            id={key}
            visitedAt={visitedAt}
            removeItem={remove}
          />
        ))}
      </Grid>
      {slice.length === 0 && (
        <div className={styles.empty}>
          <InfoText>Dina senast visade menyer syns här.</InfoText>
        </div>
      )}
    </>
  );
};

export default RecentMenus;
