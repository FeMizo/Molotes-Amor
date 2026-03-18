import { defaultFrontendSections } from "@/config/site-sections";
import type { FrontendSectionConfig, PageSectionKey } from "@/types/site-content";

export const normalizeFrontendSections = (
  input?: FrontendSectionConfig[] | null,
): FrontendSectionConfig[] =>
  defaultFrontendSections.map((section) => {
    const override = input?.find((candidate) => candidate.key === section.key);

    return {
      ...section,
      ...override,
      name: override?.name ?? section.name,
      enabled: override?.enabled ?? section.enabled,
      order: override?.order ?? section.order,
      config: {
        ...(section.config ?? {}),
        ...(override?.config ?? {}),
      },
    };
  });

export const getFrontendSection = (
  sections: FrontendSectionConfig[],
  key: PageSectionKey,
): FrontendSectionConfig =>
  normalizeFrontendSections(sections).find((section) => section.key === key) ??
  defaultFrontendSections.find((section) => section.key === key) ??
  defaultFrontendSections[0];

export const isFrontendSectionEnabled = (
  sections: FrontendSectionConfig[],
  key: PageSectionKey,
): boolean => getFrontendSection(sections, key).enabled;

export const getOrderedSectionsForPrefix = (
  sections: FrontendSectionConfig[],
  prefix: "home" | "menu",
): FrontendSectionConfig[] =>
  normalizeFrontendSections(sections)
    .filter((section) => section.key.startsWith(`${prefix}.`) && section.enabled)
    .sort((left, right) => left.order - right.order);
