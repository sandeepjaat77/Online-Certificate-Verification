const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        const message = document.getElementById("message");

        if (response.ok) {
            message.innerText = data.message;
            message.style.color = "green";

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "issuer") {
                window.location.href = "issuer-dashboard.html";
            } else {
                window.location.href = "recipient-dashboard.html";
            }
        } else {
            message.innerText = data.message;
            message.style.color = "red";
        }
    } catch (error) {
        console.log(error);
        document.getElementById("message").innerText = "Unable to connect to server";
        document.getElementById("message").style.color = "red";
    }
});