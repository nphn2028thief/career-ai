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
