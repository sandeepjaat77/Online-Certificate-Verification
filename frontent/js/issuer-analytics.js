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

} else {

    let user;

    try {

        user =
            JSON.parse(userData);

    } catch (error) {

        console.log(error);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        alert(
            "Please login again."
        );

        window.location.href =
            "login.html";

    }


    if (user && user.role !== "issuer") {

        alert(
            "Only issuers can access analytics."
        );

        window.location.href =
            "index.html";

    }


    async function getAnalytics() {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;

            }


            const response =
                await fetch(

                    "https://online-certificate-verification-owsv.onrender.com/api/certificates/analytics/"
                    + user.id,

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


    window.goBack =
        goBack;


    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
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

    }


    getAnalytics();

}
