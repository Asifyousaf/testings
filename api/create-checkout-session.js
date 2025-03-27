const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors({
    origin: 'https://cybertronicbot.com', 
}));

app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { cartItems } = req.body; // Expect cart items in the request

        // Ensure cartItems is not empty or undefined
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).send({ error: 'No items in cart' });
        }

        // Create a Stripe session and pass cartItems as line_items
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cartItems.map(item => ({
                price_data: {
                    currency: 'aed',
                    product_data: {
                        name: item.name, 
                        images: [item.image], 
                        description: `Size: ${item.size}, Color: ${item.color}`, 
                    },
                    unit_amount: Math.round(item.price * 100), // Stripe expects price in cents
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: 'https://cybertronicbot.com/success?session_id={CHECKOUT_SESSION_ID}', // Success URL
            cancel_url: 'https://cybertronicbot.com/cancel', // Cancel URL
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['AE', 'SA', 'EG'], // Add other country codes as needed
            },
            phone_number_collection: {
                enabled: true,  // Enable phone number collection
            },
            metadata: {
                cartItems: JSON.stringify(cartItems.map(item => ({
                    productId: item.productId,   // Include product ID
                    size: item.size,             // Include size
                    color: item.color,           // Include color
                    quantity: item.quantity      // Include quantity
                })))
            }
        });
        
        console.log('Cart Items on Server:', cartItems);

        // Send back the session ID
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(500).send({ error: error.message });
    }
});
app.get('/api/create-checkout-session', async (req, res) => {
    const sessionId = req.query.session_id;  // Extract session ID from the query string
    console.log('Fetching session for ID:', sessionId); 

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items']  // Expand line items to retrieve detailed product info
        });
        const lineItems = session.line_items;  // Get the detailed line items
        res.json({ session, lineItems });  // Send back session and line item details
    } catch (error) {
        console.error('Error fetching session data:', error); 
        res.status(500).json({ error: 'Failed to fetch session data' });
    }
});


app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('Webhook received:', req.body); // Log incoming request
    let event;

    const signature = req.headers['stripe-signature'];
    const endpointSecret = 'whsec_jpk9R320UxDDfTM28wFdxpAIHkEo3pJ4'; // Replace with your webhook signing secret

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    console.log(`Received event type: ${event.type}`);
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Payment succeeded:', session);
            // Here you could call your stock update function if needed
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// Start the server
app.listen(3000, () => console.log('Server is running on port 3000'));
