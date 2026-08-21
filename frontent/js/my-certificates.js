const certificatesList = document.getElementById("certificatesList");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");

const userData = localStorage.getItem("user");

if (!userData) {
    alert("Please login first.");
    window.location.href = "login.html";
}

const user = JSON.parse(userData);

if (user.role !== "issuer") {
    alert("Only issuers can access this page.");
    window.location.href = "index.html";
}

let allCertificates = [];

async function getCertificates() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://10.97.14.53:5000/api/certificates/issuer/" + user.id,
            {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.innerText = data.message;
            return;
        }

        allCertificates =
            data.certificates;

        displayCertificates(
            allCertificates
        );

    } catch (error) {

        console.log(error);

        message.innerText =
            "Unable to connect to server.";

    }

}

function displayCertificates(
    certificates
) {

    certificatesList.innerHTML = "";

    if (certificates.length === 0) {

        message.innerText =
            "No certificates found.";

        return;

    }

    message.innerText = "";

    certificates.forEach(
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
                        Recipient Email:
                    </strong>
                    ${certificate.recipientEmail}
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

}

searchInput.addEventListener(
    "input",
    function () {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();

        const filteredCertificates =
            allCertificates.filter(
                (certificate) => {

                    return (

                        certificate.certificateId
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        certificate.recipientName
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        certificate.recipientEmail
                            .toLowerCase()
                            .includes(searchText)

                        ||

                        certificate.courseName
                            .toLowerCase()
                            .includes(searchText)

                    );

                }
            );

        displayCertificates(
            filteredCertificates
        );

    }
);

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