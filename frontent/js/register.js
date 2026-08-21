const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {

    // Stop page refresh
    event.preventDefault();


    // Get form values

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const role =
        document.getElementById("role").value;


    try {

        // Send data to backend

        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    role: role
                })
            }
        );


        // Convert response to JSON

        const data = await response.json();


        // Get message element

        const message =
            document.getElementById("message");


        // Check response

        if (response.ok) {

            message.innerText =
                data.message;

            message.style.color =
                "green";

            // Clear form

            registerForm.reset();

        } else {

            message.innerText =
                data.message;

            message.style.color =
                "red";
        }


    } catch (error) {

        console.log(error);

        document.getElementById("message").innerText =
            "Unable to connect to server";

        document.getElementById("message").style.color =
            "red";

    }

});