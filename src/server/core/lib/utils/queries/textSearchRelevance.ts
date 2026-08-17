import { type RawBuilder, sql } from "kysely";

export function textSearchRelevance(
  column: RawBuilder<unknown>,
  query: string,
): RawBuilder<number> {
  return sql<number>`
    case
      when lower(${column}) = lower(${query}) then 0
      when ${column} ilike ${`${query}%`} then 1
      else 2
    end
  `;
}
