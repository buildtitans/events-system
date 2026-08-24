export type AddressSuggestion = {
  label: string;
  sublabel: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
};

export type LocationType =
  | "country"
  | "state"
  | "city"
  | "postcode"
  | "street"
  | "amenity"
  | "locality";

export type SuggestAddressesResults = Promise<
  | { status: "success"; data: AddressSuggestion[] }
  | { status: "failed"; message: string }
>;

export interface IGeoApifySearch {
  suggestAddresses(
    address: string,
    locationKind?: LocationType,
  ): Promise<
    | {
        status: "success";
        data: AddressSuggestion[];
      }
    | {
        status: "failed";
        message: string;
      }
  >;
}

export interface IIntegrationsAPI {
  readonly geoApify: IGeoApifySearch;
}
