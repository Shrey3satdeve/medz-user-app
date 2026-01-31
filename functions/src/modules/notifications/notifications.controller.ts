
import * as functions from 'firebase-functions';

// Example trigger
export const sendOrderNotification = functions.firestore
    .document('orders/{orderId}')
    .onUpdate((change, context) => {
        // Send notification on order status change
        const newValue = change.after.data();
        const previousValue = change.before.data();

        if (newValue.status !== previousValue.status) {
            console.log('Order status changed:', context.params.orderId);
            // Send FCM or Email
        }
        return null;
    });
