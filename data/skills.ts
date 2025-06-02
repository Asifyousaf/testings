export type SkillCategory = 
  | 'Languages' 
  | 'Frameworks/Libraries' 
  | 'Web Technologies' 
  | 'Tools & Platforms';

export interface Skill {
  name: string;
  category: SkillCategory;
  logoKey: string;
}

export const skills: Record<SkillCategory, Skill[]> = {
  'Languages': [
    { name: 'HTML', category: 'Languages', logoKey: 'html5' },
    { name: 'CSS', category: 'Languages', logoKey: 'css3' },
    { name: 'JavaScript', category: 'Languages', logoKey: 'javascript' },
    { name: 'Python', category: 'Languages', logoKey: 'python' },
    { name: 'Kotlin', category: 'Languages', logoKey: 'kotlin' }
  ],
  'Frameworks/Libraries': [
    { name: 'React', category: 'Frameworks/Libraries', logoKey: 'react' },
    { name: 'Node.js', category: 'Frameworks/Libraries', logoKey: 'nodejs' },
    { name: 'Express', category: 'Frameworks/Libraries', logoKey: 'express' },
    { name: 'Android SDK', category: 'Frameworks/Libraries', logoKey: 'android' }
  ],
  'Web Technologies': [
    { name: 'REST APIs', category: 'Web Technologies', logoKey: 'javascript' },
    { name: 'Responsive Design', category: 'Web Technologies', logoKey: 'css3' },
    { name: 'Web Accessibility', category: 'Web Technologies', logoKey: 'html5' }
  ],
  'Tools & Platforms': [
    { name: 'Git', category: 'Tools & Platforms', logoKey: 'git' },
    { name: 'Firebase', category: 'Tools & Platforms', logoKey: 'firebase' },
    { name: 'MongoDB', category: 'Tools & Platforms', logoKey: 'mongodb' },
    { name: 'Figma', category: 'Tools & Platforms', logoKey: 'figma' }
  ]
};

export const getAllSkills = () => {
  return Object.values(skills).flat();
};

export const getCategories = () => {
  return Object.keys(skills) as SkillCategory[];
};