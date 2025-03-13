import React from "react";
import { Rule } from "../types";

interface RulesPopupProps {
  rules: Rule[];
  position: { left: string; top: string };
  onRuleSelect: (rule: Rule) => void;
  onClose: () => void;
}

const RulesPopup: React.FC<RulesPopupProps> = ({
  rules,
  position,
  onRuleSelect,
  onClose,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        display: "block",
        backgroundColor: "#000",
        color: "#007bff",
        border: "1px solid #333",
        zIndex: 1000,
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
        left: position.left,
        top: position.top,
      }}
    >
      {rules.map((rule) => (
        <div
          key={rule.id}
          onClick={() => onRuleSelect(rule)}
          style={{
            padding: "8px",
            cursor: "pointer",
            borderBottom: "1px solid #333",
          }}
        >
          {rule.name}
        </div>
      ))}
    </div>
  );
};

export default RulesPopup;
