import { Request, Response, NextFunction } from "express";
import { GetUsersUseCase } from "../../../application/use-cases/user/get-users.use-case";
import { UpdateUserRoleUseCase } from "../../../application/use-cases/user/update-user-role.use-case";
import { DeleteUserUseCase } from "../../../application/use-cases/user/delete-user.use-case";
import {
  userQuerySchema,
  updateUserRoleSchema,
} from "../../../application/dtos/user.dto";

export class UserController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = userQuerySchema.parse(req.query);
      const result = await this.getUsersUseCase.execute(query);
      res.json({
        success: true,
        data: result.data,
        meta: {
          page: query.page,
          limit: query.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / query.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const validated = updateUserRoleSchema.parse(req.body);
      const user = await this.updateUserRoleUseCase.execute(
        id,
        validated.role,
        req.user!.id,
        req.user!.role,
      );
      res.json({ success: true, data: user, message: "Role updated" });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUserUseCase.execute(id, req.user!.id);
      res.json({ success: true, message: "User deleted" });
    } catch (error) {
      next(error);
    }
  }
}
