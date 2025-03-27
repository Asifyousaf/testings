
document.getElementById('hamburger').addEventListener('click', function() {
    const navLeft = document.getElementById('nav-left');
    const navRight = document.getElementById('nav-right');
    navLeft.classList.toggle('active'); // Toggle the left navigation
    navRight.classList.toggle('active'); // Toggle the right navigation
});
const hamMenu = document.querySelector(".ham-menu");
const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

async function getStripeKey() {
    try {
        const response = await fetch('/api/get-stripe-key');
        const data = await response.json();
        return data.stripeKey;
    } catch (error) {
        console.error('Error fetching Stripe key:', error);
        return null; // Fallback in case of failure
    }
}

// Helper function to calculate the total cart price
function calculateTotalCartPrice() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}
async function checkoutWithStripe() {
    try {
        // Log the entire cart for inspection
        console.log('Cart items to send:', cart);

        // Map cart items to a structure that Stripe expects
        const cartItems = cart.map(item => {
            console.log(`Item: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity}`); // Log each item
            return {
                productId: item.productId, // Make sure productId is included
                name: item.name,
                image: item.image,
                price: item.price,
                size: item.size,
                color: item.color,
                quantity: item.quantity
            };
        });

        // Log formatted cart items to see if they are correct
        console.log('Formatted cart items for Stripe:', cartItems);

        // Send cart data to your backend for session creation
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cartItems // Directly send structured cartItems
            })
        });

        // Log the response status and body
        console.log('Response status:', response.status);
        const responseBody = await response.json();
        console.log('Response body:', responseBody);

        if (!response.ok) {
            throw new Error(`Failed to create checkout session: ${responseBody.error || responseBody}`);
        }

        // Get the session object from the response
        const session = responseBody;

        try {
            const stripeKey = await getStripeKey();
            if (!stripeKey) {
                alert('Stripe key could not be loaded.');
                return;
            }
    
            const stripe = Stripe(stripeKey);
            await stripe.redirectToCheckout({ sessionId: session.id });
    
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('An error occurred. Please try again.');
        }

        // Clear the cart after successful checkout (this code will not execute until after the redirect)
        cart = []; // Clear the cart array
        localStorage.setItem('cart', JSON.stringify(cart)); // Update local storage
        updateCart(); // Optionally update the cart display if you are still on the page (or on next visit)

    } catch (error) {
        console.error('Error during checkout:', error);
        alert('An error occurred. Please try again.');
    }
}





document.getElementById('checkout-button').addEventListener('click', function() {
    checkoutWithStripe(); // Trigger the checkout process
});

// Function to open the cart popup
function openCart() {
    document.getElementById('cart-popup').classList.add('show');
}

// Function to close the cart popup
function closeCart() {
    document.getElementById('cart-popup').classList.remove('show');
}



// Ensure PayPal is initialized when the page loads
window.onload = function() {
    updateCart(); // Update cart and initialize PayPal button
   
};


// Function to open the cart
function openCart() {
    const cartPopup = document.getElementById('cart-popup');
    const cartWrapper = document.getElementById('cart-popup-wrapper');

    // Show the cart popup and wrapper
    cartPopup.classList.add('show');
    cartWrapper.classList.add('show');
}

// Function to close the cart with smooth transition
function closeCart() {
    const cartPopup = document.getElementById('cart-popup');
    const cartWrapper = document.getElementById('cart-popup-wrapper');

    // Slide the cart out
    cartPopup.classList.remove('show');

    // After the sliding animation is done, hide the wrapper (with slight delay to match CSS transition)
    setTimeout(() => {
        cartWrapper.classList.remove('show');
    }, 400); // Delay matches the CSS transition duration (0.4s)
}

// Function to close cart when clicking outside the cart area
function closeCartOnClickOutside(event) {
    // If the clicked target is the wrapper (outside the cart), close the cart
    if (event.target === document.getElementById('cart-popup-wrapper')) {
        closeCart();
    }
}

// product js
// Check if the splash screen has been shown before
const handlePurchase = async (productId, quantity) => {
    // Assuming purchase is successful
    try {
        await axios.post('http://your-server-url/update-stock', {
            productId,
            quantity,
        });
        alert('Purchase successful! Stock updated.');
    } catch (error) {
        alert('Error updating stock: ' + error.response.data);
    }
};
