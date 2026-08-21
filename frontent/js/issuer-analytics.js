
const message =
    document.getElementById("message");

const userData =
    localStorage.getItem("user");


if (!userData) {

    alert(
        "Please login first."
    );

    window.location.href =
        "login.html";

}


const user =
    JSON.parse(userData);

if (
    user.role !== "issuer"
) {

    alert(
        "Only issuers can access analytics."
    );

    window.location.href =
        "index.html";

}

async function getAnalytics() {

    try {

        // Get JWT token

        const token =
            localStorage.getItem(
                "token"
            );


        // Call analytics API

        const response =
            await fetch(

                "http://localhost:5000/api/certificates/analytics/" +
                user.id,

                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

                    }

                }

            );


        // Convert response to JSON

        const data =
            await response.json();


        if (!response.ok) {

            message.innerText =
                data.message ||
                "Failed to load analytics";

            message.style.color =
                "red";

            return;

        }

        document.getElementById(
            "totalCertificates"
        ).innerText =
            data.totalCertificates;


        document.getElementById(
            "totalVerifications"
        ).innerText =
            data.totalVerifications;

        document.getElementById(
            "validVerifications"
        ).innerText =
            data.validVerifications;


        document.getElementById(
            "expiredVerifications"
        ).innerText =
            data.expiredVerifications;


        message.innerText =
            "";


    } catch (error) {

        console.log(error);

        message.innerText =
            "Unable to connect to server";

        message.style.color =
            "red";

    }

}

function goBack() {

    window.location.href =
        "issuer-dashboard.html";

}

document
    .getElementById(
        "logoutBtn"
    )
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


getAnalytics();