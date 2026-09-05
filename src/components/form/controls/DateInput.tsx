"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { JSONSchema } from "@/types/schema";

interface DateInputProps {
  id: string;
  schema: JSONSchema;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  isRequired?: boolean;
}

export function DateInput({ id, schema, value = "", onChange, error, isRequired }: DateInputProps) {
  const isDateTime = schema.format === "date-time";
  const type = isDateTime ? "datetime-local" : "date";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-200 flex items-center gap-1">
        {schema.title || id}
        {isRequired && <span className="text-rose-400">*</span>}
      </label>

      {schema.description && (
        <p className="text-xs text-slate-400 leading-relaxed">{schema.description}</p>
      )}

      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
