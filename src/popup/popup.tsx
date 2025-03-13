import React, { useState, useEffect } from "react";
import { Rule, RuleSet } from "../types";

const Popup: React.FC = () => {
  const [ruleSets, setRuleSets] = useState<RuleSet[]>([]);
  const [activeRuleSet, setActiveRuleSet] = useState<RuleSet | null>(null);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  useEffect(() => {
    // Load rule sets from storage when popup opens
    loadRuleSets();
  }, []);

  const loadRuleSets = async () => {
    const result = await chrome.storage.sync.get(["ruleSets", "activeRuleSet"]);
    setRuleSets(result.ruleSets || []);
    setActiveRuleSet(result.activeRuleSet || null);
  };

  const saveRule = async (rule: Rule) => {
    if (!activeRuleSet) return;

    const updatedRuleSet = {
      ...activeRuleSet,
      rules: editingRule
        ? activeRuleSet.rules.map((r) => (r.id === rule.id ? rule : r))
        : [...activeRuleSet.rules, rule],
    };

    const updatedRuleSets = ruleSets.map((rs) =>
      rs.id === updatedRuleSet.id ? updatedRuleSet : rs
    );

    await chrome.storage.sync.set({
      ruleSets: updatedRuleSets,
      activeRuleSet: updatedRuleSet,
    });

    setRuleSets(updatedRuleSets);
    setActiveRuleSet(updatedRuleSet);
    setEditingRule(null);
  };

  return (
    <div className="popup-container">
      <header>
        <h1>AI Chat Rules Manager</h1>
      </header>

      <div className="rule-sets">
        <h2>Rule Sets</h2>
        <select
          value={activeRuleSet?.id || ""}
          onChange={(e) => {
            const selected = ruleSets.find((rs) => rs.id === e.target.value);
            setActiveRuleSet(selected || null);
            chrome.storage.sync.set({ activeRuleSet: selected });
          }}
        >
          <option value="">Select a Rule Set</option>
          {ruleSets.map((rs) => (
            <option key={rs.id} value={rs.id}>
              {rs.name}
            </option>
          ))}
        </select>
      </div>

      {activeRuleSet && (
        <div className="rules-list">
          <h3>Rules in {activeRuleSet.name}</h3>
          {activeRuleSet.rules.map((rule) => (
            <div key={rule.id} className="rule-item">
              <h4>{rule.name}</h4>
              <p>{rule.description}</p>
              <div className="rule-actions">
                <button onClick={() => setEditingRule(rule)}>Edit</button>
                <button
                  onClick={() => {
                    /* Handle delete */
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editingRule || activeRuleSet) && (
        <div className="rule-editor">
          <h3>{editingRule ? "Edit Rule" : "New Rule"}</h3>
          <RuleForm
            initialRule={editingRule}
            onSave={saveRule}
            onCancel={() => setEditingRule(null)}
          />
        </div>
      )}
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

export default Popup;
