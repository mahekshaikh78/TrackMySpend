const registerForm = document.getElementById("registerForm");


registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("errorMessage");

    const response = await fetch("/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
            confirm_password: confirmPassword
        })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Registration successful!");
        window.location.href = "/login_page/";
    } else {
        errorMessage.textContent = data.error;
    }
});

const showPassword = document.getElementById("showPassword");
showPassword.addEventListener("change", function() {
	    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
	if (password.length < 8) {
    errorMessage.textContent = "Password must be at least 8 characters.";
    return;
}
	if (showPassword.checked) {
    password.type = "text";
    confirmPassword.type = "text";
} else {
    password.type = "password";
    confirmPassword.type = "password";
}
});