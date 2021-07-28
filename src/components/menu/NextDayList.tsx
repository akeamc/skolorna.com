import React, { FunctionComponent } from "react";
import { useDays } from "../../lib/menu-proxy/days";
import DividedList from "../list/DividedList";
import InlineSkeleton from "../skeleton/InlineSkeleton";

export interface NextDayListProps {
  menu: string;
  maxMeals?: number;
}

const NextDayList: FunctionComponent<NextDayListProps> = ({
  menu,
  maxMeals,
}) => {
  const { data, error } = useDays({
    menu,
  });

  const nextDay = data?.[0];

  if (error) {
    return <span>Ett fel inträffade</span>;
  }

  if (!nextDay) {
    // data has been received, but no nextDay is present.
    if (data) {
      return <span>Ingen information</span>;
    }

    // No data. It must be loading!
    return <InlineSkeleton count={3} />;
  }

  const { meals } = nextDay;

  const mealOverflow = meals.length - (maxMeals ?? meals.length);

  return (
    <DividedList>
      {meals.slice(0, maxMeals).map((meal) => (
        <li key={meal.value}>{meal.value}</li>
      ))}
      {mealOverflow > 0 && <li>(Ytterligare {mealOverflow})</li>}
    </DividedList>
  );
};

export default NextDayList;
