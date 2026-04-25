import { Type, Static } from "@sinclair/typebox";

export const GeoapifyAutocompleteResultType = Type.Union([
  Type.Literal("unknown"),
  Type.Literal("amenity"),
  Type.Literal("building"),
  Type.Literal("street"),
  Type.Literal("suburb"),
  Type.Literal("district"),
  Type.Literal("postcode"),
  Type.Literal("city"),
  Type.Literal("county"),
  Type.Literal("state"),
  Type.Literal("country"),
]);

export const GeoapifyAutocompleteMatchType = Type.Union([
  Type.Literal("full_match"),
  Type.Literal("inner_part"),
  Type.Literal("match_by_building"),
  Type.Literal("match_by_street"),
  Type.Literal("match_by_postcode"),
  Type.Literal("match_by_city_or_disrict"),
  Type.Literal("match_by_country_or_state"),
]);

export const GeoapifyTimezoneSchema = Type.Object(
  {
    name: Type.Optional(Type.String()),
    name_alt: Type.Optional(Type.String()),
    offset_STD: Type.Optional(Type.String()),
    offset_STD_seconds: Type.Optional(Type.Number()),
    offset_DST: Type.Optional(Type.String()),
    offset_DST_seconds: Type.Optional(Type.Number()),
    abbreviation_STD: Type.Optional(Type.String()),
    abbreviation_DST: Type.Optional(Type.String()),
  },
  { additionalProperties: true },
);

export const GeoapifyRankSchema = Type.Object(
  {
    confidence: Type.Optional(Type.Number({ minimum: 0, maximum: 1 })),
    confidence_city_level: Type.Optional(
      Type.Number({ minimum: 0, maximum: 1 }),
    ),
    confidence_street_level: Type.Optional(
      Type.Number({ minimum: 0, maximum: 1 }),
    ),
    confidence_building_level: Type.Optional(
      Type.Number({ minimum: 0, maximum: 1 }),
    ),
    match_type: Type.Optional(GeoapifyAutocompleteMatchType),
  },
  { additionalProperties: true },
);

export const GeoapifyDatasourceSchema = Type.Object(
  {},
  { additionalProperties: true },
);

export const GeoapifyAutocompleteResultSchema = Type.Object(
  {
    name: Type.Optional(Type.String()),
    country: Type.Optional(Type.String()),
    country_code: Type.Optional(Type.String()),
    state: Type.Optional(Type.String()),
    state_code: Type.Optional(Type.String()),
    county: Type.Optional(Type.String()),
    county_code: Type.Optional(Type.String()),
    postcode: Type.Optional(Type.String()),
    city: Type.Optional(Type.String()),
    street: Type.Optional(Type.String()),
    housenumber: Type.Optional(Type.String()),

    lat: Type.Optional(Type.Number()),
    lon: Type.Optional(Type.Number()),

    formatted: Type.Optional(Type.String()),
    address_line1: Type.Optional(Type.String()),
    address_line2: Type.Optional(Type.String()),

    result_type: Type.Optional(GeoapifyAutocompleteResultType),
    distance: Type.Optional(Type.Number()),

    rank: Type.Optional(GeoapifyRankSchema),
    datasource: Type.Optional(GeoapifyDatasourceSchema),

    category: Type.Optional(Type.String()),
    timezone: Type.Optional(GeoapifyTimezoneSchema),
  },
  { additionalProperties: true },
);

export const GeoapifyAutocompleteJsonResponseSchema = Type.Object(
  {
    results: Type.Array(GeoapifyAutocompleteResultSchema),
  },
  { additionalProperties: true },
);

export type GeoapifyAutocompleteJsonResponse = Static<
  typeof GeoapifyAutocompleteJsonResponseSchema
>;

export type GeoapifyAutocompleteResultType = Static<
  typeof GeoapifyAutocompleteResultSchema
>;
