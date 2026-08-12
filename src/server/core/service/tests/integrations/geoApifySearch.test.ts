import { GeoApifySearch } from "@/src/server/core/service/integrations/geoApifySearch";

describe("GeoApifySearch", () => {
  const config = {
    geoApifyUrl: "https://api.geoapify.com/v1/geocode/autocomplete",
    geoApifyKey: "test-api-key",
  };

  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    fetchMock = jest.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it("queries Geoapify with default and request-specific parameters", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ results: [] }),
    } as unknown as Response);

    const service = new GeoApifySearch(config);

    await service.suggestAddresses("123 Main Street", "street");

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [requestUrl, requestInit] = fetchMock.mock.calls[0];
    const url = new URL(String(requestUrl));

    expect(`${url.origin}${url.pathname}`).toBe(config.geoApifyUrl);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      filter: "countrycode:us",
      limit: "10",
      lang: "en",
      format: "json",
      text: "123 Main Street",
      type: "street",
      apiKey: config.geoApifyKey,
    });
    expect(requestInit).toEqual({ method: "GET" });
  });

  it("defaults the location type to street", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ results: [] }),
    } as unknown as Response);

    const service = new GeoApifySearch(config);

    await service.suggestAddresses("123 Main Street");

    const [requestUrl] = fetchMock.mock.calls[0];
    const url = new URL(String(requestUrl));

    expect(url.searchParams.get("type")).toBe("street");
  });

  it("returns a failure result when Geoapify rejects the request", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
    } as Response);

    const service = new GeoApifySearch(config);

    await expect(service.suggestAddresses("Main Street")).resolves.toMatchObject(
      {
        status: "failed",
        message: expect.stringContaining("429 Too Many Requests"),
      },
    );
  });

  it("converts Geoapify results into address suggestions", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        results: [
          {
            formatted: "123 Main Street, Springfield, IL",
            county: "Sangamon County",
            country: "United States",
            state: "Illinois",
            city: "Springfield",
            street: "Main Street",
          },
        ],
      }),
    } as unknown as Response);

    const service = new GeoApifySearch(config);

    await expect(service.suggestAddresses("123 Main")).resolves.toEqual({
      status: "success",
      data: [
        {
          label: "123 Main Street, Springfield, IL",
          sublabel: "Sangamon County",
          country: "United States",
          state: "Illinois",
          city: "Springfield",
          street: "Main Street",
        },
      ],
    });
  });
});
