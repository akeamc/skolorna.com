import { decode } from "jsonwebtoken";
import urljoin from "url-join";

export interface Auth1ClientOptions {
  endpoint: string;
  refreshTokenLocalStorageKeyRenameMePlease?: string;
  accessTokenLocalStorageKeyRenameMePlease?: string;
  accessTokenMinTtl?: number;
}

export interface User {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  email: string;
  password: string;
  full_name: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
}

export default class Auth1Client {
  constructor(private options: Auth1ClientOptions) {}

  private get refreshTokenLocalStorageKey() {
    return (
      this.options.refreshTokenLocalStorageKeyRenameMePlease ?? "refresh_token"
    );
  }

  private get accessTokenLocalStorageKey() {
    return (
      this.options.accessTokenLocalStorageKeyRenameMePlease ?? "access_token"
    );
  }

  public isAuthenticated(): boolean {
    return typeof this.getStoredRefreshToken() === "string" || typeof this.getStoredAccessToken() === "string";
  }

  private accessTokenBbf(): number {
    return new Date().getTime() / 1000 + (this.options.accessTokenMinTtl ?? 60);
  }

  private makeRequest(path: string, init?: RequestInit) {
    const url = urljoin(this.options.endpoint, path);

    return fetch(url, init);
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenLocalStorageKey);
  }

  private setRefreshToken(value?: string) {
    if (typeof value === "string") {
      localStorage.setItem(this.refreshTokenLocalStorageKey, value);
    } else {
      localStorage.removeItem(this.refreshTokenLocalStorageKey);
    }
  }

  private getStoredAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenLocalStorageKey);
  }

  private setAccessToken(value?: string) {
    if (typeof value === "string") {
      localStorage.setItem(this.accessTokenLocalStorageKey, value);
    } else {
      localStorage.removeItem(this.accessTokenLocalStorageKey);
    }
  }

  private async forceRefreshAccessToken(): Promise<string> {
    // eslint-disable-next-line no-console
    console.info("refreshing access token");

    const refreshToken = this.getStoredRefreshToken();

    if (typeof refreshToken !== "string") {
      throw new Error("no refresh token in storage");
    }

    const payload = {
      refresh_token: refreshToken,
    };

    const res = await this.makeRequest("/token", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const { access_token: accessToken } = await res.json();

    this.setAccessToken(accessToken);

    return accessToken;
  }

  public async health(): Promise<boolean> {
    const res = await this.makeRequest("/health");

    return res.ok;
  }

  public async getAccessToken(): Promise<string> {
    const stored = this.getStoredAccessToken();

    if (typeof stored === "string") {
      // TODO: Maybe don't decode the token every time
      const data = decode(stored, { json: true });

      if (typeof data?.exp === "number" && this.accessTokenBbf() < data.exp) {
        // eslint-disable-next-line no-console
        console.info("stored access token is sufficient");
        return stored;
      }
    }

    return this.forceRefreshAccessToken();
  }

  public async login(credentials: LoginUser): Promise<void> {
    const res = await this.makeRequest("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: TokenResponse = await res.json();

    this.setAccessToken(data.access_token);
    this.setRefreshToken(data.refresh_token);
  }

  public async register(details: RegisterUser): Promise<void> {
    const res = await this.makeRequest("/register", {
      method: "POST",
      body: JSON.stringify(details),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: TokenResponse = await res.json();

    this.setAccessToken(data.access_token);
    this.setRefreshToken(data.refresh_token);
  }

  /**
   * Get the currently logged in user, or `null` if nobody is logged in.
   * If the request fails, an error is returned.
   */
  public async me(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    const res = await this.makeRequest("/users/@me", {
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    });

    if (!res.ok) {
      throw new Error(await res.json());
    }

    return res.json();
  }

  public async logout(): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      if (typeof accessToken === "string") {
        const payload = decode(accessToken, { json: true, complete: true });
        const kid = payload?.header?.kid;

        if (typeof kid === "string") {
          const res = await this.makeRequest(`/users/@me/sessions/${kid}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!res.ok) {
            // eslint-disable-next-line no-console
            console.warn(await res.text());
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    } finally {
      this.setAccessToken(undefined);
      this.setRefreshToken(undefined);
    }
  }
}

export const auth = new Auth1Client({
  endpoint: "https://api-staging.skolorna.com/v0/auth",
});
