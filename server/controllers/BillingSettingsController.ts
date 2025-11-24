import { Response, type RequestHandler } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import type { BillingSection } from '../models/BillingSettings';
import {
  BillingSettingsModel,
  BILLING_SECTIONS
} from '../models/BillingSettings';

const RESERVED_BODY_KEYS = new Set([
  'foundationId',
  'foundation_id',
  'userId',
  'user_id',
  'roleId',
  'section'
]);

export class BillingSettingsController {
  private static normalizeSection(sectionParam?: string): BillingSection {
    if (!sectionParam) {
      throw createError('Billing section is required', 400);
    }

    const normalized = sectionParam.trim().toLowerCase();

    // Check if it's a valid section
    if ((BILLING_SECTIONS as readonly string[]).includes(normalized)) {
      return normalized as BillingSection;
    }

    throw createError(`Unknown billing section: ${sectionParam}`, 400);
  }

  private static extractPayload(body: unknown): Record<string, unknown> {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      console.log('⚠️ extractPayload: Invalid body type', { body });
      return {};
    }

    const sanitized: Record<string, unknown> = {};

    Object.entries(body).forEach(([key, value]) => {
      if (!RESERVED_BODY_KEYS.has(key)) {
        sanitized[key] = value;
      }
    });

    console.log('🔍 extractPayload: After filtering reserved keys', {
      originalKeys: Object.keys(body as Record<string, unknown>),
      sanitizedKeys: Object.keys(sanitized),
      sanitized
    });

    // If the body has a 'data' property and it's the only non-reserved key, use it
    const candidate = sanitized.data;
    if (
      candidate &&
      typeof candidate === 'object' &&
      !Array.isArray(candidate) &&
      Object.keys(sanitized).length === 1
    ) {
      console.log('✅ extractPayload: Using nested data property');
      return candidate as Record<string, unknown>;
    }

    // Otherwise, return all non-reserved keys directly
    console.log('✅ extractPayload: Using sanitized payload directly');
    return sanitized;
  }

  static getAllSections: RequestHandler = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;

    if (!foundationId) {
      res.status(400).json({
        success: false,
        error: 'Foundation ID is required',
        message: 'Foundation ID is required'
      });
      return;
    }

    try {
      const data = await BillingSettingsModel.getAllSections(foundationId);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('❌ Error fetching billing settings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch billing settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  static getSection: RequestHandler = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const section = this.normalizeSection(req.params.section);

    if (!foundationId) {
      res.status(400).json({
        success: false,
        error: 'Foundation ID is required',
        message: 'Foundation ID is required'
      });
      return;
    }

    try {
      const data = await BillingSettingsModel.getSection(
        foundationId,
        section
      );

      res.status(200).json({
        success: true,
        data,
        section
      });
    } catch (error) {
      console.error('❌ Error fetching billing section:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch billing section',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  static upsertSection: RequestHandler = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;
    const section = this.normalizeSection(req.params.section);

    console.log('🚀 BillingSettingsController.upsertSection - Starting', {
      foundationId,
      userId,
      section,
      bodyKeys: Object.keys(req.body || {})
    });

    if (!foundationId || !userId) {
      res.status(400).json({
        success: false,
        error: 'Foundation ID and User ID are required',
        message: 'Foundation ID and User ID are required'
      });
      return;
    }

    const payload = this.extractPayload(req.body);
    console.log('📦 Extracted payload:', {
      payloadKeys: Object.keys(payload),
      payload
    });

    if (Object.keys(payload).length === 0) {
      console.error('❌ No payload extracted from body:', req.body);
      res.status(400).json({
        success: false,
        error: 'No settings data provided',
        message: 'No settings data provided'
      });
      return;
    }

    try {
      const data = await BillingSettingsModel.upsertSection(
        foundationId,
        section,
        payload,
        userId
      );

      console.log('✅ Billing settings saved successfully:', {
        section,
        dataKeys: Object.keys(data)
      });

      res.status(200).json({
        success: true,
        data,
        section,
        message: 'Billing settings saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving billing settings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save billing settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

