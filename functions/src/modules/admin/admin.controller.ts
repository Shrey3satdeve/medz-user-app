
import * as functions from 'firebase-functions';
import { isAdmin } from '../../shared/middleware/auth';


export const setRole = functions.https.onCall(async (_data, context) => {
    isAdmin(context);
    // data: { uid: string, role: string }
    // Implement role setting logic
});
