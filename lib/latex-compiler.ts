import latex from 'node-latex';
import { Readable } from 'stream';

export async function compileLatexToPdf(latexContent: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const input = Readable.from([latexContent]);
    const chunks: Buffer[] = [];

    const pdf = latex(input, {
      inputs: process.cwd(),
      cmd: 'pdflatex',
    });

    pdf.on('data', (chunk) => chunks.push(chunk));
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', (err) => reject(err));
  });
}
