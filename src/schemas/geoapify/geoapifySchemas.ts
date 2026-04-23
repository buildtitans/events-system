import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const GeoapifyDatasourceSchema = Type.Object(
  {
    sourcename: Type.String(),
    attribution: Type.String(),
    license: Type.String(),
    url: Type.String({ format: "uri" }),
  },
  { additionalProperties: true },
);

const GeoapifyRankSchema = Type.Object(
  {
    importance: Type.Number(),
    popularity: Type.Number(),
    confidence: Type.Number(),
    confidence_city_level: Type.Number(),
    confidence_street_level: Type.Number(),
    match_type: Type.String(),
  },
  { additionalProperties: true },
);

const GeoapifyTimezoneSchema = Type.Object(
  {
    name: Type.String(),
    offset_STD: Type.String(),
    offset_STD_seconds: Type.Number(),
    offset_DST: Type.String(),
    offset_DST_seconds: Type.Number(),
    abbreviation_STD: Type.String(),
    abbreviation_DST: Type.String(),
  },
  { additionalProperties: true },
);

const GeoapifyGeocodingResultSchema = Type.Object(
  {
    datasource: GeoapifyDatasourceSchema,

    housenumber: Type.Optional(Type.String()),
    street: Type.Optional(Type.String()),
    suburb: Type.Optional(Type.String()),
    city: Type.Optional(Type.String()),
    county: Type.Optional(Type.String()),
    state: Type.Optional(Type.String()),
    postcode: Type.Optional(Type.String()),
    country: Type.Optional(Type.String()),
    country_code: Type.Optional(Type.String()),
    state_code: Type.Optional(Type.String()),

    lon: Type.Number(),
    lat: Type.Number(),

    formatted: Type.String(),
    address_line1: Type.Optional(Type.String()),
    address_line2: Type.Optional(Type.String()),
    result_type: Type.Optional(Type.String()),

    rank: Type.Optional(GeoapifyRankSchema),
    timezone: Type.Optional(GeoapifyTimezoneSchema),

    place_id: Type.String(),
  },
  { additionalProperties: true },
);

const GeoapifyParsedQuerySchema = Type.Object(
  {
    housenumber: Type.Optional(Type.String()),
    street: Type.Optional(Type.String()),
    postcode: Type.Optional(Type.String()),
    city: Type.Optional(Type.String()),
    state: Type.Optional(Type.String()),
    country: Type.Optional(Type.String()),
    expected_type: Type.Optional(Type.String()),
  },
  { additionalProperties: true },
);

const GeoapifyQuerySchema = Type.Object(
  {
    text: Type.String(),
    parsed: Type.Optional(GeoapifyParsedQuerySchema),
  },
  { additionalProperties: true },
);

export const GeoapifyGeocodingResponseSchema = Type.Object(
  {
    results: Type.Array(GeoapifyGeocodingResultSchema),
    query: GeoapifyQuerySchema,
  },
  { additionalProperties: true },
);

export type GeoapifyGeocodingResponseType = Static<
  typeof GeoapifyGeocodingResponseSchema
>;

export const CompiledGeoapifyGeocodingResponseSchema = TypeCompiler.Compile(
  GeoapifyGeocodingResponseSchema,
);
