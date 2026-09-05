"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { JSONSchema } from "@/types/schema";

interface TextInputProps {
  id: string;
  schema: JSONSchema;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  isRequired?: boolean;
}

export function TextInput({ id, schema, value = "", onChange, error, isRequired }: TextInputProps) {
  const inputType = schema.format === "email" ? "email" : "text";

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium text-slate-200 flex items-center gap-1">
          {schema.title || id}
          {(isRequired || (Array.isArray(schema.required) && schema.required.includes(id))) && (
            <span className="text-rose-400">*</span>
          )}
        </label>
        {schema.maxLength && (
          <span className="text-xs text-slate-500">
            {value?.length || 0}/{schema.maxLength} max
          </span>
        )}
      </div>

      {schema.description && (
        <p className="text-xs text-slate-400 leading-relaxed">{schema.description}</p>
      )}

      <Input
        id={id}
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={schema.default ? String(schema.default) : `Enter ${schema.title || id}...`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 ${
          error ? "border-rose-500 focus-visible:ring-rose-500" : ""
        }`}
      />

      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-rose-400 flex items-center gap-1 animate-in fade-in-50">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
