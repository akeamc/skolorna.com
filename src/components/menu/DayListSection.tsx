import React, { FunctionComponent } from "react";
import { useDays } from "../../lib/menu-proxy/days";
import Grid from "../layout/Grid";
import DividedList from "../list/DividedList";
import InlineSkeleton from "../skeleton/InlineSkeleton";
import Tile from "../tile/Tile";
import { Meal } from "../../lib/menu-proxy/types";

export interface DayListSectionProps {
  menu?: string;
}

const DayListSection: FunctionComponent<DayListSectionProps> = ({ menu }) => {
  const { data } = useDays({ menu });

  return (
    <section>
      <Grid>
        {(data ?? new Array(12).fill(undefined)).map((day, i) => (
          <Tile key={day?.id ?? i} heading={day?.date ?? <InlineSkeleton />}>
            <DividedList>
              {(day?.meals ?? new Array(2).fill(undefined)).map(
                (meal: Meal | undefined, j: number) => (
                  <li key={meal?.value ?? j}>
                    {meal?.value ?? <InlineSkeleton />}
                  </li>
                )
              )}
            </DividedList>
          </Tile>
        ))}
      </Grid>
    </section>
  );
};

export default DayListSection;
