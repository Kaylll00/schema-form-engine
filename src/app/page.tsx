"use client";

import { useState } from "react";
import { PRESETS } from "@/lib/presets";

export default function Home() {
  const [schemaText, setSchemaText] = useState(
    JSON.stringify(PRESETS.userProfile, null, 2)
  );
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  return (
    <main className="h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h1 className="font-bold text-lg">JSON Schema to UI Form Engine</h1>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Panel 1: Monaco Editor */}
        <section className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col">
          <h2 className="font-semibold text-sm mb-2 text-slate-400">1. JSON Schema Input</h2>
          {/* Add <SchemaEditor value={schemaText} onChange={setSchemaText} /> */}
        </section>

        {/* Panel 2: Live Rendered Form */}
        <section className="bg-slate-900 border border-slate-800 rounded-lg p-3 overflow-y-auto">
          <h2 className="font-semibold text-sm mb-2 text-slate-400">2. Generated UI Form</h2>
          {/* Add <DynamicForm schemaText={schemaText} onChange={setFormData} onError={setValidationErrors} /> */}
        </section>

        {/* Panel 3: Live Output Inspector */}
        <section className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col">
          <h2 className="font-semibold text-sm mb-2 text-slate-400">3. Live JSON Output</h2>
          {/* Add <OutputInspector data={formData} errors={validationErrors} /> */}
        </section>
      </div>
    </main>
  );
}