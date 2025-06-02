export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  type?: 'work' | 'research' | 'education' | 'leadership';
}

export const experiences: Experience[] = [
  {
    id: "nutribuddy",
    title: "Full Stack Developer",
    company: "NutriBuddy – AI-Powered Fitness & Nutrition Platform",
    location: "Dubai, UAE",
    startDate: "January 2025",
    endDate: "May 2025",
    description: "Built a full-stack AI fitness web application aimed at personalized health solutions using React, Supabase, and third-party APIs.",
    achievements: [
      "Designed and developed AI-generated workout and nutrition plans using Gemini API, ExerciseDB, and Spoonacular",
      "Created a calorie-tracking and workout-logging system with user-specific data stored in Supabase",
      "Built a chatbot with keyword detection logic to personalize fitness plans in real-time",
      "Developed animated workout timers, community features, and integrated user dashboards with analytics"
    ],
    type: 'work'
  },
  {
    id: "cybertronic",
    title: "Frontend Developer & Web Designer",
    company: "Cybertronicbot – E-commerce Streetwear Brand",
    location: "Dubai, UAE",
    startDate: "July 2023",
    endDate: "December 2023",
    description: "Launched a fully functional online store for a clothing brand using JavaScript, CSS, and HTML, with a focus on bold streetwear aesthetics and smooth UX.",
    achievements: [
      "Designed responsive layouts using custom CSS and Tailwind, optimized for both mobile and desktop",
      "Implemented core e-commerce features: user authentication, product pages, cart, checkout, and email notifications",
      "Collaborated on branding and visual identity using Figma and Photoshop",
      "Hosted on Vercel with domain integration from GoDaddy and verified SEO using Google Search Console"
    ],
    type: 'work'
  },
  {
    id: "finscope",
    title: "Financial Data Dashboard Developer",
    company: "Finscope – Real-Time Finance Dashboard",
    location: "Remote",
    startDate: "March 2024",
    endDate: "May 2024",
    description: "Developed a visually rich financial dashboard for displaying trends using live APIs and modular components.",
    achievements: [
      "Integrated real-time financial APIs to replace mock data across JavaScript charts and tables",
      "Designed interactive trend graphs and data cards using Chart.js and vanilla JS for fast updates",
      "Ensured accessibility and responsiveness across all screen sizes using semantic HTML and responsive design techniques",
      "Optimized loading performance and cache strategies for reduced API throttling and smoother UX"
    ],
    type: 'work'
  }
];