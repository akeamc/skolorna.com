import {
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Day, Schedule } from "./client";
import { DateTime } from "luxon";
import request from "../request";
import { API_URL } from "../api/config";

export function useDays(around: DateTime, count: number) {
  const q = {
    year: around.weekYear,
    week: around.weekNumber,
  };
  const { data: schedule, status } = useQuery({
    queryKey: ["skool", "schedule", q],
    queryFn: async () => {
      const res = await request(
        `${API_URL}/skool/schedule?year=${q.year}&week=${q.week}`,
        {
          cache: "no-cache",
          credentials: "include",
        }
      );
      return Schedule.fromJSON(await res.json());
    },
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
  return useQuery({
    queryKey: ["skool", "classes"],
    queryFn: async () => {
      const res = await request(`${API_URL}/skool/classes`, {
        credentials: "include",
      });
      return await res.json();
    },
  });
}

interface CredentialsStat {
  username: string;
  updated_at: string;
  school: string;
  class: string;
}

export function useCredentials() {
  return useQuery({
    queryKey: ["skool", "credentials"],
    queryFn: async () => {
      const res = await request(`${API_URL}/skool/credentials`, {
        credentials: "include",
      });

      if (res.status === 401) return null;

      return (await res.json()) as CredentialsStat;
    },
  });
}

interface Credentials {
  service: "skolplattformen";
  username: string;
  password: string;
}

async function deleteCredentials() {
  const res = await request(`${API_URL}/skool/credentials`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

async function setCredentials(
  credentials: Credentials | null
): Promise<CredentialsStat | null> {
  if (!credentials) {
    await deleteCredentials();
    return null;
  }

  const res = await request(`${API_URL}/skool/credentials`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  if (res.status === 401) {
    throw {
      code: "bad_credentials",
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
  code: "not_logged_in" | "bad_credentials" | "unknown";
  message?: string;
}

const HUMAN_ERRORS: Record<
  Exclude<SetCredentialsError["code"], "unknown">,
  string
> = {
  not_logged_in: "Du är inte inloggad.",
  bad_credentials: "Fel användarnamn eller lösenord.",
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
  const client = useQueryClient();
  return useMutation<
    CredentialsStat | null,
    SetCredentialsError,
    Credentials | null
  >({
    mutationKey: ["skool", "credentials"],
    mutationFn: async (d: Credentials | null) => {
      const credentials = await setCredentials(d);

      client.setQueryData(["skool", "credentials"], credentials);
      client.invalidateQueries({ queryKey: ["skool"] });

      return credentials;
    },
    ...options,
  });
}
