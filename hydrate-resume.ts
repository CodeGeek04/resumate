import { ResumeData } from './resume-types';

function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/\\textbackslash\{\}/g, '\\textbackslash{}');
}

function generateContactSection(contact: ResumeData['contact']): string {
  return `\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(contact.name)}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(contact.phone)} $|$ \\href{mailto:${escapeLatex(contact.email)}}{\\underline{${escapeLatex(contact.email)}}} $|$
    \\href{${escapeLatex(contact.linkedin)}}{\\underline{${escapeLatex(contact.linkedin.replace('https://', ''))}}} $|$
    \\href{${escapeLatex(contact.github)}}{\\underline{${escapeLatex(contact.github.replace('https://', ''))}}}
\\end{center}`;
}

function generateEducationSection(education: ResumeData['education']): string {
  const items = education.map(edu =>
    `    \\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(edu.degree)}}{${escapeLatex(edu.dates)}}`
  ).join('\n');

  return `\\section{Education}
  \\resumeSubHeadingListStart
${items}
  \\resumeSubHeadingListEnd`;
}

function generateExperienceSection(experience: ResumeData['experience']): string {
  const items = experience.map(exp => {
    const bullets = exp.bullets.map(bullet =>
      `        \\resumeItem{${escapeLatex(bullet)}}`
    ).join('\n');

    return `    \\resumeSubheading
      {${escapeLatex(exp.title)}}{${escapeLatex(exp.dates)}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      \\resumeItemListStart
${bullets}
      \\resumeItemListEnd`;
  }).join('\n\n');

  return `\\section{Experience}
  \\resumeSubHeadingListStart

${items}

  \\resumeSubHeadingListEnd`;
}

function generateProjectsSection(projects: ResumeData['projects']): string {
  const items = projects.map(project => {
    const bullets = project.bullets.map(bullet =>
      `            \\resumeItem{${escapeLatex(bullet)}}`
    ).join('\n');

    return `      \\resumeProjectHeading
          {\\textbf{${escapeLatex(project.name)}} $|$ \\emph{${escapeLatex(project.technologies)}}}{${escapeLatex(project.dates)}}
          \\resumeItemListStart
${bullets}
          \\resumeItemListEnd`;
  }).join('\n');

  return `\\section{Projects}
    \\resumeSubHeadingListStart
${items}
    \\resumeSubHeadingListEnd`;
}

function generateTechnicalSkillsSection(skills: ResumeData['technicalSkills']): string {
  return `\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${escapeLatex(skills.languages)}} \\\\
     \\textbf{Frameworks}{: ${escapeLatex(skills.frameworks)}} \\\\
     \\textbf{Developer Tools}{: ${escapeLatex(skills.developerTools)}} \\\\
     \\textbf{Libraries}{: ${escapeLatex(skills.libraries)}}
    }}
 \\end{itemize}`;
}

export function hydrateResume(data: ResumeData): string {
  const preamble = `%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}


%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}


\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\\begin{document}

%----------HEADING----------`;

  const sections = [
    generateContactSection(data.contact),
    '',
    '',
    generateEducationSection(data.education),
    '',
    '',
    generateExperienceSection(data.experience),
    '',
    '',
    generateProjectsSection(data.projects),
    '',
    '',
    '',
    generateTechnicalSkillsSection(data.technicalSkills),
    '',
    '',
    '%-------------------------------------------',
    '\\end{document}'
  ];

  return preamble + '\n' + sections.join('\n');
}
