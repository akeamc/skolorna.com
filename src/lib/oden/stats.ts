import useSWR, { SWRResponse } from "swr";
import { request } from "./client";

export interface MenuStats {
  menus: number;
  days: number;
}

const PATH = "/stats";

export const getStats = () => request<MenuStats>(PATH);

export const useStats = () => useSWR(PATH, getStats);
