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

} else {

    let user;

    try {

        user =
            JSON.parse(userData);

    } catch (error) {

        console.log(error);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        alert("Please login again.");

        window.location.href =
            "login.html";

    }


    if (user && user.role !== "recipient") {

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


            if (!token) {

                alert("Please login first.");

                window.location.href =
                    "login.html";

                return;

            }


            const response =
                await fetch(

                    "https://online-certificate-verification-owsv.onrender.com/api/certificates/recipient/"
                    + encodeURIComponent(user.email),

                    {

                        method: "GET",

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
                    data.message ||
                    "Failed to load certificates";

                message.style.color =
                    "red";

                return;

            }


            certificatesList.innerHTML = "";

            message.innerText = "";


            const certificates =
                data.certificates || [];


            if (certificates.length === 0) {

                message.innerText =
                    "No certificates found.";

                return;

            }


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
                            ${certificate.courseName || ""}
                        </h2>

                        <p>
                            <strong>
                                Recipient Name:
                            </strong>

                            ${certificate.recipientName || ""}
                        </p>

                        <p>
                            <strong>
                                Certificate ID:
                            </strong>

                            ${certificate.certificateId || ""}
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

            console.log(error);

            message.innerText =
                "Unable to connect to server.";

            message.style.color =
                "red";

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
            function (event) {

                event.preventDefault();


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
