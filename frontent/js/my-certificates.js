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


const searchInput =
    document.getElementById(
        "searchInput"
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
        user.role !== "issuer"
    ) {

        alert(
            "Only issuers can access this page."
        );

        window.location.href =
            "index.html";

    }


    let allCertificates = [];


    async function getCertificates() {

        try {

            const issuerId =
                user.id ||
                user._id;


            const response =
                await fetch(
                    `${API_BASE_URL}/api/certificates/issuer/` +
                    encodeURIComponent(
                        issuerId
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


            allCertificates =
                data.certificates || [];


            displayCertificates(
                allCertificates
            );


        } catch (error) {

            console.error(error);

            message.innerText =
                "Unable to connect to server.";

        }

    }


    function displayCertificates(
        certificates
    ) {

        certificatesList.innerHTML =
            "";


        if (
            certificates.length === 0
        ) {

            message.innerText =
                "No certificates found.";

            return;

        }


        message.innerText =
            "";


        certificates.forEach(
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

    }


    searchInput.addEventListener(
        "input",
        () => {

            const searchText =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const filteredCertificates =
                allCertificates.filter(
                    (certificate) => {

                        return (

                            String(
                                certificate.certificateId ||
                                ""
                            )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                            ||

                            String(
                                certificate.recipientName ||
                                ""
                            )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                            ||

                            String(
                                certificate.recipientEmail ||
                                ""
                            )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                            ||

                            String(
                                certificate.courseName ||
                                ""
                            )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        );

                    }
                );


            displayCertificates(
                filteredCertificates
            );

        }
    );


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
