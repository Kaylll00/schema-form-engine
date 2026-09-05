"use client";

import React from "react";
import { JSONSchema } from "@/types/schema";
import { TextInput } from "./controls/TextInput";
import { NumberInput } from "./controls/NumberInput";
import { SelectInput } from "./controls/SelectInput";
import { BooleanInput } from "./controls/BooleanInput";
import { DateInput } from "./controls/DateInput";
import { ColorInput } from "./controls/ColorInput";
import { ArrayControl } from "./controls/ArrayControl";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface RenderSchemaFieldProps {
  schema: JSONSchema;
  fieldPath: string;
  value: any;
  onChange: (path: string, val: any) => void;
  errors?: Record<string, string>;
  isRequired?: boolean;
}

export function RenderSchemaField({
  schema,
  fieldPath,
  value,
  onChange,
  errors = {},
  isRequired = false,
}: RenderSchemaFieldProps) {
  if (!schema) return null;

  const currentError = errors[fieldPath] || errors[`/${fieldPath.replace(/\./g, "/")}`];

  // Case 1: Enum (Dropdown/Select)
  if (schema.enum && schema.enum.length > 0) {
    return (
      <SelectInput
        id={fieldPath}
        schema={schema}
        value={value ?? ""}
        onChange={(val) => onChange(fieldPath, val)}
        error={currentError}
        isRequired={isRequired}
      />
    );
  }

  // Case 2: Object (Recursive Fieldset Branch)
  if (schema.type === "object") {
    const properties = schema.properties || {};
    const requiredList = new Set(schema.required || []);

    return (
      <Card className="bg-slate-950/60 border-slate-800 shadow-sm">
        {(schema.title || schema.description) && (
          <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-800/80">
            {schema.title && (
              <CardTitle className="text-base font-semibold text-slate-200">
                {schema.title}
              </CardTitle>
            )}
            {schema.description && (
              <CardDescription className="text-xs text-slate-400">
                {schema.description}
              </CardDescription>
            )}
          </CardHeader>
        )}
        <CardContent className="p-4 space-y-4">
          {Object.keys(properties).length === 0 ? (
            <p className="text-xs text-slate-500 italic">No properties defined in object.</p>
          ) : (
            Object.entries(properties).map(([key, childSchema]) => {
              const childPath = fieldPath ? `${fieldPath}.${key}` : key;
              const childVal = value?.[key];
              const childRequired = requiredList.has(key);

              return (
                <RenderSchemaField
                  key={childPath}
                  schema={childSchema}
                  fieldPath={childPath}
                  value={childVal}
                  onChange={onChange}
                  errors={errors}
                  isRequired={childRequired}
                />
              );
            })
          )}
        </CardContent>
      </Card>
    );
  }

  // Case 3: Array (Recursive Dynamic List Branch)
  if (schema.type === "array") {
    const itemsArr = Array.isArray(value) ? value : [];
    const itemSchema = schema.items || { type: "string" };

    const handleAddItem = () => {
      const defaultValue = itemSchema.type === "object" ? {} : itemSchema.default ?? "";
      onChange(fieldPath, [...itemsArr, defaultValue]);
    };

    const handleRemoveItem = (index: number) => {
      const next = itemsArr.filter((_, i) => i !== index);
      onChange(fieldPath, next);
    };

    const handleMoveItem = (from: number, to: number) => {
      if (to < 0 || to >= itemsArr.length) return;
      const next = [...itemsArr];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onChange(fieldPath, next);
    };

    return (
      <ArrayControl
        id={fieldPath}
        schema={schema}
        items={itemsArr}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onMoveItem={handleMoveItem}
        error={currentError}
      >
        {(_, index) => {
          const itemPath = `${fieldPath}.${index}`;
          const itemVal = itemsArr[index];

          return (
            <RenderSchemaField
              schema={itemSchema}
              fieldPath={itemPath}
              value={itemVal}
              onChange={onChange}
              errors={errors}
            />
          );
        }}
      </ArrayControl>
    );
  }

  // Case 4: Boolean Toggle
  if (schema.type === "boolean") {
    return (
      <BooleanInput
        id={fieldPath}
        schema={schema}
        value={!!value}
        onChange={(val) => onChange(fieldPath, val)}
        error={currentError}
        isRequired={isRequired}
      />
    );
  }

  // Case 5: Number / Integer
  if (schema.type === "number" || schema.type === "integer") {
    return (
      <NumberInput
        id={fieldPath}
        schema={schema}
        value={value}
        onChange={(val) => onChange(fieldPath, val)}
        error={currentError}
        isRequired={isRequired}
      />
    );
  }

  // Case 6: Date & Date-Time Formats
  if (schema.format === "date" || schema.format === "date-time") {
    return (
      <DateInput
        id={fieldPath}
        schema={schema}
        value={value ?? ""}
        onChange={(val) => onChange(fieldPath, val)}
        error={currentError}
        isRequired={isRequired}
      />
    );
  }

  // Case 7: Color Format
  if (schema.format === "color") {
    return (
      <ColorInput
        id={fieldPath}
        schema={schema}
        value={value ?? "#000000"}
        onChange={(val) => onChange(fieldPath, val)}
        error={currentError}
        isRequired={isRequired}
      />
    );
  }

  // Case 8: Default Primitive String
  return (
    <TextInput
      id={fieldPath}
      schema={schema}
      value={value ?? ""}
      onChange={(val) => onChange(fieldPath, val)}
      error={currentError}
      isRequired={isRequired}
    />
  );
}
