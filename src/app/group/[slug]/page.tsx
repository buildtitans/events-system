import HydrateGroupBySlug from "@/src/client/components/hydration/HydrateGroupBySlug";
import OpenedGroup from "@/src/client/components/pages/openedGroup";
import React, { type JSX } from "react";

type GroupOpenParams = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function GroupOpen({
  params,
}: GroupOpenParams): Promise<JSX.Element> {
  const { slug } = await params;

  return (
    <React.Fragment>
      <HydrateGroupBySlug slug={slug} />
      <OpenedGroup />
    </React.Fragment>
  );
}
