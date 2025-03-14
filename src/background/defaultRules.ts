import { Rule } from "../types";

// Collection of default rules
export const defaultRules: Rule[] = [
  {
    id: crypto.randomUUID(),
    name: "Professional Communication",
    description: "Maintain professional tone in responses",
    content:
      "Please maintain a professional and courteous tone in all responses. Use clear, concise language and avoid casual expressions.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Code Examples",
    description: "Include practical code examples",
    content:
      "When explaining technical concepts, please include practical code examples with comments explaining key parts.",
    isActive: true,
  },
  // Add more default rules below
  {
    id: crypto.randomUUID(),
    name: "Avoid Jargon",
    description: "Use plain language instead of technical jargon",
    content:
      "Please explain concepts in plain language and define any technical terms when they are first used. Avoid unnecessary jargon.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Structured Responses",
    description: "Provide well-structured, organized responses",
    content:
      "Structure your responses with clear headings, bullet points, or numbered lists when appropriate. Break down complex information into digestible sections.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Cite Sources",
    description: "Provide references for factual claims",
    content:
      "When making factual claims or referencing statistics, please cite reliable sources or indicate when information is based on general knowledge.",
    isActive: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Concise Answers",
    description: "Provide concise, to-the-point answers",
    content:
      "Keep responses concise and directly address the question. Avoid unnecessary elaboration unless specifically requested.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Step-by-Step Instructions",
    description: "Break down complex processes into steps",
    content:
      "When explaining how to do something, break it down into clear, sequential steps. Number the steps and provide context for each one.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Balanced Perspective",
    description: "Present multiple viewpoints on controversial topics",
    content:
      "When discussing controversial or debated topics, present multiple perspectives fairly and avoid showing bias toward any particular viewpoint.",
    isActive: false,
  },
];
