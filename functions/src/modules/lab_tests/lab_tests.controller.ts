
import * as functions from 'firebase-functions';
// import { db } from '../../config/firebase';

export const getTests = functions.https.onCall(async (_data, _context) => {
    // Return list of available lab tests
    return [];
});
