import { Injectable, Logger } from '@nestjs/common';
import FirecrawlApp from '@mendable/firecrawl-js';
import { ConfigService } from '@nestjs/config';

export interface LinkedInProfile {
  name: string;
  headline: string;
  currentPosition?: {
    title: string;
    company: string;
    duration: string;
  };
  pastPositions: Array<{
    title: string;
    company: string;
    duration: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
  }>;
  skills: string[];
  summary?: string;
  rawMarkdown: string;
}

@Injectable()
export class LinkedInService {
  private readonly logger = new Logger(LinkedInService.name);
  private readonly firecrawl: FirecrawlApp;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('FIRECRAWL_API_KEY');
    if (!apiKey) {
      this.logger.warn('FIRECRAWL_API_KEY not configured');
    }
    this.firecrawl = new FirecrawlApp({ apiKey: apiKey || '' });
  }

  async scrapeProfile(linkedinUrl: string): Promise<LinkedInProfile> {
    this.logger.log(`Scraping LinkedIn profile: ${linkedinUrl}`);
    
    try {
      // Scrape the LinkedIn profile using Firecrawl
      const result = await this.firecrawl.scrapeUrl(linkedinUrl, {
        formats: ['markdown', 'html'],
        onlyMainContent: true,
      });

      if (!result.success) {
        throw new Error('Failed to scrape LinkedIn profile');
      }

      const markdown = result.markdown || '';
      
      // Parse the markdown to extract profile fields
      const profile = this.parseMarkdownToProfile(markdown);
      
      this.logger.log(`Successfully scraped profile for: ${profile.name}`);
      return profile;
      
    } catch (error) {
      this.logger.error(`Error scraping LinkedIn profile: ${error.message}`, error.stack);
      
      // Handle specific error cases
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        throw new Error('LinkedIn profile not found. Please verify the URL is correct.');
      }
      
      if (error.message?.includes('403') || error.message?.includes('private') || error.message?.includes('access denied')) {
        throw new Error('LinkedIn profile is private or inaccessible. Please ensure the profile is public.');
      }
      
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      if (error.message?.includes('timeout')) {
        throw new Error('Request timeout while scraping LinkedIn profile. Please try again.');
      }
      
      // Re-throw with more context
      throw new Error(`Failed to scrape LinkedIn profile: ${error.message}`);
    }
  }

  private parseMarkdownToProfile(markdown: string): LinkedInProfile {
    // Initialize profile with defaults
    const profile: LinkedInProfile = {
      name: '',
      headline: '',
      pastPositions: [],
      education: [],
      skills: [],
      rawMarkdown: markdown,
    };

    // Extract name (usually the first heading or prominent text)
    const nameMatch = markdown.match(/^#\s+(.+)$/m) || markdown.match(/^##\s+(.+)$/m);
    if (nameMatch) {
      profile.name = nameMatch[1].trim();
    }

    // Extract headline (often appears after name or as a subtitle)
    const headlineMatch = markdown.match(/(?:headline|title):\s*(.+)/i) || 
                          markdown.match(/^###\s+(.+)$/m);
    if (headlineMatch) {
      profile.headline = headlineMatch[1].trim();
    }

    // Extract current position
    const currentPosMatch = markdown.match(/(?:current|present).*?position.*?:\s*(.+?)(?:at|@)\s*(.+?)(?:\n|$)/i);
    if (currentPosMatch) {
      profile.currentPosition = {
        title: currentPosMatch[1].trim(),
        company: currentPosMatch[2].trim(),
        duration: 'Present',
      };
    }

    // Extract experience/positions section
    const experienceSection = markdown.match(/(?:experience|work history)([\s\S]*?)(?:education|skills|$)/i);
    if (experienceSection) {
      const positions = this.extractPositions(experienceSection[1]);
      profile.pastPositions = positions;
    }

    // Extract education section
    const educationSection = markdown.match(/education([\s\S]*?)(?:skills|experience|$)/i);
    if (educationSection) {
      const education = this.extractEducation(educationSection[1]);
      profile.education = education;
    }

    // Extract skills section
    const skillsSection = markdown.match(/skills([\s\S]*?)(?:education|experience|$)/i);
    if (skillsSection) {
      const skills = this.extractSkills(skillsSection[1]);
      profile.skills = skills;
    }

    // Extract summary/about section
    const summaryMatch = markdown.match(/(?:about|summary)([\s\S]*?)(?:experience|education|skills|$)/i);
    if (summaryMatch) {
      profile.summary = summaryMatch[1].trim().substring(0, 500); // Limit to 500 chars
    }

    // Fallback: if name is still empty, try to extract from first non-empty line
    if (!profile.name) {
      const lines = markdown.split('\n').filter(line => line.trim().length > 0);
      if (lines.length > 0) {
        profile.name = lines[0].replace(/^#+\s*/, '').trim();
      }
    }

    // Fallback: if headline is still empty, try second line or extract from context
    if (!profile.headline && markdown.length > 0) {
      const lines = markdown.split('\n').filter(line => line.trim().length > 0);
      if (lines.length > 1) {
        profile.headline = lines[1].replace(/^#+\s*/, '').trim();
      }
    }

    return profile;
  }

  private extractPositions(text: string): Array<{ title: string; company: string; duration: string }> {
    const positions: Array<{ title: string; company: string; duration: string }> = [];
    
    // Try to match common patterns for job positions
    const positionPatterns = [
      /(?:^|\n)[-*]\s*(.+?)\s+(?:at|@)\s+(.+?)(?:\s*[-–—]\s*(.+?))?(?:\n|$)/gi,
      /(?:^|\n)(.+?)\s+(?:at|@)\s+(.+?)(?:\s*\((.+?)\))?(?:\n|$)/gi,
    ];

    for (const pattern of positionPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        positions.push({
          title: match[1].trim(),
          company: match[2].trim(),
          duration: match[3]?.trim() || 'N/A',
        });
      }
    }

    return positions;
  }

  private extractEducation(text: string): Array<{ school: string; degree: string; field: string }> {
    const education: Array<{ school: string; degree: string; field: string }> = [];
    
    // Try to match common patterns for education
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('-') || line.startsWith('*')) {
        const parts = line.replace(/^[-*]\s*/, '').split(/,|;|\|/);
        if (parts.length >= 1) {
          education.push({
            school: parts[0].trim(),
            degree: parts[1]?.trim() || 'N/A',
            field: parts[2]?.trim() || 'N/A',
          });
        }
      }
    }

    return education;
  }

  private extractSkills(text: string): string[] {
    const skills: string[] = [];
    
    // Extract skills from bullet points or comma-separated lists
    const lines = text.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        // Bullet point skill
        skills.push(trimmed.replace(/^[-*]\s*/, '').trim());
      } else if (trimmed.includes(',')) {
        // Comma-separated skills
        const commaSeparated = trimmed.split(',').map(s => s.trim()).filter(s => s.length > 0);
        skills.push(...commaSeparated);
      } else if (trimmed.length > 0 && !trimmed.match(/^#+/)) {
        // Single skill per line
        skills.push(trimmed);
      }
    }

    return skills.filter(skill => skill.length > 0).slice(0, 50); // Limit to 50 skills
  }
}
