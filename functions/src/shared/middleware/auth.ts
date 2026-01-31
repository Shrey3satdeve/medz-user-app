
import * as functions from 'firebase-functions';
import { CallableContext } from 'firebase-functions/v1/https';

/**
 * Checks if the request is authenticated.
 * Returns the uid if authenticated, otherwise throws an error.
 */
export const isAuthenticated = (context: CallableContext): string => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.'
        );
    }
    return context.auth.uid;
};

export const isAdmin = (context: CallableContext): void => {
    isAuthenticated(context);
    const token = context.auth?.token;

    if (token?.role !== 'admin') {
        throw new functions.https.HttpsError(
            'permission-denied',
            'The function must be called by an admin.'
        );
    }
};
