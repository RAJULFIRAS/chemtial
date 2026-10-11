import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["manager", "admin", "courier", "user"]),
});

export const userQuerySchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("20"),
  search: z.string().optional(),
  role: z.enum(["manager", "admin", "user"]).optional(),
});

export type UpdateUserRoleDTO = z.infer<typeof updateUserRoleSchema>;
export type UserQueryDTO = z.infer<typeof userQuerySchema>;
