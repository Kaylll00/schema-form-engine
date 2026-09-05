"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { PRESETS } from "@/lib/presets";
import { AlignLeft, Minimize2, Trash2, Check, AlertCircle } from "lucide-react";

interface SchemaEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SchemaEditor({ value, onChange }: SchemaEditorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("userProfile");

  // Format / Prettify JSON
  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch {
      // Ignore if invalid JSON
    }
  };

  // Minify JSON
  const handleMinify = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed));
    } catch {
      // Ignore if invalid JSON
    }
  };

  // Handle Preset Change
  const handleSelectPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = PRESETS[presetKey];
    if (preset) {
      onChange(JSON.stringify(preset.schema, null, 2));
    }
  };

  // Handle Clear
  const handleClear = () => {
    onChange("{\n  \"type\": \"object\",\n  \"properties\": {}\n}");
  };

  // Check JSON Syntax Status
  let isSyntaxValid = true;
  try {
    JSON.parse(value);
  } catch {
    isSyntaxValid = false;
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Editor Header Toolbar */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="preset-select" className="text-xs font-semibold text-slate-400">
            Preset:
          </label>
          <select
            id="preset-select"
            value={selectedPreset}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="h-8 text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {Object.entries(PRESETS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium ${
              isSyntaxValid
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : "bg-rose-950 text-rose-400 border border-rose-800"
            }`}
          >
            {isSyntaxValid ? (
              <>
                <Check className="w-3 h-3" /> Valid JSON
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3" /> Invalid JSON
              </>
            )}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePrettify}
            className="h-7 text-xs text-slate-300 hover:text-slate-100 hover:bg-slate-800 px-2"
            title="Prettify JSON"
          >
            <AlignLeft className="w-3.5 h-3.5 mr-1" /> Prettify
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleMinify}
            className="h-7 text-xs text-slate-300 hover:text-slate-100 hover:bg-slate-800 px-2"
            title="Minify JSON"
          >
            <Minimize2 className="w-3.5 h-3.5 mr-1" /> Minify
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2"
            title="Clear Form"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-[300px] relative">
        <Editor
          height="100%"
          defaultLanguage="json"
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}
