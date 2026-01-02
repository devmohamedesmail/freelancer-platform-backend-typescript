import { prisma } from '../../lib/prisma.js';
import type { Request, Response } from 'express';
import { createRoleSchema, updateRoleSchema } from '../../validations/role/validation.js';


class RoleController {

    /**
     * Get all roles
     * @param req 
     * @param res 
     * @returns {Promise<Response>}
     */
    static index = async (req: Request, res: Response) => {
        try {
            const roles = await prisma.role.findMany({
                orderBy: { createdAt: 'desc' }
            });

            res.status(200).json({
                success: true,
                count: roles.length,
                data: roles
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };


    /**
     * Get role by ID
     * @param req 
     * @param res 
     * @returns  {Promise<Response>}
     */
    static find = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const role = await prisma.role.findUnique({
                where: { id },
                include: {
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            createdAt: true
                        }
                    }
                }
            });

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Role not found'
                });
            }

            res.status(200).json({
                success: true,
                data: role
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * create role
     * @param req 
     * @param res 
     * @returns  {Promise<Response>}
     */
    static create = async (req: Request, res: Response) => {
        try {
            const { error, value } = createRoleSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                return res.status(400).json({
                    success: false,
                    errors: error.details.map(e => e.message)
                });
            }

            const { role } = value;
            const exists = await prisma.role.findUnique({
                where: { role }
            });

            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: 'Role already exists'
                });
            }

            const newRole = await prisma.role.create({
                data: { role }
            });

            res.status(201).json({
                success: true,
                data: newRole
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * update role
     * @param req 
     * @param res 
     * @returns  {Promise<Response>}
     */
    static update = async (req: Request, res: Response) => {
        try {
            const { error } = updateRoleSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(e => e.message)
                });
            }

            const id = Number(req.params.id);
            const { role } = req.body;

            const existingRole = await prisma.role.findUnique({ where: { id } });
            if (!existingRole) {
                return res.status(404).json({
                    success: false,
                    message: 'Role not found'
                });
            }

            if (role) {
                const duplicate = await prisma.role.findFirst({
                    where: {
                        role,
                        NOT: { id }
                    }
                });

                if (duplicate) {
                    return res.status(400).json({
                        success: false,
                        message: 'Role name already exists'
                    });
                }
            }

            const updatedRole = await prisma.role.update({
                where: { id },
                data: { role }
            });

            res.status(200).json({
                success: true,
                data: updatedRole
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Delete role
     * @param req 
     * @param res 
     * @returns  {Promise<Response>}
     */
    static destroy = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const role = await prisma.role.findUnique({ where: { id } });
            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Role not found'
                });
            }

            const userCount = await prisma.user.count({
                where: { role_id: id }
            });

            if (userCount > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot delete role. ${userCount} user(s) assigned to this role`
                });
            }

            await prisma.role.delete({ where: { id } });

            res.status(200).json({
                success: true,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete role',
                error: error.message
            });
        }
    };

    /**
     * Get users by role ID
     * @param req 
     * @param res 
     * @returns  {Promise<Response>}
     */
    static getUsersByRole = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);
            const skip = (page - 1) * limit;

            const role = await prisma.role.findUnique({ where: { id } });
            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Role not found'
                });
            }

            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    where: { role_id: id },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        createdAt: true
                    }
                }),
                prisma.user.count({ where: { role_id: id } })
            ]);

            res.status(200).json({
                success: true,
                message: `Users with role '${role.role}' retrieved successfully`,
                data: {
                    role: role.role,
                    users,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(total / limit),
                        totalUsers: total,
                        usersPerPage: limit
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve users by role',
                error: (error as Error).message
            });
        }
    };

    /**
     * Get role statistics
     * @param req 
     * @param res 
     * @returns  {Promise<Response>}
     */
    static getStatistics = async (req: Request, res: Response) => {
        try {
            const roles = await prisma.role.findMany({
                include: {
                    _count: { select: { users: true } }
                }
            });

            res.status(200).json({
                success: true,
                data: {
                    totalRoles: roles.length,
                    roles: roles.map((r: any) => ({
                        id: r.id,
                        name: r.role,
                        userCount: r._count.users,
                        createdAt: r.createdAt
                    }))
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

}

export default RoleController;
