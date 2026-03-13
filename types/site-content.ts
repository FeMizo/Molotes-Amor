export interface HomeContent {
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroPrimaryCtaLabel: string;
  heroSecondaryCtaLabel: string;
  heroImage: string;
  heroFloatingCount: string;
  heroFloatingQuote: string;
  featuredTitle: string;
  featuredDescription: string;
  featuredCtaLabel: string;
  storyTitle: string;
  storyHighlight: string;
  storyDescription: string;
  storyImage: string;
  storyBadge: string;
  storyItemOneTitle: string;
  storyItemOneDescription: string;
  storyItemTwoTitle: string;
  storyItemTwoDescription: string;
  storyCtaLabel: string;
  testimonialsTitle: string;
  testimonialOneName: string;
  testimonialOneText: string;
  testimonialOneRole: string;
  testimonialTwoName: string;
  testimonialTwoText: string;
  testimonialTwoRole: string;
  testimonialThreeName: string;
  testimonialThreeText: string;
  testimonialThreeRole: string;
}

export interface MenuContent {
  title: string;
  highlight: string;
  description: string;
  searchPlaceholder: string;
  emptyStateTitle: string;
  emptyStateCtaLabel: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  highlight: string;
  introTitle: string;
  introDescriptionOne: string;
  introDescriptionTwo: string;
  image: string;
  valueOneTitle: string;
  valueOneDescription: string;
  valueTwoTitle: string;
  valueTwoDescription: string;
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillarOneTitle: string;
  pillarOneDescription: string;
  pillarTwoTitle: string;
  pillarTwoDescription: string;
  pillarThreeTitle: string;
  pillarThreeDescription: string;
}

export interface ContactContent {
  title: string;
  highlight: string;
  description: string;
  infoTitle: string;
  addressLabel: string;
  addressValue: string;
  phoneLabel: string;
  phoneValue: string;
  emailLabel: string;
  emailValue: string;
  hoursLabel: string;
  hoursValue: string;
  mapTitle: string;
  mapCtaLabel: string;
  formTitle: string;
  successTitle: string;
  successDescription: string;
  submitLabel: string;
}

export interface SiteContent {
  home: HomeContent;
  menu: MenuContent;
  about: AboutContent;
  contact: ContactContent;
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SiteContentRepository {
  get(): Promise<SiteContent>;
  update(content: SiteContent): Promise<SiteContent>;
}
