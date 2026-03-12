export class ProxyHttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly req: Request,
  ) {}

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: {
        cookie: this.req.headers.get("cookie") ?? "",
        "content-type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    return res.json();
  }
}
