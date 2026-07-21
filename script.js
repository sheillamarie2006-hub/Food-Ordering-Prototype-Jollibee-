let cart = [];
let currentUser = null;

// Menu Data Store
const menuData = {
    all: [
        { name: '1-pc Chickenjoy with Rice', price: 95, desc: 'Crispylicious, Juicypolicious 1-pc Chickenjoy served with warm rice and gravy.', icon: '🍗' },
        { name: 'Jolly Spaghetti Solo', price: 60, desc: 'Sweet-style spaghetti topped with ham, hotdog slices, and melted cheese.', icon: '🍝' },
        { name: 'Yumburger Solo', price: 40, desc: '100% beef patty with Jollibee\'s signature special burger dressing.', icon: '🍔' },
        { name: 'Peach Mango Pie', price: 48, desc: 'Crispy pie crust filled with sweet peaches and real Philippine mangoes.', icon: '🥧' }
    ],
    chickenjoy: [
        { name: '1 - pc. Chickenjoy New Spicy Solo', price: 99, desc: 'Fiery and crispy 1-pc Spicy Chickenjoy served with warm rice and gravy.', icon: '🍗🌶️' },
        { name: '1 - pc. Chickenjoy New Spicy w/ Coke Float', price: 132, desc: 'Crispy 1-pc Spicy Chickenjoy served with rice, gravy, and a refreshing Coke Float.', icon: '🍗🥤' },
        { name: '1 - pc. Chickenjoy New Spicy w/ Fries Solo', price: 145, desc: 'Spicy 1-pc Chickenjoy meal paired with crispy Jolly Crispy Fries.', icon: '🍗🍟' },
        { name: '1 - pc. Chickenjoy New Spicy w/ Spaghetti Solo', price: 160, desc: 'The best of both worlds: Spicy Chickenjoy paired with sweet-style Jolly Spaghetti.', icon: '🍗🍝' }
    ],
    burgers: [
        { name: 'Double Special Cheesy Yumburger w/ Drink', price: 140, desc: 'Two 100% beef patties topped with melted cheese, special dressing, served with a drink.', icon: '🍔🥤' },
        { name: 'Special Cheesy Yumburger w/ Drink', price: 95, desc: '100% beef patty topped with melted cheese and signature dressing, served with a drink.', icon: '🍔🥤' },
        { name: 'Yumburger w/ Fries & Drink', price: 105, desc: 'Classic Yumburger served with crispy Jolly Crispy Fries and a cold drink.', icon: '🍔🍟' },
        { name: 'Cheesy Yumburger Solo', price: 60, desc: '100% beef patty with melted cheese and signature special burger dressing.', icon: '🧀🍔' }
    ],
    spaghetti: [
        { name: 'Jolly Spaghetti Family Pan', price: 260, desc: 'Generous serving of sweet-style Jolly Spaghetti perfect for sharing with family and friends.', icon: '🍝👨‍👩‍👧‍👦' },
        { name: 'Palabok Family Pan', price: 390, desc: 'Classic Palabok noodles with savory garlic sauce, crushed chicharon, and egg in a family pan.', icon: '🍜👨‍👩‍👧‍👦' },
        { name: 'Jolly Spaghetti Solo', price: 60, desc: 'Sweet-style spaghetti topped with ham, hotdog slices, and melted cheese.', icon: '🍝' },
        { name: 'Palabok w/ drink', price: 135, desc: 'Savory Palabok noodles served with garlic sauce, toppings, and a refreshing drink.', icon: '🍜🥤' }
    ],
    desserts: [
        { name: 'Peach Mango Pie', price: 48, desc: 'Crispy pie crust filled with sweet peaches and real Philippine mangoes.', icon: '🥧' }
    ]
};

// --- Menu Functions ---
function renderMenu(categoryKey) {
    const menuGrid = document.getElementById('menu-grid');
    const items = menuData[categoryKey] || menuData['all'];

    let html = '';
    items.forEach(item => {
        html += `
            <div class="food-card">
                <div class="food-img-wrapper">${item.icon}</div>
                <div class="food-info">
                    <h3 class="food-title">${item.name}</h3>
                    <p class="food-desc">${item.desc}</p>
                    <div class="food-footer">
                        <span class="food-price">₱${item.price.toFixed(2)}</span>
                        <button class="add-btn" onclick="addToCart('${item.name.replace(/'/g, "\\'")}', ${item.price})">+ Add</button>
                    </div>
                </div>
            </div>
        `;
    });

    menuGrid.innerHTML = html;
}

function showCategory(categoryKey, btnElement) {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const heading = document.getElementById('section-heading');
    if (categoryKey === 'chickenjoy') heading.textContent = 'Chickenjoy Options';
    else if (categoryKey === 'burgers') heading.textContent = 'Burger Options';
    else if (categoryKey === 'spaghetti') heading.textContent = 'Jolly Spaghetti & Noodles';
    else if (categoryKey === 'all') heading.textContent = 'Bestsellers';
    else heading.textContent = btnElement.textContent;

    renderMenu(categoryKey);
}

// --- Cart Functions ---
function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
}

function addToCart(itemName, price) {
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name: itemName, price: price, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartBody = document.getElementById('cart-body');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartBody.innerHTML = `<p class="empty-cart-msg">Your cart is empty.</p>`;
        cartTotal.textContent = '₱0.00';
        return;
    }

    let itemsHTML = '';
    let totalCost = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        totalCost += itemTotal;
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₱${item.price.toFixed(2)} x ${item.qty}</p>
                </div>
                <strong>₱${itemTotal.toFixed(2)}</strong>
            </div>
        `;
    });

    cartBody.innerHTML = itemsHTML;
    cartTotal.textContent = `₱${totalCost.toFixed(2)}`;
}

function processCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    if (!currentUser) {
        alert('Please sign in or create an account to complete your order.');
        openAuthModal('login');
        return;
    }
    alert(`Thank you, ${currentUser.name}! Your order has been placed successfully.`);
    cart = [];
    updateCartUI();
    toggleCart();
}

// --- Authentication System ---
function openAuthModal(defaultTab = 'login') {
    switchTab(defaultTab);
    document.getElementById('auth-overlay').classList.add('open');
}

function closeAuthModal() {
    document.getElementById('auth-overlay').classList.remove('open');
}

function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTabBtn = document.getElementById('tab-login-btn');
    const registerTabBtn = document.getElementById('tab-register-btn');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');

    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTabBtn.classList.add('active');
        registerTabBtn.classList.remove('active');
        authTitle.textContent = 'Welcome Back!';
        authSubtitle.textContent = 'Sign in to start ordering your favorites!';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        registerTabBtn.classList.add('active');
        loginTabBtn.classList.remove('active');
        authTitle.textContent = 'Create an Account';
        authSubtitle.textContent = 'Join Jollibee Rewards & order faster!';
    }
}

function handleLogin(event) {
    event.preventDefault();
    const inputVal = document.getElementById('login-email').value;
    // Derive display name from input
    const displayName = inputVal.includes('@') ? inputVal.split('@')[0] : inputVal;
    
    currentUser = { name: displayName };
    updateAuthUI();
    closeAuthModal();
    alert(`Welcome back, ${displayName}!`);
}

function handleRegister(event) {
    event.preventDefault();
    const fullName = document.getElementById('reg-name').value;
    
    currentUser = { name: fullName };
    updateAuthUI();
    closeAuthModal();
    alert(`Account created successfully! Welcome to Jollibee, ${fullName}!`);
}

function logoutUser() {
    currentUser = null;
    updateAuthUI();
    alert('You have logged out.');
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-nav-btn');
    const userProfile = document.getElementById('user-profile-nav');
    const userDisplayName = document.getElementById('user-display-name');

    if (currentUser) {
        loginBtn.style.display = 'none';
        userProfile.style.display = 'flex';
        userDisplayName.textContent = `Hi, ${currentUser.name}`;
    } else {
        loginBtn.style.display = 'block';
        userProfile.style.display = 'none';
    }
}

// Initial setup
renderMenu('all');


