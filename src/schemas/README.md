# Zod + TypeBox usage

## Zod

- used **exclusively** for tRPC boundary(tRPC is zod-first)

## TypeBox

- **Canonical runtime schema**  validation


> [!IMPORTANT]
> Zod is used **exclusively** at the tRPC boundary because tRPC is Zod-first.
> TypeBox remains the canonical schema system for runtime validation and
> OpenAPI generation throughout the application.
