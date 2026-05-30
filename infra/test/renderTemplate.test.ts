import { renderTemplate } from "../lib/config/renderTemplate";

describe("renderTemplate", () => {
  it("replaces named placeholders", () => {
    expect(
      renderTemplate("PGHOST={{ DB_HOST }}\nPGPORT={{ DB_PORT }}", {
        DB_HOST: "database.example.com",
        DB_PORT: "5432",
      }),
    ).toBe("PGHOST=database.example.com\nPGPORT=5432");
  });

  it("throws when a placeholder has no value", () => {
    expect(() => renderTemplate("PGHOST={{ DB_HOST }}", {})).toThrow(
      'Missing template value "DB_HOST"',
    );
  });

  it("throws when a placeholder does not match the supported token format", () => {
    expect(() =>
      renderTemplate("PGHOST={{ db_host }}", {
        DB_HOST: "database.example.com",
      }),
    ).toThrow("Unresolved template token(s)");
  });

  it("throws when a provided value is unused", () => {
    expect(() =>
      renderTemplate("PGHOST={{ DB_HOST }}", {
        DB_HOST: "database.example.com",
        DB_PORT: "5432",
      }),
    ).toThrow("Unused template value(s)");
  });
});
