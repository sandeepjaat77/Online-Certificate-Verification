const API_BASE_URL =
    "https://online-certificate-verification-owsv.onrender.com";


// GET CERTIFICATE ID FROM URL

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const certificateId =
    urlParams.get("id");


// PAGE ELEMENTS

const message =
    document.getElementById("message");

const recipientName =
    document.getElementById("recipientName");

const courseName =
    document.getElementById("courseName");

const certificateIdElement =
    document.getElementById("certificateId");

const issueDate =
    document.getElementById("issueDate");

const expiryDate =
    document.getElementById("expiryDate");

const status =
    document.getElementById("status");

const qrCode =
    document.getElementById("qrcode");


// CHECK CERTIFICATE ID

if (!certificateId) {

    message.innerText =
        "Certificate ID is missing";

    message.style.color =
        "red";

} else {

    loadCertificate();

}


// LOAD CERTIFICATE

async function loadCertificate() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/certificates/verify/${encodeURIComponent(certificateId)}`
            );


        const data =
            await response.json();


        if (
            response.ok &&
            data.valid &&
            data.certificate
        ) {

            const certificate =
                data.certificate;


            // CERTIFICATE ID

            certificateIdElement.innerText =
                certificate.certificateId;


            // RECIPIENT

            recipientName.innerText =
                certificate.recipientName;


            // COURSE

            courseName.innerText =
                certificate.courseName;


            // ISSUE DATE

            issueDate.innerText =
                certificate.issueDate
                    ? new Date(
                        certificate.issueDate
                    ).toLocaleDateString()
                    : "N/A";


            // EXPIRY DATE

            expiryDate.innerText =
                certificate.expiryDate
                    ? new Date(
                        certificate.expiryDate
                    ).toLocaleDateString()
                    : "No Expiry";


            // STATUS

            status.innerText =
                certificate.status;


            // MESSAGE

            message.innerText =
                "Certificate is valid";

            message.style.color =
                "green";


            // GENERATE QR CODE

            if (qrCode) {

                qrCode.innerHTML = "";

                const verifyUrl =
                    window.location.origin +
                    "/verify.html?id=" +
                    encodeURIComponent(
                        certificate.certificateId
                    );


                new QRCode(
                    qrCode,
                    {
                        text: verifyUrl,

                        width: 150,

                        height: 150
                    }
                );

            }

        } else {

            message.innerText =
                data.message ||
                "Certificate is not valid";

            message.style.color =
                "red";

        }


    } catch (error) {

        console.error(error);

        message.innerText =
            "Unable to connect to server";

        message.style.color =
            "red";

    }

}


// PRINT CERTIFICATE

function printCertificate() {

    window.print();

}


// DOWNLOAD PDF

function downloadCertificate() {

    const certificate =
        document.getElementById(
            "certificate"
        );


    html2pdf()
        .from(certificate)
        .save(
            `certificate-${certificateId}.pdf`
        );

}
