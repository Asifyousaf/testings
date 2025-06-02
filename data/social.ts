export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/Asifyousaf",
    icon: "github"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/asif-khan-177888278/",
    icon: "linkedin"
  },
  {
    id: "email",
    name: "Email",
    url: "mailto:asifyousaf14@gmail.com",
    icon: "mail"
  }
];