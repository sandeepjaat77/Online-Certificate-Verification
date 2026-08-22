const API_BASE_URL =
    "https://online-certificate-verification-owsv.onrender.com";

const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");


loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                message.innerText =
                    data.message ||
                    "Login successful";

                message.style.color =
                    "green";


                localStorage.setItem(
                    "token",
                    data.token
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                if (
                    data.user.role === "issuer"
                ) {

                    window.location.href =
                        "issuer-dashboard.html";

                } else {

                    window.location.href =
                        "recipient-dashboard.html";

                }

            } else {

                message.innerText =
                    data.message ||
                    "Login failed";

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
