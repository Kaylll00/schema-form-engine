"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { JSONSchema } from "@/types/schema";

interface BooleanInputProps {
  id: string;
  schema: JSONSchema;
  value: boolean;
  onChange: (val: boolean) => void;
  error?: string;
  isRequired?: boolean;
}

export function BooleanInput({ id, schema, value = false, onChange, error, isRequired }: BooleanInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors">
        <div className="space-y-0.5">
          <label htmlFor={id} className="text-sm font-medium text-slate-200 cursor-pointer">
            {schema.title || id}
            {isRequired && <span className="text-rose-400 ml-1">*</span>}
          </label>
          {schema.description && (
            <p className="text-xs text-slate-400 leading-relaxed">{schema.description}</p>
          )}
        </div>
        <Switch
          id={id}
          checked={!!value}
          onCheckedChange={(checked) => onChange(checked)}
          className="data-[state=checked]:bg-blue-600"
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
