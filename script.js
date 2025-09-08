// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Category tabs functionality
const tabButtons = document.querySelectorAll('.tab-button');
const categoryContents = document.querySelectorAll('.category-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        categoryContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const category = button.getAttribute('data-category');
        const targetContent = document.getElementById(category);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu if open
        if (navLinks) {
            navLinks.classList.remove('active');
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Add interactive hover effects for food cards
document.querySelectorAll('.food-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effect for CTA button
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function(e) {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Easter egg: Konami code for special Chilean flag animation
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        // Trigger Chilean flag celebration
        const body = document.body;
        body.style.background = 'linear-gradient(0deg, #c41e3a 33%, white 33%, white 66%, #1e3c72 66%)';
        body.style.animation = 'rainbow 2s ease-in-out';
        
        setTimeout(() => {
            body.style.background = '';
            body.style.animation = '';
        }, 3000);
        
        konamiCode = [];
    }
});

// Additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}); 

// ========== CARRITO DE COMPRAS - VERSIÓN CORREGIDA ==========

// Inicializar carrito
let cart = [];

// Referencias DOM
let cartButton, cartCount;

// Función para inicializar las referencias del DOM
function initializeCartDOM() {
    cartButton = document.getElementById('cartButton');
    cartCount = document.getElementById('cartCount');
    
    if (!cartButton || !cartCount) {
        console.error('Elementos del carrito no encontrados en el DOM');
        return false;
    }
    return true;
}

// Función para cargar carrito desde localStorage
function loadCartFromStorage() {
    try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        } else {
            cart = [];
        }
    } catch (error) {
        console.error('Error cargando carrito desde localStorage:', error);
        cart = [];
    }
}

// Función para guardar carrito en localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error guardando carrito en localStorage:', error);
    }
}

// Actualizar contador del carrito
function updateCartCount() {
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Animación del contador
    cartCount.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);
}

// Función para agregar al carrito
function addToCart(productData) {
    console.log('Agregando al carrito:', productData);
    
    const existingItem = cart.find(item => item.name === productData.name);
    
    if (existingItem) {
        existingItem.quantity += productData.quantity;
    } else {
        cart.push({
            name: productData.name,
            price: productData.price,
            description: productData.description,
            image: productData.image,
            quantity: productData.quantity
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    showNotification(`${productData.quantity}x ${productData.name} agregado al carrito`);
}

// Función de notificación
function showNotification(message) {
    // Remover notificación anterior si existe
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1003;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => notification.style.transform = 'translateX(0)', 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Manejar controles de cantidad y agregar al carrito
document.addEventListener('click', function(e) {
    // Manejar botones de cantidad
    if (e.target.classList.contains('qty-btn-card')) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = e.target.closest('.food-card');
        if (!card) return;
        
        const quantityDisplay = card.querySelector('.quantity-display');
        if (!quantityDisplay) return;
        
        const action = e.target.dataset.action;
        let currentQty = parseInt(quantityDisplay.textContent) || 1;
        
        if (action === 'increase' && currentQty < 10) {
            currentQty++;
        } else if (action === 'decrease' && currentQty > 1) {
            currentQty--;
        }
        
        quantityDisplay.textContent = currentQty;
        
        // Animación
        quantityDisplay.classList.add('updated');
        setTimeout(() => {
            quantityDisplay.classList.remove('updated');
        }, 300);
    }
    
    // Manejar botón agregar al carrito
    if (e.target.classList.contains('add-to-cart-direct')) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = e.target.closest('.food-card');
        if (!card) {
            console.error('No se encontró la tarjeta del producto');
            return;
        }
        
        const quantityDisplay = card.querySelector('.quantity-display');
        const quantity = quantityDisplay ? parseInt(quantityDisplay.textContent) || 1 : 1;
        
        // Obtener datos del producto
        const productData = {
            name: card.dataset.name || card.querySelector('.food-name')?.textContent || 'Producto',
            price: card.dataset.price || card.querySelector('.food-price')?.textContent.replace(/[^\d]/g, '') || '0',
            description: card.dataset.description || card.querySelector('.food-description')?.textContent || '',
            image: card.dataset.image || '🍽️',
            quantity: quantity
        };
        
        console.log('Datos del producto:', productData);
        
        // Verificar que tenemos datos válidos
        if (!productData.name || productData.name === 'Producto') {
            console.error('No se pudieron obtener los datos del producto');
            showNotification('Error: No se pudieron obtener los datos del producto');
            return;
        }
        
        addToCart(productData);
        
        // Resetear cantidad a 1
        if (quantityDisplay) {
            quantityDisplay.textContent = '1';
        }
        
        // Animación del botón
        e.target.style.transform = 'scale(0.9)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
    }
});

// Abrir carrito
function openCart() {
    console.log('Abriendo carrito...');
    
    // Guardar carrito antes de abrir
    saveCartToStorage();
    
    // Abrir carrito en nueva ventana
    const cartWindow = window.open('carrito.html', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
    
    if (!cartWindow) {
        // Si se bloquea el popup, mostrar mensaje
        showNotification('Permita ventanas emergentes para ver el carrito');
        
        // Alternativa: redirigir en la misma ventana
        setTimeout(() => {
            if (confirm('¿Desea ir al carrito en esta misma ventana?')) {
                window.location.href = 'carrito.html';
            }
        }, 1000);
    }
}

// Carrusel automático del hero
function initializeCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function nextSlide() {
        // Remover clase active del slide actual
        slides[currentSlide].classList.remove('active');
        
        // Ir al siguiente slide (o volver al primero)
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Agregar clase active al nuevo slide
        slides[currentSlide].classList.add('active');
    }
    
    // Cambiar slide cada 4 segundos
    setInterval(nextSlide, 4000);
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando carrito...');
    
    // Inicializar referencias del DOM
    if (!initializeCartDOM()) {
        console.error('No se pudieron inicializar los elementos del carrito');
        return;
    }
    
    // Cargar carrito desde localStorage
    loadCartFromStorage();
    
    // Actualizar contador
    updateCartCount();
    
    // Configurar evento del botón carrito
    cartButton.addEventListener('click', openCart);
    
    // Inicializar carrusel
    initializeCarousel();
    
    console.log('Carrito inicializado correctamente');
});

// Sincronizar cuando la ventana recibe el foco (útil cuando se vuelve del carrito)
window.addEventListener('focus', function() {
    loadCartFromStorage();
    updateCartCount();
});

// Manejar cambios en localStorage desde otras ventanas
window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        loadCartFromStorage();
        updateCartCount();
    }
});

// Función para inicializar las referencias del DOM - VERSIÓN ACTUALIZADA
function initializeCartDOM() {
    cartButton = document.getElementById('cartButton');
    cartCount = document.getElementById('cartCount');
    
    // Referencias para el carrito en la navegación
    const navCartButton = document.getElementById('navCartButton');
    const navCartCount = document.getElementById('navCartCount');
    
    // Configurar evento para el botón del carrito en la navegación
    if (navCartButton) {
        navCartButton.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    // Función para actualizar ambos contadores
    window.updateAllCartCounts = function() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Actualizar contador del botón flotante
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Actualizar contador en la navegación
        if (navCartCount) {
            navCartCount.textContent = totalItems;
            navCartCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                navCartCount.style.transform = 'scale(1)';
            }, 200);
        }
    };
    
    return (cartButton || navCartButton) && (cartCount || navCartCount);
}

// Actualizar la función updateCartCount para usar la nueva función
function updateCartCount() {
    if (window.updateAllCartCounts) {
        window.updateAllCartCounts();
    }
}