const API_BASE_URL =
    "https://online-certificate-verification-owsv.onrender.com";

const certificateForm =
    document.getElementById("certificateForm");

const message =
    document.getElementById("message");

const qrCodeContainer =
    document.getElementById("qrcode");

const certificateIdContainer =
    document.getElementById("certificateIdResult");


certificateForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // GET FORM VALUES

        const recipientName =
            document.getElementById("recipientName")
                .value
                .trim();

        const recipientEmail =
            document.getElementById("recipientEmail")
                .value
                .trim();

        const courseName =
            document.getElementById("courseName")
                .value
                .trim();

        const expiryDate =
            document.getElementById("expiryDate")
                .value;


        // CHECK LOGIN

        const userData =
            localStorage.getItem("user");

        const token =
            localStorage.getItem("token");


        if (!userData || !token) {

            alert("Please login first.");

            window.location.href =
                "login.html";

            return;
        }


        // CHECK ROLE

        const user =
            JSON.parse(userData);


        if (user.role !== "issuer") {

            alert(
                "Only issuers can create certificates."
            );

            window.location.href =
                "index.html";

            return;
        }


        try {

            // CREATE CERTIFICATE

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

                        body: JSON.stringify({

                            recipientName:
                                recipientName,

                            recipientEmail:
                                recipientEmail,

                            courseName:
                                courseName,

                            expiryDate:
                                expiryDate

                        })
                    }
                );


            const data =
                await response.json();


            // ERROR

            if (!response.ok) {

                message.innerText =
                    data.message ||
                    "Failed to create certificate";

                message.style.color =
                    "red";

                return;
            }


            // GET CREATED CERTIFICATE

            const certificate =
                data.certificate;


            const certificateId =
                certificate.certificateId;


            // SUCCESS MESSAGE

            message.innerText =
                "Certificate created successfully!";

            message.style.color =
                "green";


            // SHOW CERTIFICATE ID

            if (certificateIdContainer) {

                certificateIdContainer.innerHTML = `

                    <div class="certificate-result">

                        <h2>
                            Certificate Created Successfully
                        </h2>

                        <p>
                            <strong>
                                Certificate ID:
                            </strong>
                        </p>

                        <p class="certificate-id">
                            ${certificateId}
                        </p>

                    </div>

                `;
            }


            // CREATE VERIFY URL

            const verifyUrl =
                window.location.origin +
                "/verify.html?id=" +
                encodeURIComponent(
                    certificateId
                );


            // CREATE QR CODE

            if (qrCodeContainer) {

                qrCodeContainer.innerHTML = "";

                if (
                    typeof QRCode ===
                    "undefined"
                ) {

                    qrCodeContainer.innerHTML = `

                        <p style="color:red;">
                            QR Code library not loaded.
                        </p>

                    `;

                } else {

                    new QRCode(
                        qrCodeContainer,
                        {
                            text: verifyUrl,

                            width: 180,

                            height: 180
                        }
                    );

                }
            }


            // SHOW VERIFY LINK

            let verifyLink =
                document.getElementById(
                    "verifyLink"
                );


            if (verifyLink) {

                verifyLink.href =
                    verifyUrl;

                verifyLink.innerText =
                    "Verify Certificate";

                verifyLink.target =
                    "_blank";
            }


            // RESET FORM

            certificateForm.reset();


        } catch (error) {

            console.error(
                "Certificate creation error:",
                error
            );

            message.innerText =
                "Unable to connect to server";

            message.style.color =
                "red";
        }

    }
);
