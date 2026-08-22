const certificateForm =
    document.getElementById("certificateForm");


certificateForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const recipientName =
            document.getElementById(
                "recipientName"
            ).value.trim();


        const recipientEmail =
            document.getElementById(
                "recipientEmail"
            ).value.trim();


        const courseName =
            document.getElementById(
                "courseName"
            ).value.trim();


        const expiryDate =
            document.getElementById(
                "expiryDate"
            ).value;


        const userData =
            localStorage.getItem("user");


        if (!userData) {

            alert("Please login first");

            window.location.href =
                "login.html";

            return;

        }


        let user;

        try {

            user =
                JSON.parse(userData);

        } catch (error) {

            console.log(error);

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            alert("Please login again");

            window.location.href =
                "login.html";

            return;

        }


        const token =
            localStorage.getItem("token");


        if (!token) {

            alert("Please login first");

            window.location.href =
                "login.html";

            return;

        }


        // Only issuer can create certificates

        if (user.role !== "issuer") {

            alert(
                "Only issuers can create certificates"
            );

            window.location.href =
                "index.html";

            return;

        }


        try {

            const response =
                await fetch(
                    "https://online-certificate-verification-owsv.onrender.com/api/certificates",
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token

                        },

                        body:
                            JSON.stringify({

                                recipientName,

                                recipientEmail,

                                courseName,

                                expiryDate

                            })

                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                const certificateId =
                    data.certificate.certificateId;


                const message =
                    document.getElementById(
                        "message"
                    );


                message.innerText =
                    "Certificate created successfully! Certificate ID: "
                    + certificateId;


                message.style.color =
                    "green";


                // Generate QR Code

                const verifyUrl =
                    window.location.origin +
                    "/verify.html?id=" +
                    encodeURIComponent(
                        certificateId
                    );


                const qrCode =
                    document.getElementById(
                        "qrcode"
                    );


                qrCode.innerHTML = "";


                new QRCode(
                    qrCode,
                    {
                        text: verifyUrl,

                        width: 150,

                        height: 150
                    }
                );


                // Clear form

                certificateForm.reset();

            } else {

                const message =
                    document.getElementById(
                        "message"
                    );


                message.innerText =
                    data.message ||
                    "Certificate creation failed";


                message.style.color =
                    "red";

            }

        } catch (error) {

            console.log(error);


            const message =
                document.getElementById(
                    "message"
                );


            message.innerText =
                "Unable to connect to server";


            message.style.color =
                "red";

        }

    }
);
