import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Rule } from "../types";
import "../global.css";
import { Gavel } from "lucide-react";

const Popup: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  useEffect(() => {
    loadRules();

    // Fix for popup width
    document.body.style.width = "400px";
    document.body.style.minWidth = "400px";
  }, []);

  const loadRules = async () => {
    try {
      // Use message passing to get rules from background script
      chrome.runtime.sendMessage({ type: "GET_RULES" }, (response) => {
        setRules(response || []);
      });
    } catch (error) {
      console.error("Error loading rules:", error);
    }
  };

  const saveRule = async (rule: Rule) => {
    try {
      // Check if this is a new rule or an existing one
      const isNewRule = !rules.some(
        (existingRule) => existingRule.id === rule.id
      );

      if (isNewRule) {
        // For new rules, send add message
        chrome.runtime.sendMessage(
          {
            type: "ADD_RULE",
            rule,
          },
          (response) => {
            if (response && response.success) {
              setRules(response.rules);
            } else {
              console.error("Error adding rule:", response?.error);
            }
            setEditingRule(null);
          }
        );
      } else {
        // If editing an existing rule, send update message
        chrome.runtime.sendMessage(
          {
            type: "UPDATE_RULE",
            rule,
          },
          (response) => {
            if (response && response.success) {
              setRules(response.rules);
            } else {
              console.error("Error updating rule:", response?.error);
            }
            setEditingRule(null);
          }
        );
      }
    } catch (error) {
      console.error("Error in saveRule:", error);
      setEditingRule(null);
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      // Send delete message
      chrome.runtime.sendMessage(
        {
          type: "DELETE_RULE",
          ruleId,
        },
        (response) => {
          if (response && response.success) {
            setRules(response.rules);
          } else {
            console.error("Error deleting rule:", response?.error);
          }
        }
      );
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  return (
    <div className="w-[400px] p-5 font-inter bg-white">
      <header className="mb-5 flex items-center space-x-2">
        <h1 className="text-xl font-inter font-bold"> GPT Rules Manager</h1>
      </header>

      <div className="mt-5">
        <h2 className="text-lg font-roboto font-semibold mb-3">Rules</h2>

        <button
          className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded w-full mb-4 font-helvetica font-semibold text-sm"
          onClick={() => {
            const newRule: Rule = {
              id: crypto.randomUUID(),
              name: "",
              description: "",
              content: "",
              isActive: true,
            };
            setEditingRule(newRule);
          }}
        >
          Add New Rule
        </button>

        {/* Show the form for new rules at the bottom */}
        {editingRule && !rules.some((r) => r.id === editingRule.id) && (
          <div className="border border-gray-200 rounded-lg p-4">
            <RuleForm
              initialRule={editingRule}
              onSave={saveRule}
              onCancel={() => setEditingRule(null)}
            />
          </div>
        )}
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              {editingRule && editingRule.id === rule.id ? (
                <RuleForm
                  initialRule={editingRule}
                  onSave={saveRule}
                  onCancel={() => setEditingRule(null)}
                />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-roboto font-semibold text-sm text-black">
                      {rule.name}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        className="bg-black hover:bg-gray-800 text-white py-1 px-3 rounded text-sm font-helvetica"
                        onClick={() => setEditingRule(rule)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-red-900 py-1 px-3 rounded text-sm font-helvetica"
                        onClick={() => deleteRule(rule.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-black font-helvetica">
                    {rule.description}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface RuleFormProps {
  initialRule?: Rule | null;
  onSave: (rule: Rule) => void;
  onCancel: () => void;
}

const RuleForm: React.FC<RuleFormProps> = ({
  initialRule,
  onSave,
  onCancel,
}) => {
  const [rule, setRule] = useState<Rule>(() => {
    if (initialRule) {
      return initialRule;
    } else {
      // Generate a new rule with a valid UUID
      return {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        content: "",
        isActive: true,
      };
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(rule);
  };

  return (
    <form
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4 font-roboto"
      onSubmit={handleSubmit}
    >
      <div className="mb-3">
        <label className="block text-sm font-roboto font-semibold mb-1 text-black">
          Name:
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-helvetica"
          value={rule.name}
          onChange={(e) => setRule({ ...rule, name: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-roboto font-semibold mb-1 text-black">
          Description:
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-helvetica"
          value={rule.description}
          onChange={(e) => setRule({ ...rule, description: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-roboto font-semibold mb-1 text-black">
          Rule Content:
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-helvetica"
          value={rule.content}
          onChange={(e) => setRule({ ...rule, content: e.target.value })}
          rows={5}
          required
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-green-900 py-2 px-4 rounded font-helvetica"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-black hover:bg-gray-600 text-white py-2 px-4 rounded font-helvetica"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(<Popup />);
  }
});
