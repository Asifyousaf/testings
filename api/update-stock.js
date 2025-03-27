const http = require('http');
const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const supabaseUrl = process.env.DATABASE_URL; 
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Your webhook signing secret

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/update-stock') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', async () => {
            const signature = req.headers['stripe-signature'];

            let event;
            try {
                event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
            } catch (err) {
                console.error('Webhook signature verification failed:', err.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `Webhook Error: ${err.message}` }));
                return;
            }

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const cartItems = session.metadata.cartItems ? JSON.parse(session.metadata.cartItems) : [];

                try {
                    await updateStockInSupabase(cartItems);
                    console.log('Stock and order updated successfully.');
                } catch (err) {
                    console.error('Error processing order:', err.message);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error processing order' }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ received: true }));
            } else {
                console.log('Unhandled event type:', event.type);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Unhandled event type' }));
            }
        });
    } else if (req.method === 'POST' && req.url === '/api/subscribe-email') { // New route for email subscription
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', async () => {
            const { email } = JSON.parse(body);

            try {
                await addEmailToSupabase(email);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error('Error saving email:', err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error saving email' }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Method ${req.method} Not Allowed` }));
    }
});

// Function to insert the email into the Supabase database
async function addEmailToSupabase(email) {
    const { data, error } = await supabase
      .from('email_subscribers') // Your table name
      .insert([{ email }]); // Insert the email
    
    if (error) {
        throw error; // Handle errors
    }
    return data;
}

// Function to update stock in Supabase
async function updateStockInSupabase(cartItems) {
    try {
        for (const item of cartItems) {
            const { productId, size, color, quantity } = item;
            console.log(`Updating stock for Product ID: ${productId}, Size: ${size}, Color: ${color}, Quantity: ${quantity}`);

            const { data: product, error } = await supabase
                .from('products')
                .select('stock')
                .eq('id', productId)
                .single();

            if (error) throw new Error('Error fetching product stock');

            if (!product.stock[size] || !product.stock[size][color]) {
                throw new Error(`Stock not found for Size: ${size}, Color: ${color}`);
            }

            const updatedStock = product.stock[size][color] - quantity;
            if (updatedStock < 0) {
                throw new Error('Insufficient stock');
            }

            product.stock[size][color] = updatedStock;

            const { error: updateError } = await supabase
                .from('products')
                .update({ stock: product.stock })
                .eq('id', productId);

            if (updateError) throw new Error('Error updating stock in Supabase');

            console.log(`Stock updated for Product ID: ${productId}, Size: ${size}, Color: ${color}`);
        }
        console.log('Stock successfully updated for all items.');
    } catch (error) {
        console.error('Error updating stock:', error.message);
    }
}

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});