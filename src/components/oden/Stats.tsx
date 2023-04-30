import { useStats } from "@/lib/oden/hooks";
import { FunctionComponent } from "react";

export const Meals: FunctionComponent = () => {
  const { data } = useStats();

  return <>{data?.meals?.toLocaleString("sv")}</>;
};
