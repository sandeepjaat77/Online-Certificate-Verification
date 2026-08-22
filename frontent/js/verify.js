```javascript
const API_BASE_URL =
    "https://online-certificate-verification-owsv.onrender.com";


const verifyForm =
    document.getElementById("verifyForm");

const certificateInput =
    document.getElementById("certificateInput");

const message =
    document.getElementById("message");

const certificateResult =
    document.getElementById("certificateResult");


verifyForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const certificateId =
            certificateInput.value.trim();


        if (!certificateId) {

            message.innerText =
                "Please enter Certificate ID.";

            message.style.color =
                "red";

            return;

        }


        message.innerText =
            "Verifying certificate...";

        message.style.color =
            "#2563eb";


        certificateResult.innerHTML =
            "";


        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/certificates/verify/${encodeURIComponent(certificateId)}`
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.innerText =
                    data.message ||
                    "Certificate not found.";

                message.style.color =
                    "red";

                return;

            }


            if (
                data.valid === true &&
                data.certificate
            ) {

                const certificate =
                    data.certificate;


                message.innerText =
                    "Certificate is valid";

                message.style.color =
                    "green";


                certificateResult.innerHTML = `

                    <div class="certificate-card">

                        <h2>
                            ✓ Valid Certificate
                        </h2>

                        <p>
                            <strong>
                                Certificate ID:
                            </strong>
                            ${certificate.certificateId}
                        </p>

                        <p>
                            <strong>
                                Recipient:
                            </strong>
                            ${certificate.recipientName}
                        </p>

                        <p>
                            <strong>
                                Course:
                            </strong>
                            ${certificate.courseName}
                        </p>

                        <p>
                            <strong>
                                Email:
                            </strong>
                            ${certificate.recipientEmail}
                        </p>

                        <p>
                            <strong>
                                Issue Date:
                            </strong>
                            ${
                                certificate.issueDate
                                ? new Date(
                                    certificate.issueDate
                                ).toLocaleDateString()
                                : "N/A"
                            }
                        </p>

                        <p>
                            <strong>
                                Expiry Date:
                            </strong>
                            ${
                                certificate.expiryDate
                                ? new Date(
                                    certificate.expiryDate
                                ).toLocaleDateString()
                                : "No Expiry"
                            }
                        </p>

                        <p>
                            <strong>
                                Status:
                            </strong>

                            <span class="certificate-status">
                                ${certificate.status || "VALID"}
                            </span>
                        </p>

                    </div>

                `;

            } else {

                message.innerText =
                    data.message ||
                    "Certificate is not valid.";

                message.style.color =
                    "red";

            }


        } catch (error) {

            console.error(error);

            message.innerText =
                "Unable to connect to verification server.";

            message.style.color =
                "red";

        }

    }
);
```
