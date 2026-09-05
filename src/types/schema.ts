export interface JSONSchema {
  $schema?: string;
  title?: string;
  description?: string;
  type?: "string" | "number" | "integer" | "boolean" | "object" | "array" | string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  items?: JSONSchema;
  enum?: (string | number | boolean)[];
  format?: "email" | "date" | "date-time" | "color" | "uri" | string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
  minItems?: number;
  maxItems?: number;
  default?: any;
  [key: string]: any;
}

export interface ValidationErrorItem {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: Record<string, any>;
  message?: string;
}
