export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  dates: string;
}

export interface ExperienceItem {
  title: string;
  dates: string;
  company: string;
  location: string;
  bullets: string[];
}

export interface Project {
  name: string;
  technologies: string;
  dates: string;
  bullets: string[];
}

export interface TechnicalSkills {
  languages: string;
  frameworks: string;
  developerTools: string;
  libraries: string;
}

export interface ResumeData {
  contact: ContactInfo;
  education: Education[];
  experience: ExperienceItem[];
  projects: Project[];
  technicalSkills: TechnicalSkills;
}
