export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  achievements: string[];
  image: string;
  github?: string;
  liveUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "masat-al-nahar",
    title: "Masat Al Nahar",
    description: "A modern restaurant website with online ordering system and menu management",
    longDescription: "A modern restaurant website with comprehensive online ordering system and menu management capabilities. Features a clean, user-friendly interface and responsive design.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Figma"],
    achievements: [
      "Designed and developed a modern restaurant website",
      "Implemented online ordering system",
      "Created responsive menu management interface",
      "Optimized user experience across devices"
    ],
    image: "/images/masatalnahar.png",
    github: "https://github.com/Asifyousaf",
    liveUrl: "https://www.figma.com/design/EbVP0zAOfFQh47ipLr8vGj/Untitled?node-id=0-1&t=mW5R9So3ZYa2oFnX-1",
    featured: true
  },
  {
    id: "cybertronic",
    title: "Cybertronic Website",
    description: "Full-stack e-commerce platform with user authentication and product management",
    longDescription: "A comprehensive e-commerce platform featuring user authentication, product management, and a modern shopping experience.",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    achievements: [
      "Built full-stack e-commerce functionality",
      "Implemented secure user authentication",
      "Created product management system",
      "Optimized site performance"
    ],
    image: "/images/Cybertronic.png",
    github: "https://github.com/Asifyousaf",
    liveUrl: "https://cybertronicbot.com/",
    featured: true
  },
  {
    id: "time-magazine",
    title: "TIME Magazine Clone",
    description: "Responsive magazine website with dynamic content loading and modern layout",
    longDescription: "A responsive clone of TIME Magazine's website featuring dynamic content loading and a modern, clean layout design.",
    technologies: ["HTML5", "CSS3", "JavaScript", "REST API"],
    achievements: [
      "Created responsive magazine layout",
      "Implemented dynamic content loading",
      "Optimized performance across devices",
      "Maintained design consistency"
    ],
    image: "/images/web.png",
    github: "https://github.com/Asifyousaf",
    liveUrl: "https://asifyousaf.github.io/Magazine.github.io/",
    featured: true
  },
  {
    id: "fix-my-ride",
    title: "Fix My Ride",
    description: "Mobile app for car service booking and maintenance tracking",
    longDescription: "A mobile application for booking car services and tracking maintenance history. Features an intuitive interface and comprehensive service management.",
    technologies: ["Kotlin", "Android SDK", "Firebase", "Material UI"],
    achievements: [
      "Developed complete car service booking system",
      "Implemented maintenance tracking features",
      "Created user-friendly mobile interface",
      "Integrated real-time updates"
    ],
    image: "/images/car service.jpeg",
    github: "https://github.com/Asifyousaf",
    liveUrl: "https://www.figma.com/design/1d641mijroI1sBszp7QlSr/High-fi---Fix-My-Ride?node-id=0-1&t=aZph7JpeEYl7Gsch-1",
    featured: true
  }
];