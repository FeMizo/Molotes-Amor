import { normalizeSiteContent } from "@/data/site-content";
import { getRepositories } from "@/repositories/local-repositories";
import type { DeepPartial, SiteContent } from "@/types/site-content";

export const getSiteContent = async (): Promise<SiteContent> => {
  const repos = getRepositories();
  return repos.siteContent.get();
};

export const updateSiteContent = async (input: DeepPartial<SiteContent>): Promise<SiteContent> => {
  const repos = getRepositories();
  const current = await repos.siteContent.get();
  const nextContent = normalizeSiteContent({
    ...current,
    ...input,
    home: {
      ...current.home,
      ...(input.home ?? {}),
    },
    menu: {
      ...current.menu,
      ...(input.menu ?? {}),
    },
    about: {
      ...current.about,
      ...(input.about ?? {}),
    },
    contact: {
      ...current.contact,
      ...(input.contact ?? {}),
    },
  });

  return repos.siteContent.update(nextContent);
};
