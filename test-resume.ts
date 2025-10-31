import { hydrateResume } from './hydrate-resume';
import { ResumeData } from './resume-types';
import * as fs from 'fs';

// Shivam's resume data
const shivamResumeData: ResumeData = {
  contact: {
    name: 'Shivam Mittal',
    phone: '+91 8851660028',
    email: 'shivammittal2124@gmail.com',
    linkedin: 'https://www.linkedin.com/in/shivammittal21/',
    github: 'https://github.com/CodeGeek04',
  },
  education: [],
  experience: [
    {
      title: 'Senior Software Developer',
      dates: 'May 2025 -- Sept 2025',
      company: 'Morphle Labs',
      location: 'Bangalore India',
      bullets: [
        'Deployed critical medical automation solutions for enterprise healthcare systems, collaborating with international research laboratories to reduce manual microtomy workflows by 60% and enhance operational efficiency across multiple facilities',
        'Headed complete modernization of legacy medical device software infrastructure, implementing fast image processing frameworks, comprehensive logging systems, and agile development methodologies that accelerated development velocity by 30%',
        'Engineered sophisticated developer productivity tools using Python and JavaScript, dramatically reducing debugging complexity and troubleshooting time by 40%, enabling faster deployment of critical healthcare solutions',
      ],
    },
    {
      title: 'AI Innovation Specialist',
      dates: 'April 2024 -- May 2025',
      company: 'IgniteTech',
      location: 'Remote',
      bullets: [
        'Developed key components for MyPersonas.ai and Eloquens.ai, the company\'s two biggest enterprise offerings processing thousands of daily requests, implementing AI logic, payment systems, and authentication features for production environments',
        'Modernized legacy codebases and directly solved critical customer problems, preventing potential revenue loss of over $2 Million through customer retention by addressing technical issues and improving system reliability',
        'Joined customer calls at least twice a week to understand user requirements and provide rapid technical solutions, developing strong customer relations while reducing problem resolution time by 50%',
      ],
    },
    {
      title: 'Software Developer',
      dates: 'June 2024 -- August 2024',
      company: 'Clausewise',
      location: 'Remote',
      bullets: [
        'Built an enterprise contract management platform actively used by India\'s biggest edtech platform to manage student contracts, processing over 10,000 inputs daily',
        'Prepared automated contract parsing and management features using AI and natural language processing, reducing manual contract processing time by 70%',
        'Deployed robust database architecture and real-time notifications system to handle high-volume contract workflows efficiently',
      ],
    },
  ],
  projects: [
    {
      name: 'Linklee.in',
      technologies: 'Next.js, PostgreSQL, Redis, Cloudflare DNS',
      dates: '2024',
      bullets: [
        'Architected a link management platform enabling users to claim personalized subdomains and create custom link trees',
        'Applied dynamic DNS routing using Cloudflare to handle wildcard subdomains (*.linklee.in) with server-side rendering for SEO optimization',
        'Engineered distributed Redis caching system for link redirects, significantly reducing response times',
        'Designed scalable database schema in PostgreSQL to manage user profiles, custom domains, and redirect mappings',
      ],
    },
  ],
  technicalSkills: {
    languages: 'Python, JavaScript, Go, Java, C/C++, AppScript',
    frameworks: 'Node.js, FastAPI, Express.js, PostgreSQL, Redis, Prisma ORM, GraphQL, WebSocket',
    developerTools: 'Docker, Kubernetes, AWS, Bare-metal Servers, Git, CI/CD, Event-driven Architecture, System Design',
    libraries: 'PyTorch, Hugging Face Transformers, LangChain, Computer Vision, LLM Integration, Neural Networks',
  },
};

// Generate the LaTeX
const generatedLatex = hydrateResume(shivamResumeData);

// Write to file
fs.writeFileSync('shivam-resume-generated.tex', generatedLatex);

console.log('✅ Resume generated successfully!');
console.log('📄 Output file: shivam-resume-generated.tex');
console.log('\nTo compile the resume:');
console.log('  pdflatex shivam-resume-generated.tex');
