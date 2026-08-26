import { GeoapifyAutocompleteJsonResponse } from "../../../../../schemas/geoapify/geoapifyAutocompleteSchema";
import { GeoapifyAutocompleteValidator } from "../../../lib/validation/schemaValidators";
import { AddressSuggestion } from "../types";

export interface IAddressSuggestionParser {
  parse(raw: unknown): AddressSuggestion[];
}

export class AddressSuggestionParser implements IAddressSuggestionParser {
  public parse(raw: unknown): AddressSuggestion[] {
    const validated = GeoapifyAutocompleteValidator(raw);
    return this.toSuggestions(validated);
  }

  private toSuggestions(
    data: GeoapifyAutocompleteJsonResponse,
  ): AddressSuggestion[] {
    return data.results.map((result) => ({
      label: result.formatted ?? "",
      sublabel: result.county ?? "",
      country: result.country ?? "",
      city: result.city ?? "",
      state: result.state ?? "",
      street: result.street ?? "",
    }));
  }
}
