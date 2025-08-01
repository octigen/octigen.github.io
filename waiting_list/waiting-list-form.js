// Waiting List Form Handler for MailerLite
document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById("waiting-list-form");
    
    if (form) {
        form.addEventListener("submit", handleMailerLiteSubmit);
    }
});

async function handleMailerLiteSubmit(event) {
    event.preventDefault();
    
    var status = document.getElementById("waiting-list-status");
    var submitButton = document.getElementById("waiting-list-submit");
    var originalButtonText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span data-translate="waiting_list.form.submitting">Joining...</span>';
    status.innerHTML = "";
    status.className = "";
    
    var formData = new FormData(event.target);
    
    // Extract form data
    const subscriberData = {
        email: formData.get('email'),
        name: formData.get('name'),
        company: formData.get('company'),
        gdpr_consent: formData.get('gdpr-consent') ? true : false
    };
    
    try {
        // Note: This approach requires a backend endpoint to handle MailerLite API calls
        // because MailerLite API keys should not be exposed in frontend code
        
        // Option 1: Use your own backend endpoint (recommended for production)
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscriberData)
        });
        
        if (response.ok) {
            // Success
            status.innerHTML = '<span data-translate="waiting_list.form.success">🎉 Welcome aboard! You\'re now on our waiting list. We\'ll be in touch soon!</span>';
            status.className = "success";
            form.reset();
            
            // Optional: Track conversion for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'YOUR_CONVERSION_ID/waiting_list_signup',
                    'value': 1
                });
            }
            
        } else {
            // Handle error response
            const errorData = await response.json();
            let errorMessage = '<span data-translate="waiting_list.form.error">Oops! There was a problem. Please try again.</span>';
            
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
            
            status.innerHTML = errorMessage;
            status.className = "error";
        }
        
    } catch (error) {
        // Network or other error
        console.error('Form submission error:', error);
        
        // Fallback: Try MailerLite's embedded form submission
        // This will work if you've set up MailerLite's universal tracking code properly
        if (typeof window.ml !== 'undefined' && window.ml.form) {
            try {
                await window.ml.form.submit(subscriberData);
                status.innerHTML = '<span data-translate="waiting_list.form.success">🎉 Welcome aboard! You\'re now on our waiting list. We\'ll be in touch soon!</span>';
                status.className = "success";
                form.reset();
            } catch (mlError) {
                console.error('MailerLite submission error:', mlError);
                status.innerHTML = '<span data-translate="waiting_list.form.error">Oops! There was a problem. Please try again.</span>';
                status.className = "error";
            }
        } else {
            status.innerHTML = '<span data-translate="waiting_list.form.error">Oops! There was a problem. Please try again.</span>';
            status.className = "error";
        }
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        
        // Reload translations if available
        if (typeof loadLanguage === 'function') {
            const lang = localStorage.getItem("lang") || "en";
            setTimeout(() => loadLanguage(lang), 100);
        }
    }
}

// Email validation enhancement
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this);
        });
    }
});

function validateEmail(input) {
    const email = input.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        input.classList.add('is-invalid');
        
        // Add or update invalid feedback
        let feedback = input.parentNode.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            input.parentNode.appendChild(feedback);
        }
        feedback.textContent = 'Please enter a valid email address.';
    } else {
        input.classList.remove('is-invalid');
        const feedback = input.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
    }
} 