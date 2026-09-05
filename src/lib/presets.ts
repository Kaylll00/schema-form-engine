import { JSONSchema } from "@/types/schema";

export const PRESETS: Record<string, { name: string; schema: JSONSchema }> = {
  userProfile: {
    name: "User Registration Profile",
    schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "User Registration Profile",
      description: "Standard developer account registration & details form.",
      type: "object",
      required: ["fullName", "email", "role"],
      properties: {
        fullName: {
          type: "string",
          title: "Full Name",
          minLength: 3,
          maxLength: 50,
          description: "Enter your legal first and last name.",
        },
        email: {
          type: "string",
          format: "email",
          title: "Email Address",
          description: "We will never share your email.",
        },
        age: {
          type: "integer",
          title: "Age",
          minimum: 18,
          maximum: 120,
        },
        role: {
          type: "string",
          title: "Account Role",
          enum: ["Developer", "Designer", "Product Manager", "DevOps"],
          default: "Developer",
        },
        bio: {
          type: "string",
          title: "Short Bio",
          maxLength: 200,
        },
        newsletter: {
          type: "boolean",
          title: "Subscribe to Developer Newsletter",
          default: true,
        },
      },
    },
  },
  ecommerceProduct: {
    name: "E-Commerce Product Configuration",
    schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Product Inventory Entry",
      description: "Configure product catalog item with pricing and inventory options.",
      type: "object",
      required: ["sku", "productName", "price", "category"],
      properties: {
        sku: {
          type: "string",
          title: "SKU Identifier",
          pattern: "^[A-Z]{3}-[0-9]{4}$",
          description: "Format: ABC-1234",
        },
        productName: {
          type: "string",
          title: "Product Name",
          minLength: 2,
        },
        price: {
          type: "number",
          title: "Price ($)",
          minimum: 0.01,
          multipleOf: 0.01,
        },
        inStock: {
          type: "boolean",
          title: "In Stock Availability",
          default: true,
        },
        category: {
          type: "string",
          title: "Product Category",
          enum: ["Electronics", "Apparel", "Home & Kitchen", "Books", "Software"],
        },
        releaseDate: {
          type: "string",
          format: "date",
          title: "Release Date",
        },
        themeColor: {
          type: "string",
          format: "color",
          title: "Accent Brand Color",
          default: "#3b82f6",
        },
        tags: {
          type: "array",
          title: "Search Tags",
          minItems: 1,
          maxItems: 5,
          items: {
            type: "string",
            title: "Tag Name",
          },
        },
      },
    },
  },
  saasSettings: {
    name: "SaaS Application Settings",
    schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Organization Workspace Settings",
      description: "Configure cloud environment limits and security policies.",
      type: "object",
      required: ["organizationName", "environment"],
      properties: {
        organizationName: {
          type: "string",
          title: "Organization Name",
          minLength: 2,
        },
        environment: {
          type: "string",
          title: "Deployment Target",
          enum: ["Development", "Staging", "Production"],
          default: "Development",
        },
        maxConcurrency: {
          type: "integer",
          title: "Max Concurrency Workers",
          minimum: 1,
          maximum: 64,
          default: 4,
        },
        securityPolicy: {
          type: "object",
          title: "Security & Compliance Rules",
          description: "Nested security policy rules.",
          properties: {
            require2FA: {
              type: "boolean",
              title: "Require Two-Factor Authentication",
              default: true,
            },
            ipWhitelisting: {
              type: "boolean",
              title: "Enable Strict IP Whitelisting",
              default: false,
            },
            sessionTimeoutMinutes: {
              type: "integer",
              title: "Session Timeout (Minutes)",
              minimum: 5,
              maximum: 1440,
              default: 60,
            },
          },
        },
      },
    },
  },
  multiLevelSurvey: {
    name: "Complex Multi-level Survey Form",
    schema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "Developer Satisfaction Survey",
      description: "Multi-layered survey with nested objects and dynamic arrays.",
      type: "object",
      required: ["respondentName", "satisfactionRating"],
      properties: {
        respondentName: {
          type: "string",
          title: "Respondent Name",
          minLength: 2,
        },
        satisfactionRating: {
          type: "integer",
          title: "Overall Satisfaction (1-10)",
          minimum: 1,
          maximum: 10,
        },
        primaryTechStack: {
          type: "string",
          title: "Primary Framework",
          enum: ["Next.js", "React", "Vue", "Svelte", "Angular", "Other"],
        },
        favoriteTools: {
          type: "array",
          title: "Favorite Tools & Libraries",
          minItems: 1,
          items: {
            type: "object",
            title: "Tool Entry",
            required: ["toolName", "experienceYears"],
            properties: {
              toolName: {
                type: "string",
                title: "Tool/Library Name",
              },
              experienceYears: {
                type: "number",
                title: "Years of Experience",
                minimum: 0.5,
              },
              recommendToOthers: {
                type: "boolean",
                title: "Would Recommend to Team",
                default: true,
              },
            },
          },
        },
      },
    },
  },
};