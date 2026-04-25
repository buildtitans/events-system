import { Static, Type } from "@sinclair/typebox";

const GeoapifyAutocompleteResultSchema = Type.Object(
  {
    lat: Type.Number(),
    lon: Type.Number(),
    place_id: Type.String(),
    formatted: Type.Optional(Type.String()),
    address_line1: Type.Optional(Type.String()),
    address_line2: Type.Optional(Type.String()),
  },
  { additionalProperties: true },
);

export const GeoapifyGeocodingResponseSchema = Type.Object(
  {
    results: Type.Array(GeoapifyAutocompleteResultSchema),
    query: Type.Optional(Type.Unknown()),
  },
  { additionalProperties: true },
);

export type GeoapifyGeocodingResponseType = Static<
  typeof GeoapifyGeocodingResponseSchema
>;
