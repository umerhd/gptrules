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
      className="absolute bg-black text-blue-500 border border-gray-700 z-[1000] p-2.5 rounded-md shadow-lg font-roboto"
      style={{
        left: position.left,
        top: position.top,
      }}
    >
      {rules.map((rule) => (
        <div
          key={rule.id}
          onClick={() => onRuleSelect(rule)}
          className="p-2 cursor-pointer border-b border-gray-700 hover:bg-gray-800 font-helvetica"
        >
          {rule.name}
        </div>
      ))}
    </div>
  );
};

export default RulesPopup;
