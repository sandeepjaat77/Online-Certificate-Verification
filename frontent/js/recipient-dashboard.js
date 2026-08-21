const certificatesList =
    document.getElementById("certificatesList");

const message =
    document.getElementById("message");

const userData =
    localStorage.getItem("user");

if (!userData) {

    alert("Please login first.");

    window.location.href =
        "login.html";

}

const user =
    JSON.parse(userData);

if (user.role !== "recipient") {

    alert(
        "Only recipients can access this page."
    );

    window.location.href =
        "index.html";

}

async function getCertificates() {

    try {

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(
                "http://10.97.14.53:5000/api/certificates/recipient/" +
                user.email,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            message.innerText =
                data.message;

            return;

        }

        message.innerText = "";

        if (
            data.certificates.length === 0
        ) {

            message.innerText =
                "No certificates found.";

            return;

        }

        data.certificates.forEach(
            (certificate) => {

                const card =
                    document.createElement("div");

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
                            new Date(
                                certificate.issueDate
                            ).toLocaleDateString()
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
                            ${certificate.status}
                        </span>
                    </p>

                    <button
                        class="view-btn"
                        onclick="viewCertificate(
                            '${certificate.certificateId}'
                        )"
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

        console.log(error);

        message.innerText =
            "Unable to connect to server.";

    }

}

getCertificates();

function viewCertificate(
    certificateId
) {

    window.location.href =
        "certificate.html?id=" +
        certificateId;

}

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function () {

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