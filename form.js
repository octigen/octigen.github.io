var form = document.getElementById("contact-form");
  
async function handleSubmit(event) {
  event.preventDefault();
  
  var status = document.getElementById("contact-form-status");
  var button = document.getElementById("contact-form-button");
  var data = new FormData(event.target);
  
  // Store original button text
  var originalButtonText = button.innerHTML;
  
  // Set loading state
  button.disabled = true;
  button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
  status.innerHTML = "";
  
  try {
    const response = await fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      // Success
      status.innerHTML = '<div class="alert alert-success" role="alert">✓ Thank you, our team will come back to you as soon as possible</div>';
      form.reset();
    } else {
      // Error response from server
      const errorData = await response.json();
      if (errorData.errors) {
        status.innerHTML = '<div class="alert alert-danger" role="alert">' + errorData.errors.map(error => error.message).join(", ") + '</div>';
      } else {
        status.innerHTML = '<div class="alert alert-danger" role="alert">Oops! There was a problem submitting your form. Please try again.</div>';
      }
    }
  } catch (error) {
    // Network or other error
    status.innerHTML = '<div class="alert alert-danger" role="alert">Oops! There was a problem submitting your form. Please check your connection and try again.</div>';
  } finally {
    // Restore button state
    button.disabled = false;
    button.innerHTML = originalButtonText;
  }
}

form.addEventListener("submit", handleSubmit);
