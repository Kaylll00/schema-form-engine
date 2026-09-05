"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { PRESETS } from "@/lib/presets";
import { DynamicForm } from "@/components/form/DynamicForm";
import { OutputInspector } from "@/components/inspector/OutputInspector";
import { Layers, Sparkles, FileCode } from "lucide-react";

// Monaco Editor client dynamic load
const SchemaEditor = dynamic(
  () => import("@/components/editor/SchemaEditor").then((mod) => mod.SchemaEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs">
        Loading Code Editor...
      </div>
    ),
  }
);

export default function Home() {
  const [schemaText, setSchemaText] = useState(
    JSON.stringify(PRESETS.userProfile.schema, null, 2)
  );
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Workspace Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-950 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-100 flex items-center gap-2">
              JSON Schema Form Engine
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-400">
                v1.0 Live AST
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Parse JSON Schema primitives, dynamic arrays &amp; nested objects into reactive forms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Ajv Validated Engine
          </span>
        </div>
      </header>

      {/* 3-Panel Layout Dashboard */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-h-0 overflow-hidden">
        {/* Panel 1: Monaco Code Editor */}
        <section className="lg:col-span-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <FileCode className="w-4 h-4 text-blue-400" />
            <h2 className="font-semibold text-xs tracking-wider uppercase text-slate-400">
              1. JSON Schema Definition
            </h2>
          </div>
          <div className="flex-1 min-h-0">
            <SchemaEditor value={schemaText} onChange={setSchemaText} />
          </div>
        </section>

        {/* Panel 2: Live Rendered Dynamic Form */}
        <section className="lg:col-span-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-xs tracking-wider uppercase text-slate-400">
              2. Dynamic UI Form Preview
            </h2>
          </div>
          <div className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-y-auto shadow-inner">
            <DynamicForm
              schemaText={schemaText}
              onDataChange={setFormData}
              onErrorChange={setValidationErrors}
            />
          </div>
        </section>

        {/* Panel 3: Live Output & Inspector */}
        <section className="lg:col-span-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h2 className="font-semibold text-xs tracking-wider uppercase text-slate-400">
              3. Live Output Inspector
            </h2>
          </div>
          <div className="flex-1 min-h-0">
            <OutputInspector data={formData} errors={validationErrors} schemaText={schemaText} />
          </div>
        </section>
      </main>
    </div>
  );
}