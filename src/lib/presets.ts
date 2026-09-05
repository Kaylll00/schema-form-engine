export const PRESETS = {
  userProfile: {
    title: "User Profile Settings",
    type: "object",
    required: ["username", "email", "role"],
    properties: {
      username: { type: "string", minLength: 3, title: "Username" },
      email: { type: "string", format: "email", title: "Email Address" },
      age: { type: "integer", minimum: 18, maximum: 120, title: "Age" },
      role: {
        type: "string",
        enum: ["admin", "editor", "viewer"],
        title: "Account Role",
      },
      notifications: { type: "boolean", title: "Enable Email Alerts" },
    },
  },
};