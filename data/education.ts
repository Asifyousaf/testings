export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export const education: Education[] = [
  {
    id: "bathspa",
    degree: "BSc (Hons) Creative Computing",
    institution: "Bath Spa University",
    location: "Dubai, UAE",
    startDate: "September 2023",
    endDate: "Present"
  },
  {
    id: "school",
    degree: "High School",
    institution: "His Highness Shaikh Rashid Al Maktoum Pakistan School",
    location: "Dubai, UAE",
    startDate: "September 2011",
    endDate: "June 2023"
  }
];