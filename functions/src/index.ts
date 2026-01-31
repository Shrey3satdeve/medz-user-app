
import * as admin from 'firebase-admin';

// Initialize Admin
admin.initializeApp();

// Export Modules
// Grouping functions allows for organized deployment:
// firebase deploy --only functions:users,functions:orders

export * as users from './modules/users/users.controller';
export * as orders from './modules/orders/orders.controller';

// TODO: Export other modules:
// export * as auth from './modules/auth/auth.controller';
// export * as labTests from './modules/lab_tests/lab_tests.controller';
// export * as reports from './modules/reports/reports.controller';
// export * as prescriptions from './modules/prescriptions/prescriptions.controller';
// export * as notifications from './modules/notifications/notifications.controller';
// export * as admin from './modules/admin/admin.controller';
