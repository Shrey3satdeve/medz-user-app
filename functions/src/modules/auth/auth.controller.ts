
import * as functions from 'firebase-functions';

export const onUserCreated = functions.auth.user().onCreate((user) => {
    console.log('User created:', user.email);
    // Initialize profile in Firestore
    return null;
});
