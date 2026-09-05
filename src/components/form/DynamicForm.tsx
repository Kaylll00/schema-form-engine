"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { JSONSchema } from "@/types/schema";
import { validateFormData, validateSchemaSyntax } from "@/lib/ajv";
import { RenderSchemaField } from "./RenderSchemaField";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";

interface DynamicFormProps {
  schemaText: string;
  onDataChange: (data: any) => void;
  onErrorChange: (errors: any[]) => void;
}

function setDeepValue(obj: any, path: string, value: any): any {
  if (!path) return value;
  const keys = path.split(".");
  const root = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  let current = root;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isNextNumber = !isNaN(Number(nextKey));

    if (current[key] === undefined || current[key] === null) {
      current[key] = isNextNumber ? [] : {};
    } else if (Array.isArray(current[key])) {
      current[key] = [...current[key]];
    } else if (typeof current[key] === "object") {
      current[key] = { ...current[key] };
    }
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  if (value === undefined) {
    delete current[lastKey];
  } else {
    current[lastKey] = value;
  }
  return root;
}

export function DynamicForm({ schemaText, onDataChange, onErrorChange }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  // 1. Parse Schema Text
  const { schema, parseError } = useMemo(() => {
    try {
      const parsed = JSON.parse(schemaText);
      const syntaxCheck = validateSchemaSyntax(parsed);
      if (!syntaxCheck.valid) {
        return { schema: null, parseError: syntaxCheck.error || "Invalid schema structure" };
      }
      return { schema: parsed as JSONSchema, parseError: null };
    } catch (err: any) {
      return { schema: null, parseError: `JSON Syntax Error: ${err.message}` };
    }
  }, [schemaText]);

  // 2. Validate Form Data with Ajv
  const { validationErrors, errorMap } = useMemo(() => {
    if (!schema) return { validationErrors: [], errorMap: {} };
    const { errors } = validateFormData(schema, formData);
    const map: Record<string, string> = {};

    errors.forEach((err) => {
      // Create clean field path key
      let path = err.instancePath.replace(/^\//, "").replace(/\//g, ".");
      if (err.keyword === "required" && err.params?.missingProperty) {
        path = path ? `${path}.${err.params.missingProperty}` : err.params.missingProperty;
      }
      if (path && !map[path]) {
        map[path] = err.message || "Invalid field value";
      }
    });

    return { validationErrors: errors, errorMap: map };
  }, [schema, formData]);

  // Sync state upward
  useEffect(() => {
    onDataChange(formData);
    onErrorChange(validationErrors);
  }, [formData, validationErrors, onDataChange, onErrorChange]);

  const handleFieldChange = useCallback((path: string, value: any) => {
    setFormData((prev) => setDeepValue(prev, path, value));
  }, []);

  const handleReset = () => {
    setFormData({});
  };

  if (parseError) {
    return (
      <div className="p-6 text-center rounded-lg border border-rose-800/50 bg-rose-950/20 text-rose-300 space-y-3">
        <AlertTriangle className="w-8 h-8 mx-auto text-rose-400" />
        <h3 className="font-semibold text-base">Invalid JSON Schema Definition</h3>
        <p className="text-xs text-rose-400 font-mono max-w-md mx-auto">{parseError}</p>
        <p className="text-xs text-slate-400">
          Fix the JSON syntax errors in Panel 1 to resume live form rendering.
        </p>
      </div>
    );
  }

  if (!schema) return null;

  return (
    <div className="space-y-4">
      {/* Form Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-semibold text-slate-100 text-sm">{schema.title || "Dynamic Form"}</h3>
          {schema.description && (
            <p className="text-xs text-slate-400 mt-0.5">{schema.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {validationErrors.length === 0 ? (
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Valid Payload
            </span>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-300 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> {validationErrors.length}{" "}
              {validationErrors.length === 1 ? "Error" : "Errors"}
            </span>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 h-8"
            title="Reset form state"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Render Schema Fields Root */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <RenderSchemaField
          schema={schema}
          fieldPath=""
          value={formData}
          onChange={handleFieldChange}
          errors={errorMap}
        />
      </form>
    </div>
  );
}
