const API_BASE_URL =
    "https://online-certificate-verification-owsv.onrender.com";


// Get certificate ID from URL
const params =
    new URLSearchParams(window.location.search);

const certificateId =
    params.get("id");


async function loadCertificate() {

    const message =
        document.getElementById("message");

    const certificateElement =
        document.getElementById("certificate");

    const certificateIdElement =
        document.getElementById("certificateId");

    const qrCodeElement =
        document.getElementById("qrcode");


    // Check certificate ID
    if (!certificateId) {

        message.innerText =
            "Certificate ID is missing";

        message.style.color =
            "red";

        certificateElement.style.display =
            "none";

        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/api/certificates/verify/" +
                encodeURIComponent(certificateId)
            );


        const data =
            await response.json();


        console.log(
            "API Response:",
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


        // Show certificate
        certificateElement.style.display =
            "block";


        // Certificate ID
        certificateIdElement.innerText =
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


        // Remove loading message
        message.innerText = "";


        // =========================
        // GENERATE QR CODE
        // =========================

        qrCodeElement.innerHTML = "";


        const verificationUrl =
            window.location.origin +
            "/verify.html?id=" +
            encodeURIComponent(
                certificate.certificateId ||
                certificateId
            );


        if (
            typeof QRCode ===
            "undefined"
        ) {

            qrCodeElement.innerHTML = `
                <p style="color:red;">
                    QR Code library not loaded.
                </p>
            `;

            return;
        }


        new QRCode(
            qrCodeElement,
            {
                text:
                    verificationUrl,

                width:
                    150,

                height:
                    150
            }
        );


    } catch (error) {

        console.error(
            "Certificate error:",
            error
        );


        message.innerText =
            "Unable to connect to server";

        message.style.color =
            "red";
    }
}


// PRINT
function printCertificate() {

    window.print();

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


    const id =
        certificateIdElement.innerText ||
        "certificate";


    const options = {

        margin: 0,

        filename:
            "Certificate-" +
            id +
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


// Start
loadCertificate();
