import { FunctionComponent } from "react";
import { useDays } from "../../lib/menu-proxy/days";
import InlineSkeleton from "../skeleton/InlineSkeleton";

export interface NextDayListProps {
  menu: string;
}

const NextDayList: FunctionComponent<NextDayListProps> = ({ menu }) => {
  const { data, error } = useDays({
    menu,
  });

  const nextDay = data?.[0];

  if (error) {
    return <span>Ett fel uppstod</span>;
  }

  if (data && !nextDay) {
    return <span>Ingen information</span>;
  }

  return (
    <ul className="list-inside list-disc">
      {(nextDay?.meals ?? new Array(2).fill(undefined)).map((meal, index) => (
        <li key={meal?.value ?? index}>{meal?.value ?? <InlineSkeleton />}</li>
      ))}
    </ul>
  );
};

export default NextDayList;
