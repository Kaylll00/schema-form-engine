"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { JSONSchema } from "@/types/schema";

interface ColorInputProps {
  id: string;
  schema: JSONSchema;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  isRequired?: boolean;
}

export function ColorInput({ id, schema, value = "#000000", onChange, error, isRequired }: ColorInputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-200 flex items-center gap-1">
        {schema.title || id}
        {isRequired && <span className="text-rose-400">*</span>}
      </label>

      {schema.description && (
        <p className="text-xs text-slate-400 leading-relaxed">{schema.description}</p>
      )}

      <div className="flex items-center gap-3">
        <input
          id={id}
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 rounded cursor-pointer border border-slate-700 bg-slate-900 p-1"
        />
        <Input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="bg-slate-900 border-slate-700 text-slate-100 font-mono text-sm uppercase flex-1"
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-rose-400 flex items-center gap-1 animate-in fade-in-50">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
