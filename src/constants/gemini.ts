import { DemandLevel, MarketOutlook } from "@prisma/client";

export const prompt = (industry: string | null) =>
  `Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
    "salaryRanges": [
        { "role": "string", "min": number, "max": number, "medium": number, "location": "string" }
    ],
    "growthRate": number,
    "demandLevel": ${DemandLevel.LOW} | ${DemandLevel.MEDIUM} | ${DemandLevel.HIGH},
    "topSkills": ["skill1", "skill2"],
    "marketOutlook": ${MarketOutlook.POSITIVE} | ${MarketOutlook.NEUTRAL} | ${MarketOutlook.NEGATIVE},
    "keyTrends": ["trend1", "trend2"],
    "recommendSkills": ["skill1", "skill2"]
    }
    
    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
`;

export const interviewPrompt = (industry: string | null, skills: string[]) => `
    Generate 10 technical interview questions for a ${industry} professional${
  skills.length ? ` with expertise in ${skills.join(", ")}` : ""
}.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

export const improvementPrompt = (
  industry: string | null,
  wrongQuestionText: string
) => `
    The user got the following ${industry} technical interview questions wrong:

    ${wrongQuestionText}

    Based on these mistakes, provide a concise, specific improvement tip.
    Focus on the knowledge gaps revealed by these wrong answers.
    Keep the response under 2 sentences and make it encouraging.
    Don't explicitly mention the mistakes, instead focus on what to learn or practice.
  `;

export const experienceDescPrompt = (
  type: string,
  industry: string | null,
  currentContent: string
) => `
    As an expert resume writer, improve the following ${type} description for a ${industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${currentContent}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

export const coverLetterPrompt = (
  jobTitle: string,
  companyName: string,
  industry: string | null,
  experience: number | null,
  skills: string[],
  bio: string | null,
  jobDesc: string | null
) => `
      Write a professional cover letter for a ${jobTitle} position at ${companyName}.
      
      About the candidate:
      - Industry: ${industry}
      - Years of Experience: ${experience}
      - Skills: ${skills?.join(", ")}
      - Professional Background: ${bio}
      
      Job Description:
      ${jobDesc}
      
      Requirements:
      1. Use a professional, enthusiastic tone
      2. Highlight relevant skills and experience
      3. Show understanding of the company's needs
      4. Keep it concise (max 400 words)
      5. Use proper business letter formatting in markdown
      6. Include specific examples of achievements
      7. Relate candidate's background to job requirements
      
      Format the letter in markdown.
    `;
