export class ProxyHttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly req: Request,
    private res: Response,
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

  async post<Input, Output>(path: string, input: Input): Promise<Output> {
    const token = this.req.headers.get("session_token");

    const req = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        cookie: token ?? "",
        "content-type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!req.ok) {
      throw new Error(`Request failed: ${req.status}, ${req.statusText}`);
    }

    if (req.headers.get("session_token")) {
    }

    const res = await req.json();
    return res as Output;
  }
}
