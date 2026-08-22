const API_BASE_URL =
    "https://online-certificate-verification-owsv.onrender.com";

const registerForm =
    document.getElementById("registerForm");

const message =
    document.getElementById("message");


registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            document.getElementById("name")
                .value
                .trim();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;

        const role =
            document.getElementById("role")
                .value;


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/auth/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password,
                            role
                        })
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                message.innerText =
                    data.message ||
                    "Registration successful";

                message.style.color =
                    "green";


                registerForm.reset();

            } else {

                message.innerText =
                    data.message ||
                    "Registration failed";

                message.style.color =
                    "red";

            }


        } catch (error) {

            console.error(error);

            message.innerText =
                "Unable to connect to server";

            message.style.color =
                "red";

        }

    }
);
