import { generateResumeWithAI } from "./generate-resume-ai";
import { hydrateResume } from "./hydrate-resume";
import * as fs from "fs";
import "dotenv/config"

const jobDescription = `
Senior Full Stack Engineer at TechCorp

We're seeking an experienced Full Stack Engineer to join our team and help build scalable web applications.

Requirements:
- 3+ years of experience with modern web technologies
- Strong proficiency in TypeScript, React, and Node.js
- Experience with cloud platforms (AWS, GCP, or Azure)
- Database expertise (PostgreSQL, Redis)
- Experience with containerization (Docker, Kubernetes)
- Strong problem-solving and communication skills

Responsibilities:
- Design and implement scalable backend services
- Build responsive frontend applications
- Collaborate with cross-functional teams
- Optimize application performance
- Participate in code reviews and mentoring
`;

const currentResumeData = `
Name: Shivam Mittal
Phone: +91 8851660028
Email: shivammittal2124@gmail.com
LinkedIn: https://www.linkedin.com/in/shivammittal21/
GitHub: https://github.com/CodeGeek04

School:
Delhi Technological University 2021-2025
Computer Science

Experience:
- Senior Software Developer at Morphle Labs (May 2025 - Sept 2025)
  * Medical automation solutions
  * Image processing frameworks
  * Developer productivity tools

- AI Innovation Specialist at IgniteTech (April 2024 - May 2025)
  * MyPersonas.ai and Eloquens.ai development
  * Customer problem solving
  * Legacy code modernization

- Software Developer at Clausewise (June 2024 - August 2024)
  * Contract management platform
  * AI and NLP features

- Software Developer at Homeland Connect (April 2024 - August 2024)
  * Task management system
  * Mobile app development

Projects:
- Linklee.in: Link management platform with custom subdomains
  Technologies: Next.js, PostgreSQL, Redis, Cloudflare

Skills:
- Languages: Python, JavaScript, Go, Java, C/C++, AppScript
- Backend: Node.js, FastAPI, Express.js, PostgreSQL, Redis, Prisma ORM
- AI/ML: PyTorch, Hugging Face, LangChain, Computer Vision
- DevOps: Docker, Kubernetes, AWS, Git, CI/CD
`;

const additionalData = `
Additional achievements:
- Reduced manual workflows by 60% in healthcare automation
- Prevented $2M revenue loss through customer retention
- Managed systems handling 50,000+ tasks per project
- Built platform processing 10,000+ daily inputs
- Achieved 99.9% uptime on production systems
`;

async function main() {
  console.log("🤖 Generating resume with AI...\n");

  try {
    const resumeData = await generateResumeWithAI({
      promptVersion: "v2",
      jobDescription,
      resumeData: currentResumeData,
      additionalData,
    });

    console.log("✅ Resume data generated successfully!\n");
    console.log("📊 Resume structure:");
    console.log(`   - Contact info: ✓`);
    console.log(`   - Education entries: ${resumeData.education.length}`);
    console.log(`   - Experience entries: ${resumeData.experience.length}`);
    console.log(`   - Projects: ${resumeData.projects.length}`);
    console.log(`   - Technical skills: ✓\n`);

    // Save the generated data
    fs.writeFileSync(
      "generated-resume-data.json",
      JSON.stringify(resumeData, null, 2)
    );
    console.log("💾 Saved resume data to: generated-resume-data.json\n");

    // Generate LaTeX
    const latex = hydrateResume(resumeData);
    fs.writeFileSync("ai-generated-resume.tex", latex);
    console.log("📄 Generated LaTeX file: ai-generated-resume.tex\n");

    console.log("To compile the resume:");
    console.log("  pdflatex ai-generated-resume.tex");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
