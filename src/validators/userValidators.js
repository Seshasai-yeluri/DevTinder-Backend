const { z } = require("zod");

const registerUserSchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  emailId: z.email(),
  password: z.string().min(8),
  age: z.number().min(18),
  gender: z.enum(["male", "female", "other"]),
  photoUrl: z.url(),
  about: z.string().max(500).optional(),
  skills: z
    .array(z.string().trim().min(1))
    .min(1, "At least one skill is required"),
});

const loginUserSchema = z.object({
  emailId: z.email(),
  password: z.string().min(1, "Password is required"),
});

const updateUserSchema = z
  .object({
    firstName: z.string().trim().min(2).max(50).optional(),
    lastName: z.string().trim().min(2).max(50).optional(),
    age: z.number().min(18).optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    photoUrl: z.url().optional(),
    about: z.string().max(500).optional(),
    skills: z
      .array(z.string().trim().min(1))
      .min(1, "At least one skill is required")
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update",
  );

const getAllUsersProfilesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
  getAllUsersProfilesSchema,
};
