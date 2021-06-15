import React, { FunctionComponent } from "react";
import Marquee from "react-fast-marquee";
import { ListDaysQuery, useDays } from "../../lib/menu-proxy/days";
import DayText from "./day-text";

export interface MenuTickerProps {
  query: ListDaysQuery;
}

const MenuTicker: FunctionComponent<MenuTickerProps> = ({ query }) => {
  const { data } = useDays(query);

  if (!data) {
    return <span>Läser in ...</span>;
  }

  return (
    <Marquee gradientWidth={48} speed={64} className="font-normal">
      {data.length > 0 ? (
        <ol>
          {data?.map((day) => (
            <li key={day.date} className="inline mx-2">
              <DayText day={day} />
            </li>
          ))}
        </ol>
      ) : (
        "Ingen information"
      )}
    </Marquee>
  );
};

export default MenuTicker;
