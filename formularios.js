// ========== VALIDACIONES DE FORMULARIOS ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando validaciones de formularios...');
    
    // Inicializar formularios
    initContactForm();
    initOpinionForm();
    initRatingSystem();
    initCharacterCounter();
});

// ========== FORMULARIO DE CONTACTO ==========
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Agregar validaciones en tiempo real
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    const asunto = document.getElementById('asunto');
    const mensaje = document.getElementById('mensaje');
    
    // Validación del nombre
    if (nombre) {
        nombre.addEventListener('blur', validateNombre);
        nombre.addEventListener('input', clearError);
    }
    
    // Validación del email
    if (email) {
        email.addEventListener('blur', validateEmail);
        email.addEventListener('input', clearError);
    }
    
    // Validación del teléfono
    if (telefono) {
        telefono.addEventListener('blur', validateTelefono);
        telefono.addEventListener('input', formatTelefono);
    }
    
    // Validación del asunto
    if (asunto) {
        asunto.addEventListener('change', validateAsunto);
    }
    
    // Validación del mensaje
    if (mensaje) {
        mensaje.addEventListener('blur', validateMensaje);
        mensaje.addEventListener('input', clearError);
    }
    
    // Envío del formulario
    contactForm.addEventListener('submit', handleContactSubmit);
}

// ========== FORMULARIO DE OPINIONES ==========
function initOpinionForm() {
    const opinionForm = document.getElementById('opinionForm');
    if (!opinionForm) return;
    
    const nombreOpinion = document.getElementById('nombreOpinion');
    const emailOpinion = document.getElementById('emailOpinion');
    
    // Validaciones en tiempo real
    if (nombreOpinion) {
        nombreOpinion.addEventListener('blur', () => validateField(nombreOpinion, 'nombreOpinion'));
        nombreOpinion.addEventListener('input', () => clearFieldError('nombreOpinion'));
    }
    
    if (emailOpinion) {
        emailOpinion.addEventListener('blur', () => validateEmailField(emailOpinion, 'emailOpinion'));
        emailOpinion.addEventListener('input', () => clearFieldError('emailOpinion'));
    }
    
    // Envío del formulario
    opinionForm.addEventListener('submit', handleOpinionSubmit);
}

// ========== SISTEMA DE CALIFICACIÓN CON ESTRELLAS ==========
function initRatingSystem() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('calificacion');
    const ratingText = document.querySelector('.rating-text');
    
    if (!stars.length) return;
    
    const ratingTexts = {
        1: 'Muy malo 😞',
        2: 'Malo 😕',
        3: 'Regular 😐',
        4: 'Bueno 😊',
        5: 'Excelente 😍'
    };
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            
            // Actualizar estrellas visualmente
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.color = '#FFD700';
                    s.style.fontSize = '1.5rem';
                } else {
                    s.style.color = '#ccc';
                    s.style.fontSize = '1.2rem';
                }
            });
            
            // Actualizar input hidden y texto
            if (ratingInput) ratingInput.value = rating;
            if (ratingText) ratingText.textContent = ratingTexts[rating];
            
            // Limpiar error si existe
            clearFieldError('calificacion');
        });
        
        // Efecto hover
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.transform = 'scale(1.2)';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                s.style.transform = 'scale(1)';
            });
        });
    });
}

// ========== CONTADOR DE CARACTERES ==========
function initCharacterCounter() {
    const mensaje = document.getElementById('mensaje');
    const counter = document.querySelector('.char-counter');
    
    if (!mensaje || !counter) return;
    
    mensaje.addEventListener('input', function() {
        const length = this.value.length;
        const maxLength = 500;
        
        counter.textContent = `${length}/${maxLength} caracteres`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = '#e74c3c';
        } else if (length > maxLength * 0.7) {
            counter.style.color = '#f39c12';
        } else {
            counter.style.color = '#7f8c8d';
        }
    });
}

// ========== VALIDACIONES ESPECÍFICAS ==========

function validateNombre(e) {
    const nombre = e.target.value.trim();
    const errorElement = document.getElementById('nombre-error');
    
    if (!nombre) {
        showError(errorElement, 'El nombre es obligatorio');
        return false;
    }
    
    if (nombre.length < 2) {
        showError(errorElement, 'El nombre debe tener al menos 2 caracteres');
        return false;
    }
    
    if (!/^[a-zA-ZÁáÉéÍíÓóÚúÑñ\s]+$/.test(nombre)) {
        showError(errorElement, 'El nombre solo puede contener letras y espacios');
        return false;
    }
    
    clearError(e);
    return true;
}

function validateEmail(e) {
    const email = e.target.value.trim();
    const errorElement = document.getElementById('email-error');
    
    if (!email) {
        showError(errorElement, 'El email es obligatorio');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError(errorElement, 'Ingresa un email válido (ejemplo@correo.com)');
        return false;
    }
    
    clearError(e);
    return true;
}

function validateTelefono(e) {
    const telefono = e.target.value.trim();
    const errorElement = document.getElementById('telefono-error');
    
    if (telefono && !/^\+56\s[0-9]\s[0-9]{4}\s[0-9]{4}$/.test(telefono)) {
        showError(errorElement, 'Formato: +56 9 1234 5678');
        return false;
    }
    
    clearError(e);
    return true;
}

function formatTelefono(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('56')) {
        value = value.substring(2);
    }
    
    if (value.length > 0) {
        if (value.length <= 1) {
            value = `+56 ${value}`;
        } else if (value.length <= 5) {
            value = `+56 ${value.substring(0, 1)} ${value.substring(1)}`;
        } else {
            value = `+56 ${value.substring(0, 1)} ${value.substring(1, 5)} ${value.substring(5, 9)}`;
        }
    }
    
    e.target.value = value;
}

function validateAsunto(e) {
    const asunto = e.target.value;
    const errorElement = document.getElementById('asunto-error');
    
    if (!asunto) {
        showError(errorElement, 'Selecciona un asunto');
        return false;
    }
    
    clearError(e);
    return true;
}

function validateMensaje(e) {
    const mensaje = e.target.value.trim();
    const errorElement = document.getElementById('mensaje-error');
    
    if (!mensaje) {
        showError(errorElement, 'El mensaje es obligatorio');
        return false;
    }
    
    if (mensaje.length < 10) {
        showError(errorElement, 'El mensaje debe tener al menos 10 caracteres');
        return false;
    }
    
    if (mensaje.length > 500) {
        showError(errorElement, 'El mensaje no puede exceder 500 caracteres');
        return false;
    }
    
    clearError(e);
    return true;
}

// ========== VALIDACIONES GENÉRICAS ==========

function validateField(field, fieldName) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (!value) {
        showError(errorElement, 'Este campo es obligatorio');
        return false;
    }
    
    if (value.length < 2) {
        showError(errorElement, 'Debe tener al menos 2 caracteres');
        return false;
    }
    
    clearFieldError(fieldName);
    return true;
}

function validateEmailField(field, fieldName) {
    const email = field.value.trim();
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (!email) {
        showError(errorElement, 'El email es obligatorio');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError(errorElement, 'Ingresa un email válido');
        return false;
    }
    
    clearFieldError(fieldName);
    return true;
}

function validateRating() {
    const rating = document.getElementById('calificacion').value;
    const errorElement = document.getElementById('calificacion-error');
    
    if (!rating) {
        showError(errorElement, 'Por favor, califica nuestro servicio');
        return false;
    }
    
    clearFieldError('calificacion');
    return true;
}

// ========== MANEJO DE ERRORES ==========

function showError(errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(e) {
    const fieldName = e.target.name;
    clearFieldError(fieldName);
}

function clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// ========== ENVÍO DE FORMULARIOS ==========

function handleContactSubmit(e) {
    e.preventDefault();
    
    console.log('Validando formulario de contacto...');
    
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    const asunto = document.getElementById('asunto');
    const mensaje = document.getElementById('mensaje');
    
    let isValid = true;
    
    // Validar todos los campos
    if (!validateNombre({target: nombre})) isValid = false;
    if (!validateEmail({target: email})) isValid = false;
    if (telefono.value && !validateTelefono({target: telefono})) isValid = false;
    if (!validateAsunto({target: asunto})) isValid = false;
    if (!validateMensaje({target: mensaje})) isValid = false;
    
    if (isValid) {
        // Simular envío exitoso
        showSuccessMessage('contactForm', '¡Mensaje enviado correctamente! Te responderemos pronto.');
        e.target.reset();
    } else {
        // Scroll al primer error
        const firstError = document.querySelector('.error-message[style*="block"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function handleOpinionSubmit(e) {
    e.preventDefault();
    
    console.log('Validando formulario de opiniones...');
    
    const nombreOpinion = document.getElementById('nombreOpinion');
    const emailOpinion = document.getElementById('emailOpinion');
    
    let isValid = true;
    
    // Validar campos obligatorios
    if (!validateField(nombreOpinion, 'nombreOpinion')) isValid = false;
    if (!validateEmailField(emailOpinion, 'emailOpinion')) isValid = false;
    if (!validateRating()) isValid = false;
    
    if (isValid) {
        // Simular envío exitoso
        showSuccessMessage('opinionForm', '¡Gracias por tu opinión! Nos ayuda a mejorar nuestro servicio.');
        e.target.reset();
        resetRating();
    } else {
        // Scroll al primer error
        const firstError = document.querySelector('.error-message[style*="block"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function resetRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('calificacion');
    const ratingText = document.querySelector('.rating-text');
    
    stars.forEach(star => {
        star.style.color = '#ccc';
        star.style.fontSize = '1.2rem';
    });
    
    if (ratingInput) ratingInput.value = '';
    if (ratingText) ratingText.textContent = 'Selecciona una calificación';
}

function showSuccessMessage(formId, message) {
    // Remover mensaje anterior si existe
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const form = document.getElementById(formId);
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✅</span>
            <span class="success-text">${message}</span>
        </div>
    `;
    
    form.parentNode.insertBefore(successDiv, form);
    
    // Auto-hide después de 5 segundos
    setTimeout(() => {
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
    
    // Scroll al mensaje
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ========== FUNCIONES DE UTILIDAD ==========

// Limpiar formulario específico
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        
        // Limpiar errores
        const errors = form.querySelectorAll('.error-message');
        errors.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        // Reset rating si es el formulario de opiniones
        if (formId === 'opinionForm') {
            resetRating();
        }
        
        // Reset contador de caracteres
        const counter = form.querySelector('.char-counter');
        if (counter) {
            counter.textContent = '0/500 caracteres';
            counter.style.color = '#7f8c8d';
        }
    }
}

// Validar formulario completo antes del envío
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            const errorElement = document.getElementById(`${field.name}-error`);
            showError(errorElement, 'Este campo es obligatorio');
            isValid = false;
        }
    });
    
    return isValid;
}

// Función para debugging - mostrar datos del formulario
function debugFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    console.log(`Datos del formulario ${formId}:`, data);
}