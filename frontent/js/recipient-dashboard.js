const API_BASE_URL =
    "https://online-certificate-verification-owsv.onrender.com";


const certificatesList =
    document.getElementById(
        "certificatesList"
    );


const message =
    document.getElementById(
        "message"
    );


const userData =
    localStorage.getItem(
        "user"
    );


const token =
    localStorage.getItem(
        "token"
    );


if (!userData || !token) {

    alert(
        "Please login first."
    );

    window.location.href =
        "login.html";

} else {

    const user =
        JSON.parse(
            userData
        );


    if (
        user.role !== "recipient"
    ) {

        alert(
            "Only recipients can access this page."
        );

        window.location.href =
            "index.html";

    }


    async function getCertificates() {

        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/api/certificates/recipient/` +
                    encodeURIComponent(
                        user.email
                    ),
                    {
                        headers: {

                            "Authorization":
                                "Bearer " +
                                token

                        }
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.innerText =
                    data.message ||
                    "Failed to load certificates";

                return;

            }


            certificatesList.innerHTML =
                "";


            if (
                !data.certificates ||
                data.certificates.length === 0
            ) {

                message.innerText =
                    "No certificates found.";

                return;

            }


            message.innerText =
                "";


            data.certificates.forEach(
                (certificate) => {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "certificate-card";


                    card.innerHTML = `

                        <h2>
                            ${certificate.courseName}
                        </h2>

                        <p>
                            <strong>
                                Recipient Name:
                            </strong>

                            ${certificate.recipientName}
                        </p>

                        <p>
                            <strong>
                                Certificate ID:
                            </strong>

                            ${certificate.certificateId}
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
                                ${
                                    certificate.status ||
                                    "VALID"
                                }
                            </span>
                        </p>

                        <button
                            class="view-btn"
                            type="button"
                            onclick="viewCertificate('${certificate.certificateId}')"
                        >
                            View Certificate
                        </button>

                    `;


                    certificatesList.appendChild(
                        card
                    );

                }
            );


        } catch (error) {

            console.error(error);

            message.innerText =
                "Unable to connect to server.";

        }

    }


    function viewCertificate(
        certificateId
    ) {

        window.location.href =
            "certificate.html?id=" +
            encodeURIComponent(
                certificateId
            );

    }


    window.viewCertificate =
        viewCertificate;


    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );


                window.location.href =
                    "login.html";

            }
        );

    }


    getCertificates();

}
