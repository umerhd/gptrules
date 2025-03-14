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

  // Add debugging effect
  useEffect(() => {
    console.log(
      "[GPTRules Debug] RulesPopup rendered with",
      rules.length,
      "rules"
    );

    // Check if there are any CSS issues
    if (containerRef.current) {
      const styles = window.getComputedStyle(containerRef.current);
      console.log("[GPTRules Debug] Popup container styles:", {
        pointerEvents: styles.pointerEvents,
        zIndex: styles.zIndex,
        position: styles.position,
        display: styles.display,
      });
    }

    return () => {
      console.log("[GPTRules Debug] RulesPopup unmounting");
    };
  }, [rules.length]);

  const handleRuleClick = (rule: Rule, index: number) => {
    console.log("[GPTRules Debug] Rule clicked:", rule.name);
    onRuleSelect(rule);
  };

  const handleMouseEnter = (index: number) => {
    console.log("[GPTRules Debug] Mouse entered rule at index:", index);
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
        console.log("[GPTRules Debug] Popup container clicked");
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
