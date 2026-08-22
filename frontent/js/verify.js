const verifyForm =
    document.getElementById("verifyForm");


// CHECK CERTIFICATE ID FROM URL

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const certificateIdFromURL =
    urlParams.get("id");


// AUTOMATIC VERIFICATION FROM QR CODE

if (certificateIdFromURL) {

    document.getElementById(
        "certificateId"
    ).value =
        certificateIdFromURL;

    verifyCertificate(
        certificateIdFromURL
    );

}


// FORM SUBMIT

verifyForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const certificateId =
            document.getElementById(
                "certificateId"
            ).value.trim();


        verifyCertificate(
            certificateId
        );

    }
);


// VERIFY CERTIFICATE

async function verifyCertificate(
    certificateId
) {

    const message =
        document.getElementById(
            "message"
        );

    const certificateResult =
        document.getElementById(
            "certificateResult"
        );


    // CHECK EMPTY ID

    if (!certificateId) {

        message.innerText =
            "Please enter Certificate ID";

        message.style.color =
            "red";

        certificateResult.innerHTML =
            "";

        return;

    }


    try {

        // RENDER BACKEND API

        const response =
            await fetch(
                "https://online-certificate-verification-owsv.onrender.com/api/certificates/verify/" +
                encodeURIComponent(
                    certificateId
                )
            );


        const data =
            await response.json();


        // CERTIFICATE VALID

        if (
            response.ok &&
            data.valid &&
            data.certificate
        ) {

            message.innerText =
                "Certificate is valid";

            message.style.color =
                "green";


            certificateResult.innerHTML = `

                <div class="certificate-card">

                    <h2>
                        Valid Certificate
                    </h2>

                    <p>
                        <strong>
                            Certificate ID:
                        </strong>

                        ${data.certificate.certificateId}

                    </p>

                    <p>
                        <strong>
                            Recipient:
                        </strong>

                        ${data.certificate.recipientName}

                    </p>

                    <p>
                        <strong>
                            Course:
                        </strong>

                        ${data.certificate.courseName}

                    </p>

                    <p>
                        <strong>
                            Email:
                        </strong>

                        ${data.certificate.recipientEmail}

                    </p>

                    <p>
                        <strong>
                            Issue Date:
                        </strong>

                        ${
                            data.certificate.issueDate
                            ? new Date(
                                data.certificate.issueDate
                            ).toLocaleDateString()
                            : "N/A"
                        }

                    </p>

                    <p>
                        <strong>
                            Expiry Date:
                        </strong>

                        ${
                            data.certificate.expiryDate
                            ? new Date(
                                data.certificate.expiryDate
                            ).toLocaleDateString()
                            : "No Expiry"
                        }

                    </p>

                    <p>
                        <strong>
                            Status:
                        </strong>

                        ${data.certificate.status || "VALID"}

                    </p>


                    <button
                        type="button"
                        onclick="viewCertificate('${data.certificate.certificateId}')"
                    >

                        View Certificate

                    </button>

                </div>

            `;

        } else {

            message.innerText =
                data.message ||
                "Certificate is not valid";

            message.style.color =
                "red";

            certificateResult.innerHTML =
                "";

        }


    } catch (error) {

        console.log(error);

        message.innerText =
            "Unable to connect to server";

        message.style.color =
            "red";

        certificateResult.innerHTML =
            "";

    }

}


// VIEW CERTIFICATE

function viewCertificate(
    certificateId
) {

    window.location.href =
        "certificate.html?id=" +
        encodeURIComponent(
            certificateId
        );

}


// Make function available
// to dynamically created button

window.viewCertificate =
    viewCertificate;
