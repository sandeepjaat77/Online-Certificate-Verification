const API_BASE_URL =
    "https://online-certificate-verification-owsv.onrender.com";


const params =
    new URLSearchParams(
        window.location.search
    );


const certificateId =
    params.get("id");


async function loadCertificate() {

    if (!certificateId) {

        alert(
            "Certificate ID is missing"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/certificates/verify/` +
                encodeURIComponent(
                    certificateId
                )
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.certificate
        ) {

            alert(
                data.message ||
                "Certificate not found"
            );

            return;

        }


        const certificate =
            data.certificate;


        document.getElementById(
            "recipientName"
        ).innerText =
            certificate.recipientName;


        document.getElementById(
            "courseName"
        ).innerText =
            certificate.courseName;


        document.getElementById(
            "certificateId"
        ).innerText =
            certificate.certificateId;


        document.getElementById(
            "issueDate"
        ).innerText =
            certificate.issueDate
            ? new Date(
                certificate.issueDate
            ).toLocaleDateString()
            : "N/A";


        document.getElementById(
            "expiryDate"
        ).innerText =
            certificate.expiryDate
            ? new Date(
                certificate.expiryDate
            ).toLocaleDateString()
            : "No Expiry";


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


        /*
            QR CODE

            Use current frontend URL.
            No localhost.
            No local IP.
        */

        const verificationUrl =
            window.location.origin +
            "/verify.html?id=" +
            encodeURIComponent(
                certificate.certificateId
            );


        const qrContainer =
            document.getElementById(
                "qrcode"
            );


        if (qrContainer) {

            qrContainer.innerHTML =
                "";

            new QRCode(
                qrContainer,
                {
                    text:
                        verificationUrl,

                    width: 150,

                    height: 150
                }
            );

        }


        const certificateElement =
            document.getElementById(
                "certificate"
            );


        const loadingMessage =
            document.getElementById(
                "message"
            );


        if (certificateElement) {

            certificateElement.style.display =
                "block";

        }


        if (loadingMessage) {

            loadingMessage.style.display =
                "none";

        }


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load certificate"
        );

    }

}


function downloadCertificate() {

    const certificate =
        document.querySelector(
            ".certificate"
        );


    if (!certificate) {

        alert(
            "Certificate not available"
        );

        return;

    }


    const certificateIdElement =
        document.getElementById(
            "certificateId"
        );


    const certificateIdText =
        certificateIdElement
        ? certificateIdElement.innerText
        : "Certificate";


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

            orientation:
                "landscape"

        },

        pagebreak: {

            mode:
                "avoid-all"

        }

    };


    html2pdf()
        .set(options)
        .from(certificate)
        .save();

}


function printCertificate() {

    window.print();

}


loadCertificate();
