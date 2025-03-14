import React, { useState, useRef, useEffect } from "react";
import { Rule } from "../types";
import { Hash } from "lucide-react";
import "./rules-popup.css";

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRuleClick = (rule: Rule, index: number) => {
    onRuleSelect(rule);
  };

  const handleMouseEnter = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: position.left,
        top: position.top,
        maxWidth: "300px",
        minWidth: "200px",
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent click from propagating
      }}
    >
      <div className="rules-list" ref={containerRef}>
        {rules.map((rule, index) => (
          <div
            key={rule.id}
            onClick={(e) => {
              e.stopPropagation();
              handleRuleClick(rule, index);
            }}
            className={`rule-item ${index === selectedIndex ? "selected" : ""}`}
            onMouseEnter={() => handleMouseEnter(index)}
          >
            <Hash className="w-4 h-4 text-black flex-shrink-0" />
            <span className="rule-title">{rule.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RulesPopup;
