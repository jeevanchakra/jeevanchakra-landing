/* ==========================================
   WAITLIST COMPONENT JS
   ========================================== */

(function () {
    'use strict';

    function initWaitlistForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('message');
        const budgetInput = document.getElementById('budget');
        const submitBtn = document.getElementById('submit-btn');

        // Real-time validation
        if (nameInput) nameInput.addEventListener('blur', () => validateName());
        if (emailInput) emailInput.addEventListener('blur', () => validateEmail());
        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                // Allow only numbers
                phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
                validatePhone();
            });
        }
        if (messageInput) messageInput.addEventListener('blur', () => validateMessage());
        if (budgetInput) budgetInput.addEventListener('change', () => validateBudget());

        // Validation functions
        function validateName() {
            const value = nameInput.value.trim();
            const error = document.getElementById('name-error');

            if (value.length < 2) {
                error.classList.remove('hidden');
                nameInput.classList.add('border-red-500');
                nameInput.classList.remove('border-green-500');
                return false;
            } else {
                error.classList.add('hidden');
                nameInput.classList.remove('border-red-500');
                nameInput.classList.add('border-green-500');
                return true;
            }
        }

        function validateEmail() {
            const value = emailInput.value.trim();
            const error = document.getElementById('email-error');
            const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

            if (!emailRegex.test(value)) {
                error.classList.remove('hidden');
                emailInput.classList.add('border-red-500');
                emailInput.classList.remove('border-green-500');
                return false;
            } else {
                error.classList.add('hidden');
                emailInput.classList.remove('border-red-500');
                emailInput.classList.add('border-green-500');
                return true;
            }
        }

        function validatePhone() {
            const value = phoneInput.value.trim();
            const error = document.getElementById('phone-error');

            if (value.length !== 10) {
                error.classList.remove('hidden');
                phoneInput.classList.add('border-red-500');
                phoneInput.classList.remove('border-green-500');
                return false;
            } else {
                error.classList.add('hidden');
                phoneInput.classList.remove('border-red-500');
                phoneInput.classList.add('border-green-500');
                return true;
            }
        }

        function validateMessage() {
            const value = messageInput.value.trim();
            const error = document.getElementById('message-error');

            if (value.length < 10) {
                error.classList.remove('hidden');
                messageInput.classList.add('border-red-500');
                messageInput.classList.remove('border-green-500');
                return false;
            } else {
                error.classList.add('hidden');
                messageInput.classList.remove('border-red-500');
                messageInput.classList.add('border-green-500');
                return true;
            }
        }

        function validateBudget() {
            const value = budgetInput.value;
            const error = document.getElementById('budget-error');

            if (!value) {
                error.classList.remove('hidden');
                budgetInput.classList.add('border-red-500');
                budgetInput.classList.remove('border-green-500');
                return false;
            } else {
                error.classList.add('hidden');
                budgetInput.classList.remove('border-red-500');
                budgetInput.classList.add('border-green-500');
                return true;
            }
        }

        // Form submission
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validate all fields
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isMessageValid = validateMessage();
            const isBudgetValid = validateBudget();

            if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid || !isBudgetValid) {
                alert('Please fix all errors before submitting');
                return;
            }

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '⏳ Submitting...';

            // Prepare data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                message: messageInput.value.trim(),
                budget: budgetInput.value
            };

            try {
                // YOUR ACTUAL GOOGLE APPS SCRIPT URL
                const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhHsNmb0P4NQHMsaqOcYO-LE1zCfd8IE2RnG6nEhVvTTTFh8SppwiaZUcy16yn91Y7/exec';

                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                // Since mode is no-cors, we can't read response but assume success if no error
                submitBtn.innerHTML = '✓ Success!';

                // Redirect to thank you or show message
                setTimeout(() => {
                    // Try to redirect if thank-you page exists, or just alert
                    window.location.href = 'thank-you.html';
                }, 1000);

            } catch (error) {
                console.error('Submission error:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Join Founding Members';
                alert('There was an error submitting the form. Please try again or email us directly at ojhabanking@gmail.com');
            }
        });
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWaitlistForm);
    } else {
        initWaitlistForm();
    }

})();
