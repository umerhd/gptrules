interface Rule {
  id: string;
  name: string;
  description: string;
  content: string;
  isActive: boolean;
}

interface RuleSet {
  id: string;
  name: string;
  rules: Rule[];
}

export type { Rule, RuleSet };
