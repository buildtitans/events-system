import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./metaTokens";

function buildMetaData(overrides: Partial<Metadata> = {}): Metadata {
  return {
    title: overrides.title ?? SITE_NAME,
    description: overrides.description ?? SITE_DESCRIPTION,
    icons: overrides.icons ?? {
      icon: [
        {
          url: "/icon.svg",
          type: "image/svg+xml",
          sizes: "any",
        },
      ],
      shortcut: "/icon.svg",
    },
    openGraph: {
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: "website",
      ...overrides.openGraph,
    },
    ...overrides,
  };
}

export { buildMetaData };
