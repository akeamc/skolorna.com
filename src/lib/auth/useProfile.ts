import { useQuery } from "@tanstack/react-query";
import { Profile } from "./auth";

export default function useProfile(id?: string) {
  return useQuery({
    queryKey: ["auth", "users", id, "profile"],
    queryFn: async () => {
      const res = await fetch(
        `https://api.skolorna.com/v0/auth/users/${id}/profile`
      );
      return (await res.json()) as Profile;
    },
    enabled: !!id,
  });
}
