import * as cheerio from 'cheerio';

export async function scrapeJobUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch job URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, and other non-content elements
    $('script, style, nav, header, footer, iframe, noscript').remove();

    // Get text content and clean it up
    const text = $('body')
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    return text;
  } catch (error) {
    console.error('Error scraping job URL:', error);
    throw new Error('Failed to scrape job description from URL');
  }
}
