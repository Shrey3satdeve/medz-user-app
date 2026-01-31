
import * as functions from 'firebase-functions';
import { db } from '../../config/firebase';
import { isAuthenticated } from '../../shared/middleware/auth';

/**
 * Create a user profile (trigger on auth create) or via callable
 */
export const createProfile = functions.https.onCall(async (data, context) => {
    const uid = isAuthenticated(context);
    // TODO: Validate data

    await db.collection('users').doc(uid).set({
        ...data,
        createdAt: new Date(),
        role: 'user' // Default role
    }, { merge: true });

    return { success: true };
});

export const getProfile = functions.https.onCall(async (data, context) => {
    const uid = isAuthenticated(context);
    const doc = await db.collection('users').doc(uid).get();

    if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'Profile not found');
    }

    return doc.data();
});
