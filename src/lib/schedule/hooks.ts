import {
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../auth/context";
import { Day, Schedule } from "./client";
import { DateTime } from "luxon";

export function useDays(around: DateTime, count: number) {
  const { accessToken } = useAuth();
  const q = {
    year: around.weekYear,
    week: around.weekNumber,
  };
  const { data: schedule, status } = useQuery({
    queryKey: ["skool", "schedule", q],
    queryFn: async () => {
      const res = await fetch(
        `https://api.skolorna.com/v0/skool/schedule?year=${q.year}&week=${q.week}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
          cache: "no-cache",
        }
      );
      return Schedule.fromJSON(await res.json());
    },
    enabled: !!accessToken,
  });
  const start = around.startOf("week");

  const days: Day[] = Array.from({ length: count }).map((_, i) => ({
    date: start.plus({ days: i }),
    lessons: [],
  }));

  for (const lesson of schedule?.lessons ?? []) {
    const day = days.find((day) => day.date.hasSame(lesson.start, "day"));

    if (day) {
      day.lessons.push(lesson);
    } else {
      console.warn("missing day for lesson", lesson);
      days.push({ date: lesson.start, lessons: [lesson] });
    }
  }

  return { days, status };
}

export function useClasses() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["skool", "classes"],
    queryFn: async () => {
      const res = await fetch(`https://api.skolorna.com/v0/skool/classes`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      return await res.json();
    },
    enabled: !!accessToken,
  });
}

interface CredentialsStat {
  username: string;
  updated_at: string;
  school: string;
  class: string;
}

export function useCredentials() {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["skool", "credentials"],
    queryFn: async () => {
      const res = await fetch(`https://api.skolorna.com/v0/skool/credentials`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 404) return null;

      return (await res.json()) as CredentialsStat;
    },
    enabled: !!accessToken,
  });
}

interface Credentials {
  service: "skolplattformen";
  username: string;
  password: string;
}

async function deleteCredentials(accessToken: string) {
  const res = await fetch("https://api.skolorna.com/v0/skool/credentials", {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

async function setCredentials(
  credentials: Credentials | null,
  accessToken: string
): Promise<CredentialsStat | null> {
  if (!credentials) {
    await deleteCredentials(accessToken);
    return null;
  }

  const res = await fetch("https://api.skolorna.com/v0/skool/credentials", {
    method: "PUT",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (res.status === 400) {
    throw {
      code: "invalid_credentials",
      message: await res.text(),
    } satisfies SetCredentialsError;
  }

  if (!res.ok) {
    throw {
      code: "unknown",
      message: await res.text(),
    } satisfies SetCredentialsError;
  }

  return (await res.json()) as CredentialsStat;
}

interface SetCredentialsError {
  code: "not_logged_in" | "invalid_credentials" | "unknown";
  message?: string;
}

const HUMAN_ERRORS: Record<
  Exclude<SetCredentialsError["code"], "unknown">,
  string
> = {
  not_logged_in: "Du är inte inloggad.",
  invalid_credentials: "Fel användarnamn eller lösenord.",
};

export function errorToString(e: SetCredentialsError): string {
  if (e.code === "unknown") return e.message ?? "Okänt fel";
  return HUMAN_ERRORS[e.code];
}

export function useCredentialsMutation(
  options?: UseMutationOptions<
    CredentialsStat | null,
    SetCredentialsError,
    Credentials | null
  >
) {
  const { accessToken } = useAuth();
  const client = useQueryClient();
  return useMutation<
    CredentialsStat | null,
    SetCredentialsError,
    Credentials | null
  >({
    mutationKey: ["skool", "credentials"],
    mutationFn: async (d: Credentials | null) => {
      if (!accessToken)
        throw { code: "not_logged_in" } satisfies SetCredentialsError;
      const credentials = await setCredentials(d, accessToken);

      client.setQueryData(["skool", "credentials"], credentials);
      client.invalidateQueries({ queryKey: ["skool"] });

      return credentials;
    },
    ...options,
  });
}
