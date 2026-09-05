"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { JSONSchema } from "@/types/schema";

interface ArrayControlProps {
  id: string;
  schema: JSONSchema;
  items: any[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onMoveItem: (from: number, to: number) => void;
  children: (itemPath: string, index: number) => React.ReactNode;
  error?: string;
}

export function ArrayControl({
  id,
  schema,
  items = [],
  onAddItem,
  onRemoveItem,
  onMoveItem,
  children,
  error,
}: ArrayControlProps) {
  const minItems = schema.minItems ?? 0;
  const maxItems = schema.maxItems;

  const canAdd = maxItems === undefined || items.length < maxItems;
  const canRemove = items.length > minItems;

  return (
    <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            {schema.title || id}
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
              {items.length} {items.length === 1 ? "item" : "items"}
              {maxItems ? ` / max ${maxItems}` : ""}
            </span>
          </h4>
          {schema.description && (
            <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{schema.description}</p>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onAddItem}
          disabled={!canAdd}
          className="border-blue-600/40 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Item
        </Button>
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-400 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}

      {items.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-800 rounded-md text-slate-500 text-xs">
          No items added yet. Click &quot;Add Item&quot; to begin.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((_, index) => (
            <div
              key={`${id}-${index}`}
              className="relative group rounded-md border border-slate-800 bg-slate-900/80 p-3 pt-4 transition-all hover:border-slate-700"
            >
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/90 rounded border border-slate-800 p-0.5 z-10">
                <button
                  type="button"
                  onClick={() => onMoveItem(index, index - 1)}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveItem(index, index + 1)}
                  disabled={index === items.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  disabled={!canRemove}
                  className="p-1 text-rose-400 hover:text-rose-300 disabled:opacity-30"
                  title="Remove Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pr-20">{children(id, index)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
