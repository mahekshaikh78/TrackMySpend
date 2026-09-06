let form = document.getElementById("loginForm");
let username = document.getElementById("username")
let password = document.getElementById("password")
form.addEventListener("submit", (event) => {
	event.preventDefault()
	let usernameValue = username.value
	let passwordValue = password.value
	let data = {
		username: usernameValue,
		password: passwordValue
	}

	fetch( 'http://127.0.0.1:8000/login/' , {
		method:"POST",
		headers:{
			"Content-Type" : "application/json"
		},
		body: JSON.stringify(data)

	})
	.then((response) => {
         return response.json()
	})
	.then((data) => {

		  if (!data.access) {
        document.getElementById("errorMessage").textContent =
            "Invalid username or password."
        return
    }
 
		localStorage.setItem("accessToken" , data.access)
		window.location.href = "/dashboard/";
	})

});
const showPassword = document.getElementById("showPassword");

showPassword.addEventListener("change", function() {
    if (showPassword.checked) {
        password.type = "text";
    } else {
        password.type = "password";
    }
});


