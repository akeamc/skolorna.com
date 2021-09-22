import { decode } from "jsonwebtoken";
import { DateTime } from "luxon";
import urljoin from "url-join";

export interface Auth1ClientOptions {
  endpoint: string;
  refreshTokenLocalStorageKeyRenameMePlease?: string;
  accessTokenLocalStorageKeyRenameMePlease?: string;
  accessTokenRenewalMargin?: number;
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

  private accessTokenBbf(): number {
    return (
      new Date().getTime() / 1000 +
      (this.options.accessTokenRenewalMargin ?? 60)
    );
  }

  private makeRequest(path: string, init?: RequestInit) {
    const url = urljoin(this.options.endpoint, path);

    return fetch(url, init);
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenLocalStorageKey);
  }

  private setRefreshToken(value: string) {
    localStorage.setItem(this.refreshTokenLocalStorageKey, value);
  }

  private getStoredAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenLocalStorageKey);
  }

  private setAccessToken(value: string) {
    localStorage.setItem(this.accessTokenLocalStorageKey, value);
  }

  private async forceRefreshAccessToken(): Promise<string> {
    console.info("refreshing access token");

    const payload = {
      token: this.getStoredRefreshToken(),
    };

    const res = await this.makeRequest("/refresh", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const { access_token } = await res.json();

    this.setAccessToken(access_token);

    return access_token;
  }

  public async getAccessToken(): Promise<string> {
    const stored = this.getStoredAccessToken();

    if (typeof stored === "string") {
      const data = decode(stored, { json: true });

      if (typeof data?.exp === "number" && this.accessTokenBbf() < data.exp) {
        console.info("stored access token is sufficient");
        return stored;
      }
    }

    return this.forceRefreshAccessToken();
  }
}
