import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";

export const ajv = new Ajv({
  allErrors: true,
  strict: false,
  useDefaults: true,
});

addFormats(ajv);

export function validateSchemaSyntax(schemaObj: any): { valid: boolean; error?: string } {
  if (!schemaObj || typeof schemaObj !== "object") {
    return { valid: false, error: "Schema must be a valid JSON object" };
  }
  try {
    const isValid = ajv.validateSchema(schemaObj);
    if (!isValid && ajv.errors) {
      return {
        valid: false,
        error: ajv.errorsText(ajv.errors),
      };
    }
    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: err?.message || "Invalid schema structure" };
  }
}

export function validateFormData(
  schemaObj: any,
  data: any
): { valid: boolean; errors: ErrorObject[] } {
  if (!schemaObj || typeof schemaObj !== "object") {
    return { valid: false, errors: [] };
  }
  try {
    const validate = ajv.compile(schemaObj);
    const valid = validate(data);
    return {
      valid: !!valid,
      errors: validate.errors || [],
    };
  } catch {
    return { valid: false, errors: [] };
  }
}