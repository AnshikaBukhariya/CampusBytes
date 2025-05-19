// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navbar & Mobile Menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // Toast notification function
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Show the toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Menu Items Data
    const menuItems = [
        {
            id: 1,
            name: 'Masala Dosa',
            description: 'Crispy rice crepe filled with spiced potato filling, served with coconut chutney and sambar.',
            price: 60,
            image: "images/C.jpg", // fixed
            vegetarian: true,
            spicyLevel: 2,
            featured: true,
            rating: 4.8,
        },
        {
            id: 2,
            name: 'masala paneer',
            description: 'A tasty, healthy full meal in a plate.',
            price: 45,
            image: "images/a.jpg", // fixed
            vegetarian: true,
            spicyLevel: 3,
            featured: false,
            rating: 4.5
        },
        {
            id: 3,
            name: 'Sev Tamatar',
            description: 'Spicy Sev prepared in creamy tomato-based sauce with butter and spices.',
            price: 50,
            image: "images/b.jpg", // fixed
            vegetarian: true,
            spicyLevel: 2,
            featured: true,
            rating: 4.9,
        },
        {
            id: 4,
            name: 'Chole Bhature',
            description: 'Spicy chickpea curry served with deep-fried bread.',
            price: 80,
            image: "images/f.jpg", // fixed
            vegetarian: true,
            spicyLevel: 3,
            featured: false,
            rating: 4.6
        },
        {
            id: 5,
            name: 'Fried Rice',
            description: 'Stir-fried rice with mixed vegetables, spices and savoury sauce.',
            price: 50,
            image: "images/d.jpg", // fixed
            vegetarian: true,
            spicyLevel: 1,
            featured: false,
            rating: 4.3
        },
        {
            id: 6,
            name: 'Paneer Butter Masala',
            description: 'Cottage cheese cubes in a rich, creamy tomato sauce with butter and spices.',
            price: 70,
            image: "images/a.jpg", // fixed
            vegetarian: true,
            spicyLevel: 2,
            featured: false,
            rating: 4.7,
        }
    ];
    
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Render menu items if on menu page
    const menuGrid = document.querySelector('.menu-grid');
    if (menuGrid) {
        renderMenuItems();
    }

    // Render cart items if on cart page
    const cartContainer = document.querySelector('.cart-container');
    if (cartContainer) {
        renderCartItems();
    }
    
    // Make Browse Menu link work
    const browseMenuLinks = document.querySelectorAll('a[href="index.html"], a[href="menu.html"], .add-to-cart-btn[href="index.html"], .add-to-cart-btn[href="menu.html"]');
    browseMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    });

    // Render menu items function
    function renderMenuItems() {
        menuGrid.innerHTML = '';
        
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item fade-in';
            
            // Determine vegetarian badge
            const vegBadge = item.vegetarian ? 
                '<div class="veg-badge"></div>' : 
                '<div class="non-veg-badge"></div>';
            
            // Create spicy indicator if spicy level > 0
            let spicyIndicator = '';
            if (item.spicyLevel > 0) {
                spicyIndicator = '<div class="spicy-indicator">';
                for(let i = 0; i < item.spicyLevel; i++) {
                    spicyIndicator += '<span>🌶️</span>';
                }
                spicyIndicator += '</div>';
            }
            
            // Create featured badge if featured
            const featuredBadge = item.featured ? 
                '<div class="featured-item">Campus Favorite</div>' : '';
            
            // Create discount badge if discount available
            const discountBadge = item.discount ? 
                `<div class="discount-badge">${item.discount}</div>` : '';
            
            menuItem.innerHTML = `
                ${vegBadge}
                ${spicyIndicator}
                ${featuredBadge}
                ${discountBadge}
                <div class="menu-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="menu-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${item.rating} (${Math.floor(item.rating * 10)} reviews)</span>
                    </div>
                    <div class="menu-footer">
                        <div class="menu-price">₹${item.price}</div>
                        <button class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            
            menuGrid.appendChild(menuItem);
        });
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // Add to cart function
    function addToCart(event) {
        const itemId = parseInt(event.target.getAttribute('data-id'));
        const menuItem = menuItems.find(item => item.id === itemId);
        
        // Check if item is already in cart
        const cartItemIndex = cart.findIndex(item => item.id === itemId);
        
        if (cartItemIndex !== -1) {
            // Item already in cart, increase quantity
            cart[cartItemIndex].quantity++;
        } else {
            // Add new item to cart
            cart.push({
                ...menuItem,
                quantity: 1
            });
        }
        
        // Save cart to local storage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count in navbar
        updateCartCount();
        
        // Show toast notification
        showToast(`${menuItem.name} added to cart!`, 'success');
    }

    // Update cart count in navbar
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = itemCount;
            
            // Show or hide the cart count based on whether there are items
            cartCountElement.style.display = itemCount > 0 ? 'flex' : 'none';
        }
    }

    // Render cart items function
    function renderCartItems() {
        const cartItemsContainer = cartContainer.querySelector('.cart-items') || cartContainer;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <p>Your cart is empty</p>
                    <a href="index.html" class="add-to-cart-btn">Browse Menu</a>
                </div>
            `;
            return;
        }
        
        // Clear previous cart items
        cartItemsContainer.innerHTML = '';
        
        // Create cart items
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">₹${item.price}</p>
                </div>
                <div class="cart-item-actions">
                    <select class="quantity-select" data-id="${item.id}">
                        ${Array.from({length: 10}, (_, i) => i + 1)
                          .map(num => `<option value="${num}" ${item.quantity === num ? 'selected' : ''}>${num}</option>`)
                          .join('')}
                    </select>
                    <button class="remove-item-btn" data-id="${item.id}">Remove</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add cart total
        const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        const cartTotal = document.createElement('div');
        cartTotal.className = 'cart-total';
        cartTotal.innerHTML = `
            <div class="total-text">Total:</div>
            <div class="total-amount">₹${totalAmount}</div>
        `;
        
        cartItemsContainer.appendChild(cartTotal);
        
        // Add checkout button
        const checkoutBtn = document.createElement('button');
        checkoutBtn.className = 'checkout-btn';
        checkoutBtn.textContent = 'Proceed to Checkout';
        cartItemsContainer.appendChild(checkoutBtn);
        
        // Add event listeners
        document.querySelectorAll('.quantity-select').forEach(select => {
            select.addEventListener('change', updateQuantity);
        });
        
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', removeCartItem);
        });
        
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Update quantity function
    function updateQuantity(event) {
        const itemId = parseInt(event.target.getAttribute('data-id'));
        const newQuantity = parseInt(event.target.value);
        
        const cartItemIndex = cart.findIndex(item => item.id === itemId);
        if (cartItemIndex !== -1) {
            cart[cartItemIndex].quantity = newQuantity;
            
            // Save cart to local storage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Re-render cart items
            renderCartItems();
            
            // Update cart count
            updateCartCount();
        }
    }

    // Remove cart item function
    function removeCartItem(event) {
        const itemId = parseInt(event.target.getAttribute('data-id'));
        
        // Find item in cart
        const cartItemIndex = cart.findIndex(item => item.id === itemId);
        if (cartItemIndex !== -1) {
            const removedItem = cart[cartItemIndex];
            
            // Remove item from cart
            cart.splice(cartItemIndex, 1);
            
            // Save cart to local storage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Re-render cart items
            renderCartItems();
            
            // Update cart count
            updateCartCount();
            
            // Show toast notification
            showToast(`${removedItem.name} removed from cart`, 'error');
        }
    }

    // Proceed to checkout function
    function proceedToCheckout() {
        if (cart.length === 0) {
            showToast('Your cart is empty!', 'error');
            return;
        }
        
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
        if (!isLoggedIn) {
            // Save current cart and redirect to login page
            showToast('Please log in to proceed with checkout', 'info');
            
            // Save return URL to redirect back after login
            localStorage.setItem('checkoutRedirect', 'true');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        
        // If logged in, redirect to payment page
        window.location.href = 'payment.html';
    }

    // Check if user just logged in and should be redirected to checkout
    const shouldRedirectToCheckout = localStorage.getItem('checkoutRedirect') === 'true';
    if (shouldRedirectToCheckout && localStorage.getItem('loggedIn') === 'true') {
        // Clear the redirect flag
        localStorage.removeItem('checkoutRedirect');
        
        // Redirect to payment page if there are items in cart
        if (cart.length > 0) {
            window.location.href = 'payment.html';
        }
    }

    // Payment Page Functionality
    const paymentContainer = document.querySelector('.payment-container');
    if (paymentContainer) {
        handlePaymentPage();
    }

    function handlePaymentPage() {
        // Calculate total
        const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Set total amount in payment page
        const paymentTotal = document.querySelector('.payment-total');
        if (paymentTotal) {
            paymentTotal.textContent = `Total Amount: ₹${totalAmount}`;
        }
        
        // Payment method selection
        const paymentMethods = document.querySelectorAll('.payment-method');
        const paymentForms = document.querySelectorAll('.payment-form');
        
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                // Remove active class from all methods
                paymentMethods.forEach(m => m.classList.remove('active'));
                
                // Add active class to selected method
                method.classList.add('active');
                
                // Show corresponding form
                const formType = method.getAttribute('data-type');
                paymentForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.classList.contains(`${formType}-form`)) {
                        form.classList.add('active');
                    }
                });
            });
        });
        
        // UPI app selection
        const upiApps = document.querySelectorAll('.upi-app');
        upiApps.forEach(app => {
            app.addEventListener('click', () => {
                upiApps.forEach(a => a.classList.remove('selected'));
                app.classList.add('selected');
            });
        });
        
        // Credit card form validation
        const cardForm = document.querySelector('.card-form');
        if (cardForm) {
            cardForm.addEventListener('submit', processPayment);
        }
        
        // UPI form validation
        const upiForm = document.querySelector('.upi-form');
        if (upiForm) {
            upiForm.addEventListener('submit', processPayment);
        }
        
        // Net banking form validation
        const netBankingForm = document.querySelector('.netbanking-form');
        if (netBankingForm) {
            netBankingForm.addEventListener('submit', processPayment);
        }
        
        // QR code animation
        const qrCode = document.querySelector('.qr-code');
        if (qrCode) {
            qrCode.addEventListener('mouseover', () => {
                qrCode.classList.add('pulse');
            });
            
            qrCode.addEventListener('mouseout', () => {
                qrCode.classList.remove('pulse');
            });
            
            // QR code payment confirmation
            const qrPaymentBtn = document.querySelector('.qr-form .payment-button');
            if (qrPaymentBtn) {
                qrPaymentBtn.addEventListener('click', processPayment);
            }
        }
        
        // Bank selection in net banking
        const bankOptions = document.querySelector('.bank-options');
        if (bankOptions) {
            const banks = bankOptions.querySelectorAll('.bank-option');
            banks.forEach(bank => {
                bank.addEventListener('click', () => {
                    banks.forEach(b => b.classList.remove('selected'));
                    bank.classList.add('selected');
                });
            });
        }
    }

    // Process payment function
    function processPayment(event) {
        event.preventDefault();
        
        const button = event.target.querySelector('button') || event.target;
        const originalText = button.textContent;
        
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<div class="spinner"></div> Processing...';
        
        // Simulate payment processing
        setTimeout(() => {
            // Clear cart after successful payment
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Show success message
            showToast('Payment successful! Your order has been placed.', 'success');
            
            // Reset button
            button.disabled = false;
            button.textContent = originalText;
            
            // Redirect to home page after a delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 2000);
    }

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const button = contactForm.querySelector('button');
            const originalText = button.textContent;
            
            // Show loading state
            button.disabled = true;
            button.innerHTML = '<div class="spinner"></div> Sending...';
            
            // Simulate form submission
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                showToast('Your message has been sent! We\'ll get back to you soon.', 'success');
                
                // Reset button
                button.disabled = false;
                button.textContent = originalText;
            }, 1500);
        });
    }

    // Authentication Forms
    const authForm = document.querySelector('.auth-form form');
    if (authForm) {
        authForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const button = authForm.querySelector('button');
            const originalText = button.textContent;
            const isLogin = authForm.getAttribute('data-type') === 'login';
            
            // Show loading state
            button.disabled = true;
            button.innerHTML = '<div class="spinner"></div> Processing...';
            
            // Simulate authentication
            setTimeout(() => {
                if (isLogin) {
                    // Simulate login
                    localStorage.setItem('loggedIn', 'true');
                    showToast('Login successful!', 'success');
                    
                    // Check if user was trying to checkout
                    const shouldRedirectToCheckout = localStorage.getItem('checkoutRedirect') === 'true';
                    if (shouldRedirectToCheckout && cart.length > 0) {
                        // Redirect to payment page
                        setTimeout(() => {
                            window.location.href = 'payment.html';
                        }, 1500);
                        
                        // Clear the checkout redirect flag
                        localStorage.removeItem('checkoutRedirect');
                        return;
                    }
                } else {
                    // Simulate registration
                    showToast('Registration successful! Please log in.', 'success');
                    // Redirect to login page
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                    return;
                }
                
                // Reset button
                button.disabled = false;
                button.textContent = originalText;
                
                // Redirect to home page after login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }, 1500);
        });
    }

    // Page animations
    function animateElements() {
        const elements = document.querySelectorAll('.fade-in, .slide-up');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(element);
        });
    }
    
    // Call animation function
    animateElements();

    // Promotion Banner Functionality
    const promotionCta = document.querySelector('.promotion-cta');
    if (promotionCta) {
        promotionCta.addEventListener('click', () => {
            window.location.href = 'index.html'; // Changed to redirect to index.html
        });
    }

    // Credit Card Number Format
    const cardNumberInput = document.querySelector('input[name="card_number"]');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Remove all non-numeric characters
            let value = this.value.replace(/\D/g, '');
            
            // Add spaces after every 4 digits
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            
            // Limit to 19 characters (16 digits + 3 spaces)
            value = value.substring(0, 19);
            
            // Update input value
            this.value = value;
            
            // Auto-detect card type based on first digits
            const cardIcons = document.querySelectorAll('.card-icon img');
            
            // Reset all icons to inactive
            cardIcons.forEach(icon => icon.classList.remove('active'));
            
            // Detect card type
            if (/^4/.test(value)) {
                // Visa
                document.querySelector('.card-icon img[alt="Visa"]')?.classList.add('active');
            } else if (/^5[1-5]/.test(value)) {
                // Mastercard
                document.querySelector('.card-icon img[alt="Mastercard"]')?.classList.add('active');
            } else if (/^3[47]/.test(value)) {
                // American Express
                document.querySelector('.card-icon img[alt="Amex"]')?.classList.add('active');
            } else if (/^6(?:011|5)/.test(value)) {
                // Discover
                document.querySelector('.card-icon img[alt="Discover"]')?.classList.add('active');
            }
        });
    }

    // Expiry Date Format
    const expiryDateInput = document.querySelector('input[name="expiry_date"]');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            // Remove all non-numeric characters
            let value = this.value.replace(/\D/g, '');
            
            // Format as MM/YY
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            // Limit to 5 characters (MM/YY)
            value = value.substring(0, 5);
            
            // Update input value
            this.value = value;
        });
    }

    // UPI ID Format
    const upiIdInput = document.querySelector('input[name="upi_id"]');
    if (upiIdInput) {
        upiIdInput.addEventListener('input', function(e) {
            // Validate UPI ID format
            let value = this.value;
            
            // Basic UPI ID validation (username@provider)
            const upiPattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+$/;
            
            // Set validity indication
            if (value && !upiPattern.test(value)) {
                this.setCustomValidity('Please enter a valid UPI ID (e.g., username@upi)');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear login state
            localStorage.removeItem('loggedIn');
            
            // Show toast
            showToast('Logged out successfully', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    // Check login status and update UI accordingly
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
        const loginBtn = document.querySelector('.login-btn');
        const logoutBtn = document.querySelector('.logout-btn');
        const profileBtn = document.querySelector('.profile-btn');
        
        if (loginBtn && !isLoggedIn) {
            loginBtn.style.display = 'block';
        } else if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        
        if (logoutBtn && isLoggedIn) {
            logoutBtn.style.display = 'block';
        } else if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
        
        if (profileBtn && isLoggedIn) {
            profileBtn.style.display = 'block';
        } else if (profileBtn) {
            profileBtn.style.display = 'none';
        }
    }
    
    // Call check login status
    checkLoginStatus();
});
// Payment Method Selection
function initializePaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentForms = document.querySelectorAll('.payment-form');
    
    if (paymentMethods.length > 0) {
        // Set the first payment method as active by default if none is selected
        if (!document.querySelector('.payment-method.active')) {
            paymentMethods[0].classList.add('active');
            const defaultFormType = paymentMethods[0].getAttribute('data-type');
            document.querySelector(`.${defaultFormType}-form`)?.classList.add('active');
        }
        
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                // Remove active class from all methods
                paymentMethods.forEach(m => m.classList.remove('active'));
                
                // Add active class to selected method
                method.classList.add('active');
                
                // Show corresponding form
                const formType = method.getAttribute('data-type');
                paymentForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.classList.contains(`${formType}-form`)) {
                        form.classList.add('active');
                    }
                });
            });
        });
    }
    
    // UPI app selection
    const upiApps = document.querySelectorAll('.upi-app');
    upiApps.forEach(app => {
        app.addEventListener('click', () => {
            upiApps.forEach(a => a.classList.remove('selected'));
            app.classList.add('selected');
        });
    });
    
    // Net banking bank selection
    const bankOptions = document.querySelectorAll('.bank-option');
    bankOptions.forEach(bank => {
        bank.addEventListener('click', () => {
            bankOptions.forEach(b => b.classList.remove('selected'));
            bank.classList.add('selected');
        });
    });
    
    // UPI form validation
    const upiForm = document.querySelector('.upi-form');
    if (upiForm) {
        upiForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Validate UPI ID
            const upiId = upiForm.querySelector('input[name="upi_id"]').value;
            const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
            
            if (!upiPattern.test(upiId)) {
                showToast('Please enter a valid UPI ID', 'error');
                return;
            }
            
            // Check if UPI app is selected
            const selectedApp = upiForm.querySelector('.upi-app.selected');
            if (!selectedApp && upiForm.querySelector('.upi-apps')) {
                showToast('Please select a UPI app', 'error');
                return;
            }
            
            processPayment(event);
        });
    }
    
    // Net banking form validation
    const netBankingForm = document.querySelector('.netbanking-form');
    if (netBankingForm) {
        netBankingForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Check if bank is selected
            const selectedBank = netBankingForm.querySelector('.bank-option.selected');
            if (!selectedBank) {
                showToast('Please select a bank', 'error');
                return;
            }
            
            processPayment(event);
        });
    }
}

// Call this function in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Your existing code...
    
    // Initialize payment methods
    initializePaymentMethods();
    
    // Your existing code...
});

// UPI ID Format Validation
function setupUpiValidation() {
    const upiIdInput = document.querySelector('input[name="upi_id"]');
    if (upiIdInput) {
        upiIdInput.addEventListener('input', function() {
            // Get the value
            let value = this.value;
            
            // Basic UPI ID validation (username@provider)
            const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
            
            // Visual validation feedback
            if (value && !upiPattern.test(value)) {
                this.classList.add('invalid');
                this.classList.remove('valid');
                this.setCustomValidity('Please enter a valid UPI ID (e.g., username@upi)');
            } else {
                this.classList.add('valid');
                this.classList.remove('invalid');
                this.setCustomValidity('');
            }
        });
    }
}

// Make sure to call this function in your existing code
document.addEventListener('DOMContentLoaded', function() {
    // Your existing code...
    
    setupUpiValidation();
    
    // Your existing code...
});