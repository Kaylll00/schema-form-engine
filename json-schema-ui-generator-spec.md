# System Architecture & Technical Specification: Dynamic JSON Schema-to-UI Form Engine

## 1. Project Executive Summary

The **Dynamic JSON Schema-to-UI Form Engine** is a developer productivity utility designed to eliminate the manual labor of hand-coding web forms. By parsing standard [JSON Schema](https://json-schema.org/) definitions (Draft-07 / Draft 2020-12), the engine dynamically renders fully reactive, accessible, styled web forms complete with real-time validation, dynamic list/nested object handling, and multi-format data export capabilities.

The tool targets frontend developers, backend engineers designing admin panels, API architects testing request payloads, and product managers prototyping data collection flows.

---

## 2. Core Architectural Overview

```
+---------------------------------------------------------------------------------------+
|                                  USER INTERFACE                                       |
+-----------------------------------+---------------------------------------------------+
|  PANEL 1: JSON SCHEMA EDITOR      |  PANEL 2: DYNAMIC LIVE FORM RENDERER              |
|  - Monaco Code Editor             |  - Recursive Form Node Tree                       |
|  - Real-time Syntax Linting       |  - Reactive Input Components                      |
|  - Preset Selector Dropdown       |  - Real-time Field Level Validation Feedback      |
|  - Format / Minify Buttons        |  - Dynamic Array Add/Remove Controls              |
+-----------------------------------+---------------------------------------------------+
|                                   PANEL 3: OUTPUT & INSPECTOR                         |
|  - Live JSON State Output Viewer  | - Validation Error Logs (Ajv)                     |
|  - Copy Payload to Clipboard      | - Download Responses (.json)                      |
|  - Copy Exported Component Code   | - Export Raw HTML / JSX Code                      |
+---------------------------------------------------------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------------+
|                                 ENGINE LOGIC LAYER                                    |
+---------------------------------------------------------------------------------------+
|  1. Schema Parser & AST Builder  -->  2. Ajv Validation & Error Resolver Engine       |
|  3. Recursive React Field Mapper  -->  4. Form State & Array Mutator (React Hook Form) |
+---------------------------------------------------------------------------------------+
```

---

## 3. Comprehensive Feature Requirements

### 3.1. Schema Parsing & Dynamic Component Mapping
The system must parse schema primitives and recursively construct standard HTML5/Tailwind UI elements:

| JSON Schema Specification | Rendered UI Control Element | Interactive Behavior |
| :--- | :--- | :--- |
| `type: "string"` | `<input type="text">` | Standard text input field |
| `type: "string"` + `format: "email"` | `<input type="email">` | Built-in email RFC validation |
| `type: "string"` + `format: "date"` | `<input type="date">` | Native or custom date picker popup |
| `type: "string"` + `format: "color"` | Color Picker Swatch | Color input selector |
| `type: "string"` + `enum: [...]` | `<select>` or Radio Group | Dropdown or single-choice selection |
| `type: "number"` / `"integer"` | `<input type="number">` | Step control, min/max range constraints |
| `type: "boolean"` | Toggle Switch / Checkbox | Binary on/off state toggle |
| `type: "array"` | Dynamic List Container | Displays child list with "+ Add Item" and "Remove" controls |
| `type: "object"` | Card / Collapsible Accordion | Indented fieldset group with header title and description |

### 3.2. Real-Time Validation & Constraint Engine
1. **Schema Syntax Validation:** Validates that the input text in Panel 1 is well-formed JSON and conforms to standard JSON Schema specifications before attempting rendering.
2. **Field-Level Data Constraints:**
   * **Strings:** Enforces `minLength`, `maxLength`, `pattern` (Regex validation).
   * **Numbers:** Enforces `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum`, and `multipleOf`.
   * **Required Fields:** Highlights missing mandatory fields defined in the schema's `required: [...]` array.
3. **Live Error Reporting:** Inline visual alerts appear directly underneath non-compliant input controls with precise error messages (e.g., *"Must be at least 8 characters long"* or *"Value must be a multiple of 5"*).

### 3.3. Advanced Data & Nested Object Handling
* **Recursive Nesting:** Supports deeply nested object structures (`object` inside `object`) with automatic indentation, nested fieldset cards, or accordion collapse toggles.
* **Dynamic Array Operations:**
  * Allows users to dynamically append new items to array properties (`type: "array"`).
  * Supports re-ordering array items via drag-and-drop handles or "Move Up / Move Down" buttons.
  * Enforces `minItems` and `maxItems` array bounds by automatically disabling/enabling action buttons.

### 3.4. Developer Utility Suite
* **Pre-Loaded Preset Templates:** Includes a dropdown selector with rich preset schemas:
  * *User Registration Profile*
  * *E-Commerce Product Configuration*
  * *SaaS Application Settings*
  * *Complex Multi-level Survey Form*
* **Export & Code Generation Capabilities:**
  * **Export Data Payload:** Download filled form values as a formatted `.json` file or copy directly to the clipboard.
  * **Export Component Code:** Generate and display standalone, clean React/Tailwind JSX code representing the generated form structure for direct copy-pasting into client codebases.
* **Schema Utilities:** Includes "Prettify JSON", "Minify JSON", and "Clear Form" action buttons in the workspace header.

---

## 4. Key Recursive Rendering Logic (Pseudo-code)

The fundamental mechanism driving the UI generation relies on a recursive field renderer node:

```typescript
function RenderSchemaField({ schema, fieldPath, control, errors }) {
  // Case 1: Object (Recursive Branch)
  if (schema.type === "object") {
    return (
      <FieldsetCard title={schema.title} description={schema.description}>
        {Object.entries(schema.properties || {}).map(([key, childSchema]) => (
          <RenderSchemaField
            key={`${fieldPath}.${key}`}
            schema={childSchema}
            fieldPath={`${fieldPath}.${key}`}
            control={control}
            errors={errors}
          />
        ))}
      </FieldsetCard>
    );
  }

  // Case 2: Array (Recursive Branch with List Controls)
  if (schema.type === "array") {
    return (
      <DynamicArrayList
        schema={schema}
        fieldPath={fieldPath}
        renderItem={(itemPath, index) => (
          <RenderSchemaField
            schema={schema.items}
            fieldPath={`${fieldPath}[${index}]`}
            control={control}
            errors={errors}
          />
        )}
      />
    );
  }

  // Case 3: Primitive Controls (Leaf Nodes)
  return (
    <PrimitiveInputMapper
      schema={schema}
      fieldPath={fieldPath}
      control={control}
      error={get(errors, fieldPath)}
    />
  );
}
```

---

## 5. Non-Functional & UX Requirements

* **Performance:** Real-time form state updates must render under **16ms** (60 FPS feel) with zero input lag during user typing.
* **Accessibility (a11y):** All rendered form inputs must contain correct `aria-describedby`, `aria-invalid`, `id`, and label bindings (`<label htmlFor="...">`).
* **Dark / Light Mode Support:** Modern UI theme toggle to support high-contrast dark mode for long coding sessions.
* **Responsive Layout:** Multi-pane layout that smoothly stacks vertically on smaller viewports and renders side-by-side on desktop displays.