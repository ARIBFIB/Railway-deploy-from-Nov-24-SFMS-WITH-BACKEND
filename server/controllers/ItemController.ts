import { Response, NextFunction } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { ItemModel, CreateItemData, UpdateItemData } from '../models/Item';
import { createError, asyncHandler } from '../middleware/errorHandler';

export class ItemController {
    // Create a new item
    static createItem = asyncHandler(async (req: JWTRequest, res: Response, next: NextFunction) => {
        console.log('🚀 ItemController.createItem - Starting');

        const foundationId = req.user?.foundation_id;
        const userId = req.user?.user_id;

        if (!foundationId || !userId) {
            res.status(400).json(createError('Foundation ID and User ID are required'));
            return;
        }

        const itemData: CreateItemData = req.body;

        // Basic validation
        if (!itemData.item_number || !itemData.name) {
            res.status(400).json(createError('Item number and name are required'));
            return;
        }

        try {
            const item = await ItemModel.create(foundationId, itemData, String(userId));

            res.status(201).json({
                success: true,
                data: item,
                message: 'Item created successfully'
            });
        } catch (error) {
            next(error);
        }
    });

    // Get all items for a foundation
    static getItems = asyncHandler(async (req: JWTRequest, res: Response, next: NextFunction) => {
        const foundationId = req.user?.foundation_id;

        if (!foundationId) {
            res.status(400).json(createError('Foundation ID is required'));
            return;
        }

        try {
            const searchParam = req.query.search as string;
            const limitParam = req.query.limit ? Number(req.query.limit) : undefined;
            const offsetParam = req.query.offset ? Number(req.query.offset) : undefined;

            const result = await ItemModel.getByFoundation(foundationId, {
                search: searchParam,
                limit: limitParam,
                offset: offsetParam
            });

            res.status(200).json({
                success: true,
                total: result.total,
                data: result.items
            });
        } catch (error) {
            next(error);
        }
    });

    // Get a specific item by ID
    static getItemById = asyncHandler(async (req: JWTRequest, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const foundationId = req.user?.foundation_id;

        try {
            const item = await ItemModel.getById(id!);

            if (item.foundation_id !== foundationId) {
                res.status(403).json(createError('Access denied'));
                return;
            }

            res.status(200).json({
                success: true,
                data: item
            });
        } catch (error) {
            next(createError('Item not found', 404));
        }
    });

    // Update an item
    static updateItem = asyncHandler(async (req: JWTRequest, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const foundationId = req.user?.foundation_id;
        const userId = req.user?.user_id;

        if (!foundationId || !userId) {
            res.status(400).json(createError('Foundation ID and User ID are required'));
            return;
        }

        try {
            const item = await ItemModel.getById(id!);

            if (item.foundation_id !== foundationId) {
                res.status(403).json(createError('Access denied'));
                return;
            }

            const updateData: UpdateItemData = { id: id!, ...req.body };
            const updatedItem = await ItemModel.update(id!, updateData, String(userId));

            res.status(200).json({
                success: true,
                data: updatedItem,
                message: 'Item updated successfully'
            });
        } catch (error) {
            next(error);
        }
    });

    // Delete an item
    static deleteItem = asyncHandler(async (req: JWTRequest, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const foundationId = req.user?.foundation_id;

        try {
            const item = await ItemModel.getById(id!);

            if (item.foundation_id !== foundationId) {
                res.status(403).json(createError('Access denied'));
                return;
            }

            await ItemModel.delete(id!);

            res.status(200).json({
                success: true,
                message: 'Item deleted successfully'
            });
        } catch (error) {
            next(createError('Item not found', 404));
        }
    });
}
