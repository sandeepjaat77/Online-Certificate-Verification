const API_BASE_URL =
    "https://online-certificate-verification-owsv.onrender.com";


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

            const issuerId =
                user.id ||
                user._id;


            const response =
                await fetch(
                    `${API_BASE_URL}/api/certificates/analytics/` +
                    encodeURIComponent(
                        issuerId
                    ),
                    {
                        method: "GET",

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
                    "Failed to load analytics";

                message.style.color =
                    "red";

                return;

            }


            document.getElementById(
                "totalCertificates"
            ).innerText =
                data.totalCertificates || 0;


            document.getElementById(
                "totalVerifications"
            ).innerText =
                data.totalVerifications || 0;


            document.getElementById(
                "validVerifications"
            ).innerText =
                data.validVerifications || 0;


            document.getElementById(
                "expiredVerifications"
            ).innerText =
                data.expiredVerifications || 0;


            message.innerText =
                "";


        } catch (error) {

            console.error(error);

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


    window.goBack =
        goBack;


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


    getAnalytics();

}
