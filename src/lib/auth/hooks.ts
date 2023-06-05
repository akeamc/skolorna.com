import { useQuery } from "@tanstack/react-query";
import { API_URL, Account, Profile } from "./auth";
import request from "../request";

export function useProfile(id?: string) {
  return useQuery({
    queryKey: ["auth", "users", id, "profile"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/users/${id}/profile`);
      return (await res.json()) as Profile;
    },
    enabled: !!id,
  });
}

export function useAccount() {
  return useQuery({
    queryKey: ["auth", "account"],
    queryFn: async () => {
      const res = await request(`${API_URL}/account`);
      if (!res.ok) return null;
      return (await res.json()) as Account;
    },
  });
}
