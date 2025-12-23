import React from 'react';
import { AccountAnalysisReport } from '../components/financial/AccountAnalysisReport';
import { AppLayout } from '../layouts/AppLayout';

export const AccountAnalysisPage: React.FC = () => {
    const handleLogout = () => {
        // This will be handled by the layout's internal logic or props if needed
    };

    return (
        <AppLayout onLogout={handleLogout}>
            <AccountAnalysisReport />
        </AppLayout>
    );
};
