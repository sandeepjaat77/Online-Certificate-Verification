const registerForm =
    document.getElementById("registerForm");


registerForm.addEventListener(
    "submit",
    async (event) => {

        // Stop page refresh

        event.preventDefault();


        // Get form values

        const name =
            document.getElementById(
                "name"
            ).value.trim();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        const role =
            document.getElementById(
                "role"
            ).value;


        const message =
            document.getElementById(
                "message"
            );


        try {

            // Send data to Render backend

            const response =
                await fetch(
                    "https://online-certificate-verification-owsv.onrender.com/api/auth/register",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                name: name,

                                email: email,

                                password: password,

                                role: role

                            })

                    }
                );


            // Convert response to JSON

            const data =
                await response.json();


            // Check response

            if (response.ok) {

                message.innerText =
                    data.message ||
                    "Registration successful";

                message.style.color =
                    "green";


                // Clear form

                registerForm.reset();


            } else {

                message.innerText =
                    data.message ||
                    "Registration failed";

                message.style.color =
                    "red";

            }


        } catch (error) {

            console.log(error);


            message.innerText =
                "Unable to connect to server";


            message.style.color =
                "red";

        }

    }
);
