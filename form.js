var form = document.getElementById("contact-form");
  
async function handleSubmit(event) {
  event.preventDefault();
  var status = document.getElementById("contact-form-status");
  var data = new FormData(event.target);
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      status.innerHTML = "<span data-translate=\"contact_us.form.thanks\">Thanks for your submission!</span>";
      form.reset()
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
        } else {
          status.innerHTML = "<span data-translate=\"contact_us.form.error\">Oops! There was a problem submitting your form</span>"
        }
      })
    }
    const lang = localStorage.getItem("lang") || "en";
    loadLanguage(lang);
  }).catch(error => {
    status.innerHTML = "<span data-translate=\"contact_us.form.error\">Oops! There was a problem submitting your form</span>"
  });
}
form.addEventListener("submit", handleSubmit)