export const quillFormats = [
  "header", "font", "size",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "script",
  "blockquote", "code-block",
  "list", "bullet", "indent",
  "align",
  "link", "image", "video",
];

export const emptyForm = {
  id: null,
  title: "",
  slug: "",
  description: "",
  content: "",
  tags: "",
  isPublished: false,
  featuredImage: "",
};

export const emptyProjectForm = {
  id: null,
  title: "",
  slug: "",
  category: "corporate",
  description: "",
  isPublished: true,
  coverImage: "",
  galleryImages: [],
};

export const fontOptions = [
  "Poppins",
  "Inter",
  "Montserrat",
  "Open Sans",
  "Roboto",
  "Playfair Display",
];

export const defaultSiteSettings = {
  logoUrl: "",
  headingFont: "Poppins",
  paragraphFont: "Poppins",
  headingWeight: 600,
  paragraphWeight: 400,
  headingSizeScale: 1,
  paragraphSizeScale: 1,
  brandPrimary: "#ffffff",
  brandSecondary: "#d9d9d9",
  buttonRadius: 8,
  buttonPaddingY: 10,
  buttonPaddingX: 20,
  buttonStyle: "solid",
  footerPhone: "",
  footerEmail: "",
  footerAddress: "",
};

export const HERO_IMAGE_ASPECT = 1920 / 800;

export const pageCustomizationTemplates = {
  home: [
    { key: "home.hero.badge", label: "Hero Badge", contentType: "text", value: "Luxury Event Architecture", isPublished: true },
    { key: "home.hero.heading", label: "Hero Heading", contentType: "text", value: "Bespoke Wedding Planning", isPublished: true },
    { key: "home.hero.subheading", label: "Hero Subheading", contentType: "text", value: "Crafted With Precision", isPublished: true },
    { key: "home.hero.whatsappLabel", label: "WhatsApp Hero Label", contentType: "text", value: "Let's talk", isPublished: true },
    { key: "home.projects.heading", label: "Projects Section Title", contentType: "text", value: "The Projects", isPublished: true },
    { key: "home.projects.corporate.title", label: "Corporate Card Title", contentType: "text", value: "Corporate", isPublished: true },
    { key: "home.projects.wedding.title", label: "Wedding Card Title", contentType: "text", value: "Wedding", isPublished: true },
    { key: "home.projects.outdoor.title", label: "Outdoor Card Title", contentType: "text", value: "Outdoor", isPublished: true },
    { key: "home.projects.corporate.image", label: "Corporate Card Image", contentType: "image", value: "", isPublished: true },
    { key: "home.projects.wedding.image", label: "Wedding Card Image", contentType: "image", value: "", isPublished: true },
    { key: "home.projects.outdoor.image", label: "Outdoor Card Image", contentType: "image", value: "", isPublished: true },
    { key: "home.carousel.image1", label: "Carousel Image 1", contentType: "image", value: "", isPublished: true },
    { key: "home.carousel.image2", label: "Carousel Image 2", contentType: "image", value: "", isPublished: true },
    { key: "home.carousel.image3", label: "Carousel Image 3", contentType: "image", value: "", isPublished: true },
    { key: "home.about.image", label: "About Card Image", contentType: "image", value: "", isPublished: true },
    { key: "home.about.name", label: "About Card Name", contentType: "text", value: "Mohamed Kanara", isPublished: true },
    { key: "home.about.role", label: "About Card Role", contentType: "text", value: "Chairman & Founder", isPublished: true },
    { key: "home.about.description", label: "About Card Description", contentType: "text", value: "Under the leadership of Mr. Mohamed Kanara, is an icon in event creation and planning in the UAE and an expert in event management field, with over 14 years of experience in turning events into inspiring experiences.", isPublished: true },
    { key: "home.about.phone", label: "About Card Phone Number", contentType: "text", value: "+971 555 49 2125", isPublished: true },
    { key: "home.contact.heading", label: "Contact Section Heading", contentType: "text", value: "Contact us", isPublished: true },
    { key: "home.contact.phone", label: "Contact Phone", contentType: "text", value: "+971 555 44 2125", isPublished: true },
    { key: "home.contact.email", label: "Contact Email", contentType: "text", value: "Mk4events.info@gmail.com", isPublished: true },
    { key: "home.contact.address", label: "Contact Address", contentType: "text", value: "Wasit St - Al Shahba - Mughaider Suburb - Sharjah", isPublished: true },
    { key: "home.social.tiktok", label: "TikTok URL", contentType: "text", value: "https://tiktok.com/@mk.4events", isPublished: true },
    { key: "home.social.instagram", label: "Instagram URL", contentType: "text", value: "https://www.instagram.com/mk.4events?igsh=MThnc3ZpdHM3cGV4cQ==", isPublished: true },
    { key: "home.social.snapchat", label: "Snapchat URL", contentType: "text", value: "https://www.snapchat.com/add/mk4events?share_id=mE8wrDeFJy8&locale=en-GB", isPublished: true },
    { key: "home.social.whatsapp", label: "WhatsApp URL", contentType: "text", value: "https://wa.me/971555442125", isPublished: true },
  ],
  about: [
    { key: "about.hero.heading", label: "About Hero Heading", contentType: "text", value: "About Us", isPublished: true },
    { key: "about.hero.image", label: "About Hero Image", contentType: "image", value: "", isPublished: true },
    { key: "about.main.heading", label: "About Main Heading", contentType: "text", value: "WE DO IT ALL!", isPublished: true },
    { key: "about.story.p1", label: "About Story Paragraph 1", contentType: "text", value: "We were founded by Mr. Mohamed Kanara, an expert wedding planner and an executive. We are now over 50 strong and present across strategic locations in UAE.", isPublished: true },
    { key: "about.story.p2", label: "About Story Paragraph 2", contentType: "text", value: "Our accredited planner agency has built a reputation for curating bespoke and luxury events where we handle all planning, event design, and management services.", isPublished: true },
    { key: "about.section.image", label: "About Side Image", contentType: "image", value: "", isPublished: true },
    { key: "about.stats.instagram.label", label: "Instagram Label", contentType: "text", value: "Instagram View", isPublished: true },
    { key: "about.stats.instagram.value", label: "Instagram Value", contentType: "text", value: "+ 3 M", isPublished: true },
    { key: "about.stats.tiktok.label", label: "TikTok Label", contentType: "text", value: "Tik Tok View", isPublished: true },
    { key: "about.stats.tiktok.value", label: "TikTok Value", contentType: "text", value: "+ 4.6 M", isPublished: true },
    { key: "about.stats.facebook.label", label: "Facebook Label", contentType: "text", value: "Face Book View", isPublished: true },
    { key: "about.stats.facebook.value", label: "Facebook Value", contentType: "text", value: "+ 2 M", isPublished: true },
    { key: "about.services.heading", label: "Services Heading", contentType: "text", value: "What we do", isPublished: true },
  ],
  projects: [
    { key: "projects.hero.heading", label: "Projects Hero Heading", contentType: "text", value: "Projects", isPublished: true },
    { key: "projects.hero.image.corporate", label: "Corporate Hero Image", contentType: "image", value: "", isPublished: true },
    { key: "projects.hero.image.wedding", label: "Wedding Hero Image", contentType: "image", value: "", isPublished: true },
    { key: "projects.hero.image.outdoor", label: "Outdoor Hero Image", contentType: "image", value: "", isPublished: true },
  ],
  blog: [
    { key: "blog.hero.heading", label: "Blog Hero Heading", contentType: "text", value: "Blogs", isPublished: true },
    { key: "blog.hero.image", label: "Blog Hero Image", contentType: "image", value: "", isPublished: true },
  ],
  contact: [
    { key: "contact.hero.heading", label: "Contact Hero Heading", contentType: "text", value: "Contact Us", isPublished: true },
    { key: "contact.hero.image", label: "Contact Hero Image", contentType: "image", value: "", isPublished: true },
    { key: "contact.info.address", label: "Contact Address", contentType: "text", value: "", isPublished: true },
    { key: "contact.info.phone", label: "Contact Phone", contentType: "text", value: "", isPublished: true },
    { key: "contact.info.email", label: "Contact Email", contentType: "text", value: "", isPublished: true },
    { key: "contact.info.mapEmbedUrl", label: "Google Map Embed URL", contentType: "text", value: "", isPublished: true },
    { key: "contact.info.mapPinUrl", label: "Google Pin URL", contentType: "text", value: "", isPublished: true },
  ],
  footer: [
    { key: "footer.text.copyright", label: "Footer Copyright Text", contentType: "text", value: "", isPublished: true },
    { key: "footer.logo", label: "Footer Logo", contentType: "image", value: "", isPublished: true },
  ],
};

export const seoCustomizationTemplates = {
  home: [
    { key: "seo.home.title", label: "Home SEO Title", contentType: "text", value: "Home | MK Wedding Planner", isPublished: true },
    { key: "seo.home.description", label: "Home SEO Description", contentType: "text", value: "Luxury wedding planning, corporate events, and outdoor celebrations crafted by MK Wedding Planner.", isPublished: true },
    { key: "seo.home.keywords", label: "Home SEO Keywords", contentType: "text", value: "wedding planner UAE, luxury events, corporate events, outdoor events", isPublished: true },
  ],
  about: [
    { key: "seo.about.title", label: "About SEO Title", contentType: "text", value: "About Us | MK Wedding Planner", isPublished: true },
    { key: "seo.about.description", label: "About SEO Description", contentType: "text", value: "Learn about MK Wedding Planner, our founder, and our creative event planning expertise across the UAE.", isPublished: true },
    { key: "seo.about.keywords", label: "About SEO Keywords", contentType: "text", value: "about wedding planner, UAE events company, event management team", isPublished: true },
  ],
  projects: [
    { key: "seo.projects.title", label: "Projects SEO Title", contentType: "text", value: "Projects | MK Wedding Planner", isPublished: true },
    { key: "seo.projects.description", label: "Projects SEO Description", contentType: "text", value: "Explore wedding, corporate, and outdoor event projects by MK Wedding Planner.", isPublished: true },
    { key: "seo.projects.keywords", label: "Projects SEO Keywords", contentType: "text", value: "event gallery, wedding projects, corporate event portfolio, outdoor event design", isPublished: true },
  ],
  blog: [
    { key: "seo.blog.title", label: "Blog SEO Title", contentType: "text", value: "Blogs | MK Wedding Planner", isPublished: true },
    { key: "seo.blog.description", label: "Blog SEO Description", contentType: "text", value: "Read event inspiration, wedding planning insights, and latest updates from MK Wedding Planner.", isPublished: true },
    { key: "seo.blog.keywords", label: "Blog SEO Keywords", contentType: "text", value: "wedding planning blog, event tips, UAE wedding ideas", isPublished: true },
  ],
  contact: [
    { key: "seo.contact.title", label: "Contact SEO Title", contentType: "text", value: "Contact Us | MK Wedding Planner", isPublished: true },
    { key: "seo.contact.description", label: "Contact SEO Description", contentType: "text", value: "Contact MK Wedding Planner for weddings, corporate events, and outdoor event planning in UAE.", isPublished: true },
    { key: "seo.contact.keywords", label: "Contact SEO Keywords", contentType: "text", value: "contact wedding planner, book event planner UAE, event consultation", isPublished: true },
  ],
  terms: [
    { key: "seo.terms.title", label: "Terms SEO Title", contentType: "text", value: "Terms & Conditions | MK Wedding Planner", isPublished: true },
    { key: "seo.terms.description", label: "Terms SEO Description", contentType: "text", value: "Read the terms and conditions for using MK Wedding Planner services and website.", isPublished: true },
    { key: "seo.terms.keywords", label: "Terms SEO Keywords", contentType: "text", value: "terms and conditions, legal, policy", isPublished: true },
  ],
  details: [
    { key: "seo.blogDetail.keywords", label: "Blog Details Keywords", contentType: "text", value: "wedding blog article, event planning article, UAE event blog", isPublished: true },
    { key: "seo.projectDetail.keywords", label: "Project Details Keywords", contentType: "text", value: "event project details, wedding portfolio, event execution", isPublished: true },
  ],
};
