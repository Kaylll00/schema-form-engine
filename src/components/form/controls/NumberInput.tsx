"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { JSONSchema } from "@/types/schema";

interface NumberInputProps {
  id: string;
  schema: JSONSchema;
  value: number | string;
  onChange: (val: number | undefined) => void;
  error?: string;
  isRequired?: boolean;
}

export function NumberInput({ id, schema, value = "", onChange, error, isRequired }: NumberInputProps) {
  const isInteger = schema.type === "integer";
  const step = schema.multipleOf ?? (isInteger ? 1 : "any");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange(undefined);
      return;
    }
    const num = isInteger ? parseInt(raw, 10) : parseFloat(raw);
    onChange(isNaN(num) ? undefined : num);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium text-slate-200 flex items-center gap-1">
          {schema.title || id}
          {isRequired && <span className="text-rose-400">*</span>}
        </label>
        {(schema.minimum !== undefined || schema.maximum !== undefined) && (
          <span className="text-xs text-slate-500">
            {schema.minimum !== undefined ? `Min: ${schema.minimum}` : ""}
            {schema.minimum !== undefined && schema.maximum !== undefined ? " | " : ""}
            {schema.maximum !== undefined ? `Max: ${schema.maximum}` : ""}
          </span>
        )}
      </div>

      {schema.description && (
        <p className="text-xs text-slate-400 leading-relaxed">{schema.description}</p>
      )}

      <Input
        id={id}
        type="number"
        step={step}
        min={schema.minimum}
        max={schema.maximum}
        value={value ?? ""}
        onChange={handleChange}
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
