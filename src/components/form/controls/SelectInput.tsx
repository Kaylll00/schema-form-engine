"use client";

import React from "react";
import { JSONSchema } from "@/types/schema";

interface SelectInputProps {
  id: string;
  schema: JSONSchema;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  isRequired?: boolean;
}

export function SelectInput({ id, schema, value = "", onChange, error, isRequired }: SelectInputProps) {
  const options = schema.enum || [];

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-200 flex items-center gap-1">
        {schema.title || id}
        {isRequired && <span className="text-rose-400">*</span>}
      </label>

      {schema.description && (
        <p className="text-xs text-slate-400 leading-relaxed">{schema.description}</p>
      )}

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full h-10 px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-rose-500 focus:ring-rose-500" : ""
        }`}
      >
        <option value="" disabled className="text-slate-500">
          -- Select {schema.title || id} --
        </option>
        {options.map((opt) => (
          <option key={String(opt)} value={String(opt)}>
            {String(opt)}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-rose-400 flex items-center gap-1 animate-in fade-in-50">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
