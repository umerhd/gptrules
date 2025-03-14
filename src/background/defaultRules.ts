import { Rule } from "../types";

// Collection of default rules
export const defaultRules: Rule[] = [
  {
    id: crypto.randomUUID(),
    name: "Headings Structure",
    description: "Use clear heading hierarchy",
    content:
      "Structure content with clear heading levels (H1, H2, H3, etc.). Use a single H1 for the main title, with H2s for major sections and H3s for subsections. Ensure headings are descriptive and follow a logical hierarchy.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "List Formatting",
    description: "Format lists consistently",
    content:
      "Use bullet points (•) for unordered lists and numbers for sequential items. Keep list items parallel in structure (start with same part of speech). Indent nested lists consistently. Use appropriate punctuation at the end of list items.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Professional Tone",
    description: "Maintain a professional tone in all communications",
    content:
      "Use a professional, respectful tone in all written content. Avoid slang, colloquialisms, and overly casual language. Address the reader directly but formally. Maintain objectivity and avoid emotional language unless specifically appropriate for the context.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Concise Writing",
    description: "Write concisely and avoid verbosity",
    content:
      "Express ideas clearly with minimal words. Eliminate redundant phrases and unnecessary qualifiers. Use active voice instead of passive. Replace lengthy phrases with single words where possible. Break long sentences into shorter ones for clarity.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Table Formatting",
    description: "Create well-structured tables",
    content:
      "Format tables with clear headers and aligned columns. Use consistent spacing between columns. Add divider lines between header and content. Keep table content concise. Consider readability on different screen sizes.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Quote Formatting",
    description: "Format quotations consistently",
    content:
      "Use blockquote formatting for longer quotes. Properly attribute all quotations. Use consistent quotation marks (\" \" or ' '). Format nested quotes appropriately. Ensure quoted material is accurately reproduced.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Link Formatting",
    description: "Format links clearly and descriptively",
    content:
      "Use descriptive link text that indicates the destination. Avoid generic phrases like 'click here'. Format links consistently throughout the document. Consider accessibility when formatting links. Indicate external links when appropriate.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Structured Responses",
    description: "Organize information in a structured format",
    content:
      "Present information in a logical, structured manner. Begin with a clear summary or key point. Group related information into distinct sections. Use progressive disclosure, starting with basic information before details. End with a clear conclusion or next steps.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Precise Language",
    description: "Use precise, specific language",
    content:
      "Choose specific, precise words over vague terms. Quantify statements when possible instead of using general descriptors. Define technical terms when first introduced. Use consistent terminology throughout a document. Avoid ambiguous pronouns and references.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "JSON Format",
    description: "Return clean, properly formatted JSON",
    content:
      "When JSON output is requested, provide properly formatted JSON with correct syntax. Use consistent indentation (2 spaces recommended). Include only the requested data without explanatory text. Ensure all property names are in quotes. Validate the JSON structure before returning.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "YAML Format",
    description: "Return clean, properly formatted YAML",
    content:
      "When YAML output is requested, provide properly formatted YAML with correct syntax. Use consistent indentation (2 spaces recommended). Avoid mixing tabs and spaces. Use appropriate YAML features like anchors and aliases for repeated content when beneficial. Include only the requested data without explanatory text.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Bullet Point Lists",
    description: "Format bullet point lists clearly",
    content:
      "When bullet points are requested, use a consistent bullet character (• or - recommended). Align all bullets at the same indentation level. Start each bullet with a capital letter. Keep bullet points concise and focused on a single idea. Maintain parallel structure across all points in a list.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Plain Text Output",
    description: "Provide clean plain text when requested",
    content:
      "When plain text output is requested, avoid formatting characters or markup. Use line breaks to separate paragraphs. Limit line length to 80 characters when possible. Use spaces rather than tabs for any necessary indentation. Avoid special characters that might not render properly in all text environments.",
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: "CSV Format",
    description: "Return properly formatted CSV data",
    content:
      "When CSV output is requested, provide properly formatted comma-separated values. Include a header row with column names. Enclose fields containing commas, quotes, or line breaks in double quotes. Escape any double quotes within fields by doubling them. Maintain consistent column order throughout the data.",
    isActive: true,
  },
];
