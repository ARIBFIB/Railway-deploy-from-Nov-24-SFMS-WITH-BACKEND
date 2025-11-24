import { Response, type RequestHandler } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import type { QuoteOrderSection } from '../models/QuoteOrderSettings';
import {
  QuoteOrderSettingsModel,
  QUOTE_ORDER_SECTIONS
} from '../models/QuoteOrderSettings';

const RESERVED_BODY_KEYS = new Set([
  'foundationId',
  'foundation_id',
  'userId',
  'user_id',
  'roleId',
  'section'
]);

export class QuoteOrderSettingsController {
  private static normalizeSection(sectionParam?: string): QuoteOrderSection {
    if (!sectionParam) {
      throw createError('Quote order section is required', 400);
    }

    const normalized = sectionParam.trim().toLowerCase();

    // Check if it's a valid section
    if ((QUOTE_ORDER_SECTIONS as readonly string[]).includes(normalized)) {
      return normalized as QuoteOrderSection;
    }

    throw createError(`Unknown quote order section: ${sectionParam}`, 400);
  }

  private static extractPayload(body: unknown): Record<string, unknown> {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return {};
    }

    const sanitized: Record<string, unknown> = {};

    Object.entries(body).forEach(([key, value]) => {
      if (!RESERVED_BODY_KEYS.has(key)) {
        sanitized[key] = value;
      }
    });

    const candidate = sanitized.data;
    if (
      candidate &&
      typeof candidate === 'object' &&
      !Array.isArray(candidate) &&
      Object.keys(sanitized).length === 1
    ) {
      return candidate as Record<string, unknown>;
    }

    return sanitized;
  }

  static getAllSections: RequestHandler = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const data = await QuoteOrderSettingsModel.getAllSections(foundationId);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('❌ Error fetching quote order settings:', error);
      res
        .status(500)
        .json(
          createError(
            `Failed to fetch quote order settings: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
            500
          )
        );
    }
  });

  static getSection: RequestHandler = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const section = this.normalizeSection(req.params.section);

    if (!foundationId) {
      res.status(400).json(createError('Foundation ID is required'));
      return;
    }

    try {
      const data = await QuoteOrderSettingsModel.getSection(
        foundationId,
        section
      );

      res.status(200).json({
        success: true,
        data,
        section
      });
    } catch (error) {
      console.error('❌ Error fetching quote order section:', error);
      res
        .status(500)
        .json(
          createError(
            `Failed to fetch quote order section: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
            500
          )
        );
    }
  });

  static upsertSection: RequestHandler = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;
    const section = this.normalizeSection(req.params.section);

    if (!foundationId || !userId) {
      res.status(400).json(createError('Foundation ID and User ID are required'));
      return;
    }

    const payload = this.extractPayload(req.body);

    if (Object.keys(payload).length === 0) {
      res.status(400).json(createError('No settings data provided', 400));
      return;
    }

    try {
      const data = await QuoteOrderSettingsModel.upsertSection(
        foundationId,
        section,
        payload,
        userId
      );

      res.status(200).json({
        success: true,
        data,
        section,
        message: 'Quote order settings saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving quote order settings:', error);
      res
        .status(500)
        .json(
          createError(
            `Failed to save quote order settings: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
            500
          )
        );
    }
  });
}

