const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        const message =
            document.getElementById(
                "message"
            );


        try {

            const response =
                await fetch(
                    "https://online-certificate-verification-owsv.onrender.com/api/auth/login",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                email: email,

                                password: password

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


                // Save JWT token

                localStorage.setItem(
                    "token",
                    data.token
                );


                // Save user information

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.user
                    )
                );


                // Redirect according to role

                if (
                    data.user.role ===
                    "issuer"
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

            console.log(error);


            message.innerText =
                "Unable to connect to server";


            message.style.color =
                "red";

        }

    }
);
