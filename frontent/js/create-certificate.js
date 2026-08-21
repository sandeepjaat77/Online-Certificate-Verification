const certificateForm = document.getElementById("certificateForm");

certificateForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const recipientName =
        document.getElementById("recipientName").value;

    const recipientEmail =
        document.getElementById("recipientEmail").value;

    const courseName =
        document.getElementById("courseName").value;

    const expiryDate =
        document.getElementById("expiryDate").value;


    const userData =
        localStorage.getItem("user");


    if (!userData) {

        alert("Please login first");

        window.location.href =
            "login.html";

        return;

    }


    const user =
        JSON.parse(userData);

    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/certificates",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({
                        recipientName,
                        recipientEmail,
                        courseName,
                        expiryDate,
                    
                    })
                }
            );


        const data =
            await response.json();


        if (response.ok) {

            const certificateId =
                data.certificate.certificateId;


            document.getElementById(
                "message"
            ).innerText =
                "Certificate created successfully! Certificate ID: "
                + certificateId;


            document.getElementById(
                "message"
            ).style.color =
                "green";


            // Generate QR Code         😒

           const verifyUrl = "http://10.97.14.53:5500/frontent/verify.html?id="
                 + certificateId;


            document.getElementById(
                "qrcode"
            ).innerHTML = "";


            new QRCode(
                document.getElementById(
                    "qrcode"
                ),
                verifyUrl
            );


            // Clear form

            certificateForm.reset();


        } else {

            document.getElementById(
                "message"
            ).innerText =
                data.message;


            document.getElementById(
                "message"
            ).style.color =
                "red";

        }


    } catch (error) {

        console.log(error);

        document.getElementById(
            "message"
        ).innerText =
            "Unable to connect to server";

        document.getElementById(
            "message"
        ).style.color =
            "red";

    }

});