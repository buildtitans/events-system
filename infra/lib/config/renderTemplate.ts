import * as fs from "fs";

export type TemplateValues = Record<string, string>;

const TEMPLATE_TOKEN_PATTERN = /\{\{\s*([A-Z][A-Z0-9_]*)\s*\}\}/g;
const UNRESOLVED_TEMPLATE_TOKEN_PATTERN = /\{\{[^{}]*\}\}/g;

export function renderTemplate(
  template: string,
  values: TemplateValues,
  templateName = "template",
): string {
  const usedKeys = new Set<string>();

  const rendered = template.replace(
    TEMPLATE_TOKEN_PATTERN,
    (_token, key: string) => {
      if (!Object.prototype.hasOwnProperty.call(values, key)) {
        throw new Error(`Missing template value "${key}" for ${templateName}.`);
      }

      usedKeys.add(key);
      return values[key];
    },
  );

  const unresolvedTokens =
    rendered.match(UNRESOLVED_TEMPLATE_TOKEN_PATTERN) ?? [];

  if (unresolvedTokens.length > 0) {
    throw new Error(
      `Unresolved template token(s) for ${templateName}: ${unresolvedTokens.join(", ")}.`,
    );
  }

  const unusedKeys = Object.keys(values).filter((key) => !usedKeys.has(key));

  if (unusedKeys.length > 0) {
    throw new Error(
      `Unused template value(s) for ${templateName}: ${unusedKeys.join(", ")}.`,
    );
  }

  return rendered;
}

export function renderTemplateFile(
  filePath: string,
  values: TemplateValues,
): string {
  return renderTemplate(fs.readFileSync(filePath, "utf8"), values, filePath);
}
