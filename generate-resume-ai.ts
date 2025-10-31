import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "./resume-types";
import { prompts, PromptVersion } from "./prompts";

// Define the schema for ResumeData using Google GenAI Type system
const resumeDataSchema = {
  type: Type.OBJECT,
  properties: {
    contact: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        phone: { type: Type.STRING },
        email: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        github: { type: Type.STRING },
      },
      required: ["name", "phone", "email", "linkedin", "github"],
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          location: { type: Type.STRING },
          degree: { type: Type.STRING },
          dates: { type: Type.STRING },
        },
        required: ["institution", "location", "degree", "dates"],
      },
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          dates: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          bullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["title", "dates", "company", "location", "bullets"],
      },
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          technologies: { type: Type.STRING },
          dates: { type: Type.STRING },
          bullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["name", "technologies", "dates", "bullets"],
      },
    },
    technicalSkills: {
      type: Type.OBJECT,
      properties: {
        languages: { type: Type.STRING },
        frameworks: { type: Type.STRING },
        developerTools: { type: Type.STRING },
        libraries: { type: Type.STRING },
      },
      required: ["languages", "frameworks", "developerTools", "libraries"],
    },
  },
  required: ["contact", "education", "experience", "projects", "technicalSkills"],
};

export interface GenerateResumeInput {
  promptVersion: PromptVersion;
  jobDescription: string;
  resumeData: string;
  additionalData?: string;
}

export async function generateResumeWithAI(
  input: GenerateResumeInput
): Promise<ResumeData> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const systemPrompt = prompts[input.promptVersion];

  const userPrompt = `
Job Description:
${input.jobDescription}

Current Resume Data:
${input.resumeData}

Additional Information:
${input.additionalData || "None"}

Please generate a tailored resume based on the above information.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt + "\n\n" + userPrompt }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeDataSchema,
      },
    });

    const generatedData = JSON.parse(response.text!) as ResumeData;
    return generatedData;
  } catch (error) {
    console.error("Error generating resume with AI:", error);
    throw error;
  }
}
