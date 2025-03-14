import React, { useState, useEffect, useRef } from "react";
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
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, rules.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (rules[selectedIndex]) {
            onRuleSelect(rules[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [rules, selectedIndex, onRuleSelect, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current && containerRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  return (
    <div
      style={{
        position: "absolute",
        left: position.left,
        top: position.top,
        maxWidth: "300px",
        minWidth: "200px",
      }}
    >
      <div className="rules-list" ref={containerRef}>
        {rules.map((rule, index) => (
          <div
            key={rule.id}
            ref={index === selectedIndex ? selectedItemRef : null}
            onClick={() => onRuleSelect(rule)}
            className={`rule-item ${index === selectedIndex ? "selected" : ""}`}
            onMouseEnter={() => setSelectedIndex(index)}
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
