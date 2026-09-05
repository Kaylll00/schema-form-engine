"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check, Code, ShieldAlert, FileText } from "lucide-react";
import { JSONSchema } from "@/types/schema";

interface OutputInspectorProps {
  data: Record<string, any>;
  errors: any[];
  schemaText?: string;
}

function generateJSXFromSchema(schema: JSONSchema | null): string {
  if (!schema || !schema.properties) {
    return `// Paste a valid JSON Schema to generate standalone React code`;
  }

  const requiredSet = new Set(schema.required || []);
  const fieldCode = Object.entries(schema.properties)
    .map(([key, propSchema]) => {
      const isRequired = requiredSet.has(key);
      const title = propSchema.title || key;
      const type = propSchema.type || "string";
      const format = propSchema.format;

      let inputElement = "";

      if (propSchema.enum) {
        inputElement = `        <select 
          {...register("${key}"${isRequired ? ', { required: true }' : ''})} 
          className="w-full h-10 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select ${title} --</option>
          ${propSchema.enum.map((opt) => `<option value="${opt}">${opt}</option>`).join("\n          ")}
        </select>`;
      } else if (type === "boolean") {
        inputElement = `        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            {...register("${key}")} 
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600" 
          />
          <span className="text-sm text-slate-300">${title}</span>
        </label>`;
      } else if (type === "number" || type === "integer") {
        const rules: string[] = [];
        if (isRequired) rules.push("required: true");
        if (propSchema.minimum !== undefined) rules.push(`min: ${propSchema.minimum}`);
        if (propSchema.maximum !== undefined) rules.push(`max: ${propSchema.maximum}`);
        const ruleStr = rules.length ? `, { ${rules.join(", ")} }` : "";

        inputElement = `        <input 
          type="number" 
          step="${propSchema.multipleOf || (type === "integer" ? 1 : "any")}"
          {...register("${key}"${ruleStr})} 
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder:text-slate-500 text-sm" 
        />`;
      } else {
        const rules: string[] = [];
        if (isRequired) rules.push("required: 'This field is required'");
        if (propSchema.minLength) rules.push(`minLength: { value: ${propSchema.minLength}, message: 'Min length is ${propSchema.minLength}' }`);
        if (propSchema.pattern) rules.push(`pattern: { value: /${propSchema.pattern}/, message: 'Invalid pattern' }`);
        const ruleStr = rules.length ? `, { ${rules.join(", ")} }` : "";
        const inputType = format === "email" ? "email" : format === "date" ? "date" : format === "color" ? "color" : "text";

        inputElement = `        <input 
          type="${inputType}" 
          placeholder="Enter ${title}..."
          {...register("${key}"${ruleStr})} 
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />`;
      }

      return `      {/* Field: ${title} */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-200">
          ${title}${isRequired ? ' <span className="text-rose-400">*</span>' : ""}
        </label>
${inputElement}
        {errors.${key} && <p className="text-xs text-rose-400">{errors.${key}?.message || "Invalid value"}</p>}
      </div>`;
    })
    .join("\n\n");

  return `// Standalone Generated React Component (React Hook Form + Tailwind CSS)
import React from 'react';
import { useForm } from 'react-hook-form';

export default function StandaloneForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log("Submitted Payload:", data);
    alert("Form submitted successfully! Check console for payload.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl p-6 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 shadow-xl">
      <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">
        ${schema.title || "Generated Form"}
      </h2>
${schema.description ? `      <p className="text-xs text-slate-400">${schema.description}</p>\n` : ""}
${fieldCode}

      <button 
        type="submit" 
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md shadow transition-colors"
      >
        Submit Response
      </button>
    </form>
  );
}`;
}

export function OutputInspector({ data, errors, schemaText }: OutputInspectorProps) {
  const [activeTab, setActiveTab] = useState<"payload" | "validation" | "code">("payload");
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  // Parse schema for JSX code generator
  const parsedSchema = useMemo(() => {
    if (!schemaText) return null;
    try {
      return JSON.parse(schemaText);
    } catch {
      return null;
    }
  }, [schemaText]);

  const generatedCodeSnippet = useMemo(() => {
    return generateJSXFromSchema(parsedSchema);
  }, [parsedSchema]);

  // Copy payload
  const handleCopyPayload = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  // Download json file
  const handleDownloadPayload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `form-response-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Inspector Header Tabs */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex bg-slate-900 p-1 rounded-md border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("payload")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
              activeTab === "payload"
                ? "bg-slate-800 text-slate-100 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Payload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("validation")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
              activeTab === "validation"
                ? "bg-slate-800 text-slate-100 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Validation ({errors.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
              activeTab === "code"
                ? "bg-slate-800 text-slate-100 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Export Code
          </button>
        </div>

        {/* Header Action Buttons */}
        {activeTab === "payload" && (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyPayload}
              className="h-7 text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              {copiedPayload ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copiedPayload ? "Copied" : "Copy"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadPayload}
              className="h-7 text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Download
            </Button>
          </div>
        )}

        {activeTab === "code" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            className="h-7 text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copiedCode ? "Copied JSX" : "Copy Code"}
          </Button>
        )}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-200">
        {activeTab === "payload" && (
          <pre className="bg-slate-950 p-4 rounded-md border border-slate-800 text-emerald-400 overflow-x-auto">
            {jsonString}
          </pre>
        )}

        {activeTab === "validation" && (
          <div className="space-y-3">
            {errors.length === 0 ? (
              <div className="p-6 text-center rounded-md border border-dashed border-slate-800 text-slate-500 font-sans">
                <p className="text-emerald-400 font-semibold mb-1">✓ Zero Validation Errors</p>
                <p className="text-xs">Current form payload strictly conforms to the JSON Schema.</p>
              </div>
            ) : (
              errors.map((err, index) => (
                <div
                  key={index}
                  className="p-3 rounded-md border border-rose-900/60 bg-rose-950/20 text-rose-300 space-y-1 font-sans"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-rose-400">
                    <span>Path: {err.instancePath || "/ (root)"}</span>
                    <span className="bg-rose-900/60 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                      {err.keyword}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-rose-200">{err.message}</p>
                  {err.params && Object.keys(err.params).length > 0 && (
                    <p className="text-[11px] text-slate-400 font-mono">
                      Params: {JSON.stringify(err.params)}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "code" && (
          <pre className="bg-slate-950 p-4 rounded-md border border-slate-800 text-blue-300 overflow-x-auto leading-relaxed">
            {generatedCodeSnippet}
          </pre>
        )}
      </div>
    </div>
  );
}
