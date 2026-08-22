const API_BASE_URL =
    "https://online-certificate-verification-owsv.onrender.com";


const certificateForm =
    document.getElementById(
        "certificateForm"
    );

const message =
    document.getElementById(
        "message"
    );

const qrCodeContainer =
    document.getElementById(
        "qrcode"
    );


certificateForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const recipientName =
            document.getElementById(
                "recipientName"
            )
            .value
            .trim();


        const recipientEmail =
            document.getElementById(
                "recipientEmail"
            )
            .value
            .trim();


        const courseName =
            document.getElementById(
                "courseName"
            )
            .value
            .trim();


        const expiryDate =
            document.getElementById(
                "expiryDate"
            )
            .value;


        const userData =
            localStorage.getItem("user");


        const token =
            localStorage.getItem("token");


        if (!userData || !token) {

            alert(
                "Please login first."
            );

            window.location.href =
                "login.html";

            return;

        }


        const user =
            JSON.parse(userData);


        if (
            user.role !== "issuer"
        ) {

            alert(
                "Only issuers can create certificates."
            );

            window.location.href =
                "index.html";

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/certificates`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token

                        },

                        body:
                            JSON.stringify({

                                recipientName,

                                recipientEmail,

                                courseName,

                                expiryDate

                            })

                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                const certificate =
                    data.certificate;


                const certificateId =
                    certificate.certificateId;


                message.innerText =
                    "Certificate created successfully! Certificate ID: " +
                    certificateId;

                message.style.color =
                    "green";


                /*
                    IMPORTANT:
                    Use the current frontend domain.
                    This works after deploying frontend
                    without hard-coding an IP address.
                */

                const verifyUrl =
                    window.location.origin +
                    "/verify.html?id=" +
                    encodeURIComponent(
                        certificateId
                    );


                if (qrCodeContainer) {

                    qrCodeContainer.innerHTML =
                        "";

                    new QRCode(
                        qrCodeContainer,
                        {
                            text: verifyUrl,

                            width: 150,

                            height: 150
                        }
                    );

                }


                certificateForm.reset();


            } else {

                message.innerText =
                    data.message ||
                    "Failed to create certificate";

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
