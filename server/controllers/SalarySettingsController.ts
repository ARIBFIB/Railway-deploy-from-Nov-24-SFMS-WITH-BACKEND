import { Response, type RequestHandler } from 'express';
import { JWTRequest } from '../middleware/jwtAuth';
import { asyncHandler, createError } from '../middleware/errorHandler';
import type { SalarySection } from '../models/SalarySettings';
import {
  SalarySettingsModel,
  SALARY_SECTIONS
} from '../models/SalarySettings';

const RESERVED_BODY_KEYS = new Set([
  'foundationId',
  'foundation_id',
  'userId',
  'user_id',
  'roleId',
  'section'
]);

export class SalarySettingsController {
  private static normalizeSection(sectionParam?: string): SalarySection {
    if (!sectionParam) {
      throw createError('Salary section is required', 400);
    }

    const normalized = sectionParam.trim().toLowerCase();

    // Check if it's a valid section
    if ((SALARY_SECTIONS as readonly string[]).includes(normalized)) {
      return normalized as SalarySection;
    }

    throw createError(`Unknown salary section: ${sectionParam}`, 400);
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
      const data = await SalarySettingsModel.getAllSections(foundationId);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('❌ Error fetching salary settings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch salary settings',
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
      const data = await SalarySettingsModel.getSection(
        foundationId,
        section
      );

      res.status(200).json({
        success: true,
        data,
        section
      });
    } catch (error) {
      console.error('❌ Error fetching salary section:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch salary section',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  static upsertSection: RequestHandler = asyncHandler(async (req: JWTRequest, res: Response) => {
    const foundationId = req.user?.foundation_id;
    const userId = req.user?.user_id;
    const section = this.normalizeSection(req.params.section);

    console.log('🚀 SalarySettingsController.upsertSection - Starting', {
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
      const data = await SalarySettingsModel.upsertSection(
        foundationId,
        section,
        payload,
        userId
      );

      console.log('✅ Salary settings saved successfully:', {
        section,
        dataKeys: Object.keys(data)
      });

      res.status(200).json({
        success: true,
        data,
        section,
        message: 'Salary settings saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving salary settings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save salary settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

