import { TEntry } from "@/types/resume";
import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleCleannedText = (text: string) =>
  text.replace(/```(?:json)?\n?/g, "").trim();

export const getNextUpdateDate = () =>
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 24h

export const formatDisplayDate = (value: string) => {
  const date = parse(value, "yyyy-MM", new Date());
  return format(date, "MMM yyy");
};

export const entriesToMarkdown = (
  type: "Experience" | "Education" | "Projects",
  entries: TEntry[]
) => {
  return (
    `## ${type}\n\n` +
    entries
      .map((item) => {
        const dateRange = item.isCurrent
          ? `${item.startDate} - Present`
          : `${item.startDate} - ${item.endDate}`;
        return `### ${item.title} @ ${item.organization}\n${dateRange}\n\n${item.description}`;
      })
      .join("\n\n")
  );
};

export const extractInfo = (mdString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(mdString, "text/html");

  // Extract email & phone
  const contactText = doc.body.textContent || "";
  const emailMatch = contactText.match(/\S+@\S+\.\S+/);
  const phoneMatch = contactText.match(/\b\d{10,}\b/);

  // Extract Professional summary
  const summaryMatch = mdString.match(
    /## Professional summary\s+([\s\S]*?)\s+##/
  );
  const summary = summaryMatch ? summaryMatch[1].trim() : "";

  // Extract Skills
  const skillsMatch = mdString.match(/## Skills\s+([\s\S]*?)\s+##/);
  const skills = skillsMatch ? skillsMatch[1].trim() : "";

  return {
    email: emailMatch ? emailMatch[0] : "",
    mobile: phoneMatch ? phoneMatch[0] : "",
    summary,
    skills,
  };
};
