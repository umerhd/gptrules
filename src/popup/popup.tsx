import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Rule } from "../types";
import "./popup.css";

const Popup: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  useEffect(() => {
    console.log("Popup mounted - Loading initial data");
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const result = await chrome.storage.sync.get(["rules"]);
      console.log("Loaded rules:", result);
      setRules(result.rules || []);
    } catch (error) {
      console.error("Error loading rules:", error);
    }
  };

  const saveRule = async (rule: Rule) => {
    try {
      console.log("Saving rule:", rule);
      const updatedRules = editingRule
        ? rules.map((r) => (r.id === rule.id ? rule : r))
        : [...rules, rule];

      await chrome.storage.sync.set({
        rules: updatedRules,
      });
      console.log("Rule saved successfully");

      setRules(updatedRules);
      setEditingRule(null);
    } catch (error) {
      console.error("Error saving rule:", error);
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      const updatedRules = rules.filter((r) => r.id !== ruleId);
      await chrome.storage.sync.set({
        rules: updatedRules,
      });
      setRules(updatedRules);
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  return (
    <div className="popup-container">
      <header>
        <h1>AI Chat Rules Manager</h1>
        <div>Active Rules: {rules.length}</div>
      </header>

      <button
        onClick={async () => {
          console.log("Testing storage...");
          try {
            await chrome.storage.sync.set({ test: "Hello World" });
            console.log("Test data saved");
            const result = await chrome.storage.sync.get(["test"]);
            console.log("Test data loaded:", result);
          } catch (error) {
            console.error("Storage test failed:", error);
          }
        }}
      >
        Test Storage
      </button>

      <div className="rules-container">
        <h2>Rules</h2>

        {editingRule ? (
          <RuleForm
            initialRule={editingRule}
            onSave={saveRule}
            onCancel={() => setEditingRule(null)}
          />
        ) : (
          <button
            className="add-rule-btn"
            onClick={() =>
              setEditingRule({
                id: crypto.randomUUID(),
                name: "",
                description: "",
                content: "",
                isActive: true,
              })
            }
          >
            Add New Rule
          </button>
        )}

        <div className="rules-list">
          {rules.map((rule) => (
            <div key={rule.id} className="rule-item">
              <div className="rule-header">
                <h3>{rule.name}</h3>
                <div className="rule-actions">
                  <button onClick={() => setEditingRule(rule)}>Edit</button>
                  <button onClick={() => deleteRule(rule.id)}>Delete</button>
                </div>
              </div>
              <p className="rule-description">{rule.description}</p>
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
  const [rule, setRule] = useState<Rule>(
    initialRule || {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      content: "",
      isActive: true,
    }
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(rule);
      }}
    >
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={rule.name}
          onChange={(e) => setRule({ ...rule, name: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <input
          type="text"
          value={rule.description}
          onChange={(e) => setRule({ ...rule, description: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Rule Content:</label>
        <textarea
          value={rule.content}
          onChange={(e) => setRule({ ...rule, content: e.target.value })}
          rows={5}
        />
      </div>

      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
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
