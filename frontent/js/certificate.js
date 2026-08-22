const API_BASE_URL =
    "https://online-certificate-verification-owsv.onrender.com";

const params =
    new URLSearchParams(window.location.search);

const certificateId =
    params.get("id");


async function loadCertificate() {

    const message =
        document.getElementById("message");


    if (!certificateId) {

        message.innerText =
            "Certificate ID is missing";

        message.style.color =
            "red";

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/certificates/verify/${encodeURIComponent(certificateId)}`
            );


        const data =
            await response.json();


        console.log(
            "Certificate response:",
            data
        );


        if (
            !response.ok ||
            !data.certificate
        ) {

            message.innerText =
                data.message ||
                "Certificate not found";

            message.style.color =
                "red";

            return;
        }


        const certificate =
            data.certificate;


        // Certificate ID

        document.getElementById(
            "certificateId"
        ).innerText =
            certificate.certificateId ||
            certificateId;


        // Recipient

        document.getElementById(
            "recipientName"
        ).innerText =
            certificate.recipientName ||
            "N/A";


        // Course

        document.getElementById(
            "courseName"
        ).innerText =
            certificate.courseName ||
            "N/A";


        // Issue Date

        document.getElementById(
            "issueDate"
        ).innerText =
            certificate.issueDate
                ? new Date(
                    certificate.issueDate
                ).toLocaleDateString()
                : "N/A";


        // Expiry Date

        document.getElementById(
            "expiryDate"
        ).innerText =
            certificate.expiryDate
                ? new Date(
                    certificate.expiryDate
                ).toLocaleDateString()
                : "No Expiry";


        // Status

        document.getElementById(
            "status"
        ).innerText =
            data.valid
                ? "VALID"
                : (
                    data.message ||
                    certificate.status ||
                    "INVALID"
                );


        // Message

        message.innerText =
            "";

        message.style.color =
            "green";


        // QR CODE

        const qrCodeContainer =
            document.getElementById(
                "qrcode"
            );


        if (qrCodeContainer) {

            qrCodeContainer.innerHTML =
                "";


            const verifyUrl =
                window.location.origin +
                "/verify.html?id=" +
                encodeURIComponent(
                    certificate.certificateId
                );


            if (
                typeof QRCode !==
                "undefined"
            ) {

                new QRCode(
                    qrCodeContainer,
                    {
                        text:
                            verifyUrl,

                        width:
                            150,

                        height:
                            150
                    }
                );

            } else {

                qrCodeContainer.innerText =
                    "QR Code library not loaded";

            }

        }


    } catch (error) {

        console.error(
            "Certificate loading error:",
            error
        );


        message.innerText =
            "Unable to connect to server";

        message.style.color =
            "red";

    }

}


// DOWNLOAD PDF

function downloadCertificate() {

    const certificate =
        document.querySelector(
            ".certificate"
        );


    const certificateIdElement =
        document.getElementById(
            "certificateId"
        );


    const certificateIdText =
        certificateIdElement
            ? certificateIdElement.innerText
            : "certificate";


    const options = {

        margin: 0,

        filename:
            "Certificate-" +
            certificateIdText +
            ".pdf",

        image: {

            type: "jpeg",

            quality: 1

        },

        html2canvas: {

            scale: 2,

            useCORS: true,

            logging: false

        },

        jsPDF: {

            unit: "mm",

            format: "a4",

            orientation: "landscape"

        },

        pagebreak: {

            mode: "avoid-all"

        }

    };


    html2pdf()
        .set(options)
        .from(certificate)
        .save();

}


// PRINT

function printCertificate() {

    window.print();

}


// START

loadCertificate();
