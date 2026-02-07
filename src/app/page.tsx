import { JSX } from "react";
import MainContent from "../components/pages/maincontent";
import { syncDomains } from "../lib/store/sync/syncDomains";
import DomainHydrator from "../components/hydration/DomainHydrator";

export default async function Home(): Promise<JSX.Element> {
  const domains = await syncDomains();

  return (
    <>
      <DomainHydrator
        domains={domains}

      />
      <MainContent

      />
    </>

  )
};
