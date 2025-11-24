import { useState, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './src/components/ProtectedRoute';
import { getDefaultRoute } from './src/utils/permissions';
import './src/utils/debugAuth'; // Import debug utility
import { LandingPage } from './src/pages/LandingPage';
import { FoundationRegistrationPage } from './src/pages/FoundationRegistrationPage';
import { RegistrationCompletePage } from './src/pages/RegistrationCompletePage';
import { LimitedDashboardPage } from './src/pages/LimitedDashboardPage';
import { AuthLayout } from './src/layouts/AuthLayout';
import { AppLayout } from './src/layouts/AppLayout';
import { LimitedLayout } from './src/layouts/LimitedLayout';
import { LoginPage } from './src/pages/LoginPage';
import { RegisterPage } from './src/pages/RegisterPage';
import { DashboardPage } from './src/pages/DashboardPage';
import { ManagerDashboardPage } from './src/pages/ManagerDashboardPage';
import { FoundationsPage } from './src/pages/FoundationsPage';
import { AccessDeniedPage } from './src/pages/AccessDeniedPage';
import { FoundationDetailsPage } from './src/pages/FoundationDetailsPage';
import { FoundationForm } from './src/components/FoundationForm';
import { DocumentsPage } from './src/pages/DocumentsPage';
import { MeetingsPage } from './src/pages/MeetingsPage';
import { ExpensesPage } from './src/pages/ExpensesPage';
import { InvestmentsPage } from './src/pages/InvestmentsPage';
import { ProjectsPage } from './src/pages/ProjectsPage';
import { ProjectManagementPage } from './src/pages/ProjectManagementPage';
import { TransactionAccountsPage } from './src/pages/TransactionAccountsPage';
import { SIEExportPage } from './src/pages/SIEExportPage';
import { SIEImportPage } from './src/pages/SIEImportPage';
import { GrantsPage } from './src/pages/GrantsPage';
import { ProfilePage } from './src/pages/ProfilePage';
import { SettingsPage } from './src/pages/SettingsPage';
import { ReportsPage } from './src/pages/ReportsPage';
import { GovernancePage } from './src/pages/GovernancePage';
import { FinancialPage } from './src/pages/FinancialPage';
import { FacilityRegisterPage } from './src/pages/FacilityRegisterPage';
import { AssetFormPage } from './src/pages/AssetFormPage';
import BillingPage from './src/pages/BillingPage';
import OrderPage from './src/pages/OrderPage';
import StockPage from './src/pages/StockPage';
import SalaryPage from './src/pages/SalaryPage';
import QuotesPage from './src/pages/QuotesPage';
import { WorkingHoursSchedulePage } from './src/pages/WorkingHoursSchedulePage';
import { ArticlesPage } from './src/pages/ArticlesPage';
import { SalaryAgreementsPage } from './src/pages/SalaryAgreementsPage';
import AccountPlanPage from './src/pages/AccountPlanPage';
import CustomerPage from './src/pages/CustomerPage';
import WarehousesPage from './src/pages/WarehousesPage';
import SuppliersPage from './src/pages/SuppliersPage';
import WageTypesPage from './src/pages/WageTypesPage';
import PersonnelRegisterPage from './src/pages/PersonnelRegisterPage';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', fontFamily: 'Arial, sans-serif' }}>
          <h1>Something went wrong</h1>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLimitedAccess, setIsLimitedAccess] = useState(false);
  //const [foundationVerified, setFoundationVerified] = useState(false);
  const [userRole, setUserRole] = useState<string>('member');

  const handleLogin = (role?: string) => {
    setIsAuthenticated(true);
    setUserRole(role || 'member');
    
    // All authenticated users get full access based on their role
    //setFoundationVerified(true);
    setIsLimitedAccess(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsLimitedAccess(false);
    //setFoundationVerified(false);
    setUserRole('member');
  };

  const handleFoundationSubmit = (data: any) => {
    console.log('Foundation data:', data);
    // This would normally send data to the backend
  };

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute(userRole)} replace />
            ) : (
              <LandingPage />
            )
          }
        />

        {/* Foundation Registration */}
        <Route
          path="/register-foundation"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <FoundationRegistrationPage />
            )
          }
        />

        <Route
          path="/registration-complete"
          element={<RegistrationCompletePage />}
        />

        {/* Limited Access Routes */}
        <Route
          path="/dashboard-limited"
          element={
            isAuthenticated && isLimitedAccess ? (
              <LimitedLayout onLogout={handleLogout}>
                <LimitedDashboardPage />
              </LimitedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute(userRole)} replace />
            ) : (
              <AuthLayout>
                <LoginPage onLogin={handleLogin} />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute(userRole)} replace />
            ) : (
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="dashboard" userRole={userRole}>
                <AppLayout onLogout={handleLogout}>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="manager-dashboard" userRole={userRole}>
                <AppLayout onLogout={handleLogout}>
                  <ManagerDashboardPage />
                </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/foundations"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="foundations" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <FoundationsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/foundations/new"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="foundations" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <FoundationForm onSubmit={handleFoundationSubmit} />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/foundations/:id"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="foundations" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <FoundationDetailsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/foundations/:id/edit"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="foundations" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <FoundationForm onSubmit={handleFoundationSubmit} />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/governance"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="governance" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <GovernancePage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/financial"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="financial" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                <FinancialPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/billing"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="billing" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                <BillingPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/order"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="order" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                <OrderPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/stock"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="stock" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                <StockPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/salary"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="salary" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                <SalaryPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
                  <Route
                    path="/working-hours-schedule"
                    element={
                      isAuthenticated ? (
                        <ProtectedRoute requiredScreen="salary" userRole={userRole}>
                        <AppLayout onLogout={handleLogout}>
                          <WorkingHoursSchedulePage />
                        </AppLayout>
                        </ProtectedRoute>
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route
                    path="/articles"
                    element={
                      isAuthenticated ? (
                        <ProtectedRoute requiredScreen="inventory" userRole={userRole}>
                        <AppLayout onLogout={handleLogout}>
                          <ArticlesPage />
                        </AppLayout>
                        </ProtectedRoute>
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route
                    path="/salary-agreements"
                    element={
                      isAuthenticated ? (
                        <ProtectedRoute requiredScreen="salary" userRole={userRole}>
                        <AppLayout onLogout={handleLogout}>
                          <SalaryAgreementsPage />
                        </AppLayout>
                        </ProtectedRoute>
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route
                    path="/account-plan"
                    element={
                      isAuthenticated ? (
                        <ProtectedRoute requiredScreen="financial" userRole={userRole}>
                        <AppLayout onLogout={handleLogout}>
                          <AccountPlanPage />
                        </AppLayout>
                        </ProtectedRoute>
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      isAuthenticated ? (
                        <ProtectedRoute requiredScreen="customers" userRole={userRole}>
                        <AppLayout onLogout={handleLogout}>
                          <CustomerPage />
                        </AppLayout>
                        </ProtectedRoute>
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route
                    path="/warehouses"
                    element={
                      isAuthenticated ? (
                        <ProtectedRoute requiredScreen="warehouses" userRole={userRole}>
                        <AppLayout onLogout={handleLogout}>
                          <WarehousesPage />
                        </AppLayout>
                        </ProtectedRoute>
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
        <Route
          path="/suppliers"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="suppliers" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                <SuppliersPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/wage-types"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="wage-types" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                <WageTypesPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/personnel-register"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="personnel-register" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                <PersonnelRegisterPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/quotes"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="quotes" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                <QuotesPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/facility-register"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="facility-register" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                <FacilityRegisterPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/asset-form"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="facility-register" userRole={userRole}>
                <AppLayout onLogout={handleLogout}>
                  <AssetFormPage />
                </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/asset-form/:id"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="facility-register" userRole={userRole}>
                <AppLayout onLogout={handleLogout}>
                  <AssetFormPage />
                </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/documents"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="documents" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <DocumentsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/meetings"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="meetings" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <MeetingsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/expenses"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="expenses" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <ExpensesPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/investments"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="investments" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <InvestmentsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/project-management"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="projects" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <ProjectManagementPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/transaction-accounts"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="financial" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <TransactionAccountsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/sie-export"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="financial" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <SIEExportPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/sie-import"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="financial" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <SIEImportPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/projects"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="projects" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <ProjectsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/grants"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="grants" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <GrantsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="profile" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <ProfilePage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="settings" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <SettingsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/reports"
          element={
            isAuthenticated ? (
              <ProtectedRoute requiredScreen="reports" userRole={userRole}>
              <AppLayout onLogout={handleLogout}>
                  <ReportsPage />
              </AppLayout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        {/* Catch-all route for unauthorized access */}
        <Route
          path="/access-denied"
          element={<AccessDeniedPage />}
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute(userRole)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;