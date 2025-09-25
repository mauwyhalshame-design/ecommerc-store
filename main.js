// بيانات المنتجات
let products = [
    {
        id: 1,
        name: 'هاتف ذكي متطور',
        description: 'هاتف ذكي بأحدث التقنيات وكاميرا عالية الدقة',
        price: 2500,
        image: '../images/phone.jpg'
    },
    {
        id: 2,
        name: 'لابتوب عالي الأداء',
        description: 'لابتوب مثالي للعمل والألعاب بمعالج قوي',
        price: 4500,
        image: '../images/laptop.jpg'
    },
    {
        id: 3,
        name: 'سماعات لاسلكية',
        description: 'سماعات بتقنية إلغاء الضوضاء وجودة صوت ممتازة',
        price: 800,
        image: '../images/headphones.jpg'
    }
];

// سلة التسوق
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setupMenu();
    setupCountdown();
    loadProducts();
    updateCartCount();
});

// إعداد القائمة المتجاوبة
function setupMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// العد التنازلي
function setupCountdown() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;
    
    // تحديد تاريخ انتهاء العرض (7 أيام من الآن)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;
        
        if (distance < 0) {
            countdown.innerHTML = 'انتهى العرض!';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// تحميل المنتجات
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='../images/placeholder.jpg'">
            <div class="product-info">
                <h4 class="product-title">${product.name}</h4>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} ريال</div>
                <div class="product-actions">
                    <button class="btn btn-small" onclick="addToCart(${product.id})">
                        أضف للسلة
                    </button>
                    <button class="btn btn-small" onclick="viewProduct(${product.id})">
                        عرض التفاصيل
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// إضافة منتج للسلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showMessage('تم إضافة المنتج إلى السلة!');
}

// تحديث عداد السلة
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// عرض تفاصيل المنتج
function viewProduct(productId) {
    localStorage.setItem('selectedProductId', productId);
    window.location.href = 'product-details.html';
}

// عرض رسالة
function showMessage(message) {
    alert(message);
}

// التحقق من صحة النماذج
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        // إزالة رسائل الخطأ السابقة
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
        input.classList.remove('error');
        
        // التحقق من الحقل
        if (!input.value.trim()) {
            showFieldError(input, 'هذا الحقل مطلوب');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showFieldError(input, 'يرجى إدخال بريد إلكتروني صحيح');
            isValid = false;
        } else if (input.type === 'password' && input.value.length < 6) {
            showFieldError(input, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            isValid = false;
        }
    });
    
    return isValid;
}

// عرض خطأ في الحقل
function showFieldError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
}

// التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// إخفاء/إظهار العناصر
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

// تغيير لون الخلفية
function changeBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

