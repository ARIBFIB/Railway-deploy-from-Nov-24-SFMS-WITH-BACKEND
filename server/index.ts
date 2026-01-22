import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from server directory
dotenv.config({ path: path.join(__dirname, '.env') });
import { setupSwagger } from './config/swagger';
import { corsOptions, corsErrorHandler } from './config/cors';
import { requestLogging, errorLogging, performanceMonitoring } from './middleware/logging';
import { securityHeaders, sanitizeInput } from './middleware/security';
import { compressionMiddleware, compressionHeaders } from './middleware/compression';
import { generalLimiter, authLimiter } from './middleware/rateLimiter';
import Environment from './config/environment';
import bankidRoutes from './routes/bankid';
import { testConnection } from './config/database';

// Import routes
import authRoutes from './routes/auth';
import foundationRoutes from './routes/foundations';
import documentRoutes from './routes/documents';
import meetingRoutes from './routes/meetings';
import expenseRoutes from './routes/expenses';
import investmentRoutes from './routes/investments';
import projectRoutes from './routes/projects';
import grantRoutes from './routes/grants';
import profileRoutes from './routes/profiles';
import financialRoutes from './routes/financial';
import governanceRoutes from './routes/governance';
import workflowRoutes from './routes/workflows';
import reportRoutes from './routes/reports';
import accountRoutes from './routes/accountRoutes';
import verificationRoutes from './routes/verificationRoutes';
import customerRoutes from './routes/customers';
import productRoutes from './routes/products';
import quoteRoutes from './routes/quotes';
import orderRoutes from './routes/orders';
import supplierRoutes from './routes/suppliers';
import invoiceRoutes from './routes/invoices';
import articlesRoutes from './routes/articles';
import assetsRoutes from './routes/assets';
import billingRoutes from './routes/billing';
import transactionAccountsRoutes from './routes/transactionAccounts';
import wageTypesRoutes from './routes/wageTypes';
import personnelRoutes from './routes/personnel';
import salaryAgreementsRoutes from './routes/salaryAgreements';
import workingHoursSchedulesRoutes from './routes/workingHoursSchedules';
import accountPlanRoutes from './routes/accountPlan';
import stockRoutes from './routes/stock';
import sieRoutes from './routes/sie';
import facilityRegisterSettingsRoutes from './routes/facilityRegisterSettings';
import assetRegisterTypesRoutes from './routes/assetRegisterTypes';
import automaticAccountingRoutes from './routes/automaticAccounting';
import trustedSendersStorageRoutes from './routes/trustedSendersStorage';
import accountingTemplatesRoutes from './routes/accountingTemplates';
import accountingCertificateGeneralRoutes from './routes/accountingCertificateGeneral';
import accountingCertificateNoticesRoutes from './routes/accountingCertificateNotices';
import defaultAccountsRoutes from './routes/defaultAccounts';
import accountingViewRoutes from './routes/accountingView';
import costCentersRoutes from './routes/costCenters';
import quantityAccountingRoutes from './routes/quantityAccounting';
import vatSettingsRoutes from './routes/vatSettings';
import accrualsRoutes from './routes/accruals';
import projectSettingsRoutes from './routes/projectSettings';
import reportsSettingsRoutes from './routes/reportsSettings';
import financialYearRoutes from './routes/financialYear';
import lockingPeriodRoutes from './routes/lockingPeriod';
import quickTextsRoutes from './routes/quickTexts';
import registrationTemplatesRoutes from './routes/registrationTemplates';
import verificationSeriesSettingsRoutes from './routes/verificationSeriesSettings';
import reconcileAccountSettingsRoutes from './routes/reconcileAccountSettings';
import reconciliationRoutes from './routes/reconciliation';
import supplierSettingsRoutes from './routes/supplierSettings';
import accountingSettingsRoutes from './routes/accountingSettings';
import quoteOrderSettingsRoutes from './routes/quoteOrderSettings';
import billingSettingsRoutes from './routes/billingSettings';
import salarySettingsRoutes from './routes/salarySettings';
import supplierInvoiceRoutes from './routes/supplierInvoices';
import payrollRoutes from './routes/payroll';
import itemRoutes from './routes/itemRoutes';
import paymentRoutes from './routes/payments';
import staffRoutes from './routes/staff';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Load environment configuration
const env = Environment.load();

const app = express();
const PORT = env.port;

// Test database connection
testConnection();

// Serve static files from the React app FIRST
// This must be before CORS, security headers, and rate limiting
// to ensure static assets are served correctly
app.use(express.static(path.join(__dirname, '../../dist')));

// Security and performance middleware
app.use(securityHeaders);
app.use(compressionHeaders);
app.use(compressionMiddleware);
app.use(sanitizeInput);

// CORS configuration
app.use(cors(corsOptions));
app.use(corsErrorHandler);

// Rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Body parsing middleware - exclude file upload routes
app.use((req, res, next) => {
  // Skip JSON parsing for file upload routes
  if (req.path.includes('/upload-image') || req.path.includes('/upload')) {
    return next();
  }
  express.json({ limit: '10mb' })(req, res, next);
});

app.use((req, res, next) => {
  // Skip URL encoding for file upload routes
  if (req.path.includes('/upload-image') || req.path.includes('/upload')) {
    return next();
  }
  express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
});

// Logging and monitoring middleware
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(requestLogging);
app.use(performanceMonitoring);

// API Documentation
if (env.nodeEnv === 'development') {
  setupSwagger(app);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/foundations', foundationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/grants', grantRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/supplier-invoices', supplierInvoiceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/transaction-accounts', transactionAccountsRoutes);
app.use('/api/wage-types', wageTypesRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/salary-agreements', salaryAgreementsRoutes);
app.use('/api/working-hours-schedules', workingHoursSchedulesRoutes);
app.use('/api/account-plan', accountPlanRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/sie', sieRoutes);
app.use('/api/bankid', bankidRoutes);
app.use('/api/settings/facility-register', facilityRegisterSettingsRoutes);
app.use('/api/settings/asset-register-types', assetRegisterTypesRoutes);
app.use('/api/settings/automatic-accounting', automaticAccountingRoutes);
app.use('/api/settings/trusted-senders-storage', trustedSendersStorageRoutes);
app.use('/api/settings/supplier', supplierSettingsRoutes);
app.use('/api/settings/accounting', accountingSettingsRoutes);
app.use('/api/settings/quote-order', quoteOrderSettingsRoutes);
app.use('/api/settings', billingSettingsRoutes);
app.use('/api/settings', salarySettingsRoutes);
app.use('/api/settings/accounting-templates', accountingTemplatesRoutes);
app.use('/api/settings/accounting-certificate-general', accountingCertificateGeneralRoutes);
app.use('/api/settings/accounting-certificate-notices', accountingCertificateNoticesRoutes);
app.use('/api/settings/default-accounts', defaultAccountsRoutes);
app.use('/api/settings/accounting-view', accountingViewRoutes);
app.use('/api/settings/cost-centers', costCentersRoutes);
app.use('/api/settings/quantity-accounting', quantityAccountingRoutes);
app.use('/api/settings/vat', vatSettingsRoutes);
app.use('/api/settings/accruals', accrualsRoutes);
app.use('/api/settings/project', projectSettingsRoutes);
app.use('/api/settings/reports', reportsSettingsRoutes);
app.use('/api/settings/financial-year', financialYearRoutes);
app.use('/api/settings/locking-period', lockingPeriodRoutes);
app.use('/api/settings/quick-texts', quickTextsRoutes);
app.use('/api/settings/registration-templates', registrationTemplatesRoutes);
app.use('/api/settings/verification-series', verificationSeriesSettingsRoutes);
app.use('/api/settings/reconcile-account', reconcileAccountSettingsRoutes);
app.use('/api/reconciliation', reconciliationRoutes);
app.use('/api/staff', staffRoutes);

// Error handling middleware (must be last)
app.use(errorLogging);
app.use(errorHandler);

// API 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found on this server.'
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${env.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  if (env.nodeEnv === 'development') {
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  }
});

export default app;