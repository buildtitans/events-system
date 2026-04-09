describe("configureTrpcRoute", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    jest.resetModules();

    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: "development",
      NEXT_PUBLIC_DEV_API_URL: "http://localhost:3001/api/trpc",
      NEXT_PUBLIC_PROD_API_URL: "/api/trpc",
    };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it.each([
    {
      label: "returns dev fastify URL for dev browser",
      isProduction: false,
      isBrowser: true,
      expected: "http://localhost:3001/api/trpc",
    },
    {
      label: "returns dev fastify URL for dev server",
      isProduction: false,
      isBrowser: false,
      expected: "http://localhost:3001/api/trpc",
    },
    {
      label: "returns relative api route for prod browser",
      isProduction: true,
      isBrowser: true,
      expected: "/api/trpc",
    },
    {
      label: "returns localhost fastify route for prod server",
      isProduction: true,
      isBrowser: false,
      expected: "http://127.0.0.1:3001/api/trpc",
    },
  ])("$label", ({ isProduction, isBrowser, expected }) => {
    const { configureTrpcRoute } = require("./configureTrpcRoute");

    expect(configureTrpcRoute(isProduction, isBrowser)).toBe(expected);
  });
});
