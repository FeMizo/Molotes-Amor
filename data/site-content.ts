import type { DeepPartial, SiteContent } from "@/types/site-content";

export const defaultSiteContent: SiteContent = {
  home: {
    heroBadge: "Tradicion poblana desde 1985",
    heroTitle: "El Arte del",
    heroHighlight: "Molote Perfecto",
    heroDescription:
      "Descubre el sabor autentico de nuestra cocina artesanal. Crujientes por fuera, suaves por dentro y llenos de historia en cada bocado.",
    heroPrimaryCtaLabel: "Ver menu completo",
    heroSecondaryCtaLabel: "Nuestra historia",
    heroImage: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=1000&q=80",
    heroFloatingCount: "+500",
    heroFloatingQuote: "Los mejores molotes que he probado en mi vida.",
    featuredTitle: "Favoritos de la Casa",
    featuredDescription:
      "Una seleccion de nuestros molotes mas pedidos, preparados con el sazon tradicional que nos distingue.",
    featuredCtaLabel: "Ver menu completo",
    storyTitle: "Calidad que se siente en",
    storyHighlight: "cada mordida",
    storyDescription:
      "Nuestros molotes son preparados al momento, siguiendo recetas de tradicion familiar. Usamos ingredientes locales frescos y coccion cuidada para conservar la textura crujiente.",
    storyImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80",
    storyBadge: "Masa de maiz 100% nixtamalizado",
    storyItemOneTitle: "Ingredientes locales",
    storyItemOneDescription: "Apoyamos a productores de la region.",
    storyItemTwoTitle: "Receta secreta",
    storyItemTwoDescription: "El sazon que nos distingue desde hace decadas.",
    storyCtaLabel: "Conoce nuestra historia",
    testimonialsTitle: "Lo que dicen nuestros clientes",
    testimonialOneName: "Sofia Garcia",
    testimonialOneText: "El de huitlacoche es espectacular. Me recordo a los de mi abuela.",
    testimonialOneRole: "Cliente frecuente",
    testimonialTwoName: "Marco Antonio",
    testimonialTwoText: "Excelente servicio y gran presentacion. El carrito web es muy facil de usar.",
    testimonialTwoRole: "Foodie local",
    testimonialThreeName: "Lucia Mendez",
    testimonialThreeText: "Crujientes y calientitos. Llegaron perfecto a mi casa.",
    testimonialThreeRole: "Cliente a domicilio",
  },
  menu: {
    title: "Nuestro",
    highlight: "Menu",
    description:
      "Explora nuestra variedad de molotes artesanales, preparados con ingredientes frescos y sazon tradicional poblano.",
    searchPlaceholder: "Busca tu molote favorito...",
    emptyStateTitle: "No encontramos molotes que coincidan con tu busqueda.",
    emptyStateCtaLabel: "Ver todo el menu",
  },
  about: {
    eyebrow: "Nuestra Historia",
    title: "Tradicion que se",
    highlight: "Saborea con el Alma",
    introTitle: "Desde 1985, un sueno hecho realidad",
    introDescriptionOne:
      "Todo comenzo en una pequena cocina en el corazon de Puebla. Dona Elena, con su amor por la cocina tradicional, empezo a preparar molotes para sus vecinos. Lo que empezo como un pasatiempo se convirtio en un legado familiar.",
    introDescriptionTwo:
      "Hoy, en Molotes El Tradicional, mantenemos viva esa esencia. Cada molote es una obra de arte culinaria, hecha a mano con la misma dedicacion y los mismos ingredientes de alta calidad que Dona Elena usaba hace mas de tres decadas.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80",
    valueOneTitle: "Pasion",
    valueOneDescription: "Amamos lo que hacemos.",
    valueTwoTitle: "Familia",
    valueTwoDescription: "Unidos por el sabor.",
    pillarsTitle: "Nuestros Pilares",
    pillarsSubtitle: "Lo que nos hace diferentes",
    pillarOneTitle: "Ingredientes Frescos",
    pillarOneDescription:
      "Seleccionamos diariamente los mejores productos de los mercados locales para garantizar frescura.",
    pillarTwoTitle: "Tecnica Ancestral",
    pillarTwoDescription:
      "Respetamos los tiempos y procesos tradicionales del nixtamal y el amasado manual.",
    pillarThreeTitle: "Calidad Premium",
    pillarThreeDescription:
      "Cada molote pasa por un control de calidad para asegurar que llegue perfecto a tu mesa.",
  },
  contact: {
    title: "Ponte en",
    highlight: "Contacto",
    description:
      "Tienes alguna duda, sugerencia o pedido especial? Estamos aqui para escucharte y brindarte el mejor servicio.",
    infoTitle: "Informacion de Contacto",
    addressLabel: "Direccion",
    addressValue: "Av. Reforma 123, Centro Historico, Puebla, Pue.",
    phoneLabel: "Telefono",
    phoneValue: "+52 (222) 123 4567",
    emailLabel: "Email",
    emailValue: "hola@molotestradicional.com",
    hoursLabel: "Horario",
    hoursValue: "Lun - Sab: 9:00 - 21:00 | Dom: 10:00 - 18:00",
    mapTitle: "Mapa interactivo proximamente",
    mapCtaLabel: "Abrir en Google Maps",
    formTitle: "Envianos un mensaje",
    successTitle: "Mensaje enviado",
    successDescription: "Gracias por contactarnos. Te responderemos lo mas pronto posible.",
    submitLabel: "Enviar mensaje",
  },
};

export const normalizeSiteContent = (input?: DeepPartial<SiteContent> | null): SiteContent => ({
  home: {
    ...defaultSiteContent.home,
    ...(input?.home ?? {}),
  },
  menu: {
    ...defaultSiteContent.menu,
    ...(input?.menu ?? {}),
  },
  about: {
    ...defaultSiteContent.about,
    ...(input?.about ?? {}),
  },
  contact: {
    ...defaultSiteContent.contact,
    ...(input?.contact ?? {}),
  },
});
