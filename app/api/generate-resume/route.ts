import { NextRequest, NextResponse } from 'next/server';
import { generateResumeWithAI } from '@/generate-resume-ai';
import { hydrateResume } from '@/hydrate-resume';
import { scrapeJobUrl } from '@/lib/job-scraper';
import { compileLatexToPdf } from '@/lib/latex-compiler';
import { parsePdf } from '@/lib/pdf-parser';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract resume data
    let resumeData = '';
    const resumeFile = formData.get('resumeFile') as File | null;
    const resumeText = formData.get('resumeText') as string | null;

    if (resumeFile) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      if (resumeFile.name.endsWith('.pdf')) {
        resumeData = await parsePdf(buffer);
      } else {
        resumeData = buffer.toString('utf-8');
      }
    }
    if (resumeText) {
      resumeData += (resumeData ? '\n\n' : '') + resumeText;
    }

    // Extract job description
    let jobDescription = '';
    const jobUrl = formData.get('jobUrl') as string | null;
    const jobText = formData.get('jobText') as string | null;

    if (jobUrl) {
      const scrapedJob = await scrapeJobUrl(jobUrl);
      jobDescription = scrapedJob;
    }
    if (jobText) {
      jobDescription += (jobDescription ? '\n\n' : '') + jobText;
    }

    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing resume data or job description' },
        { status: 400 }
      );
    }

    // Generate resume with AI
    const generatedResumeData = await generateResumeWithAI({
      promptVersion: 'v2',
      jobDescription,
      resumeData,
    });

    // Convert to LaTeX
    const latexContent = hydrateResume(generatedResumeData);

    // Compile to PDF
    try {
      const pdfBuffer = await compileLatexToPdf(latexContent);

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="resume.pdf"',
        },
      });
    } catch (latexError) {
      // Return debug info if LaTeX compilation fails
      return NextResponse.json(
        {
          error: 'LaTeX compilation failed',
          latexError: String(latexError),
          generatedData: generatedResumeData,
          latexContent: latexContent,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating resume:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume', details: String(error) },
      { status: 500 }
    );
  }
}
