type GeoApifyUrlParameter = "filter" | "limit" | "lang" | "format";

type GeoApifyDefaultUrlParameters = Record<GeoApifyUrlParameter, string>;

export const GEOAPIFY_DEFAULT_URL_PARAMS = {
  filter: "countrycode:us",
  limit: "10",
  lang: "en",
  format: "json",
} as const satisfies GeoApifyDefaultUrlParameters;
