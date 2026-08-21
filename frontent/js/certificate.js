const params =new URLSearchParams(window.location.search);
const certificateId =params.get("id");

async function loadCertificate() {

if (!certificateId) {
alert("Certificate ID is missing");
return;
}

try {
const response =
    await fetch(
        "http://localhost:5000/api/certificates/verify/"
        + certificateId
    );

const data =
    await response.json();

if (!data.certificate) {
    alert("Certificate not found");
    return;
}

const certificate = data.certificate;

document.getElementById("recipientName").innerText =
    certificate.recipientName;

document.getElementById("courseName").innerText =
    certificate.courseName;

document.getElementById("certificateId").innerText =
    certificate.certificateId;

document.getElementById("issueDate").innerText =
    new Date(certificate.issueDate).toLocaleDateString();

document.getElementById("expiryDate").innerText =
    certificate.expiryDate
        ? new Date(certificate.expiryDate).toLocaleDateString()
        : "No Expiry";

// Status

document.getElementById("status").innerText =
    data.valid
        ? "VALID"
        : data.message;

// Generate QR Code

const verificationUrl =
    "http://10.97.14.53:5500/verify.html?id="
    + certificate.certificateId;

new QRCode(
    document.getElementById("qrcode"),
    {
        text: verificationUrl,
        width: 150,
        height: 150
    }
);

} catch (error) {

console.log(error);

alert(
    "Unable to load certificate"
);

}
}

function downloadCertificate() {

    const certificate =
        document.querySelector(".certificate");

    const options = {

        margin: 0,

        filename:
            "Certificate-" +
            document.getElementById(
                "certificateId"
            ).innerText +
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
        .toPdf()
        .get("pdf")
        .then(function(pdf) {

            const pageWidth =
                pdf.internal.pageSize.getWidth();

            const pageHeight =
                pdf.internal.pageSize.getHeight();

            console.log(
                "PDF Page:",
                pageWidth,
                pageHeight
            );

        })
        .save();

}
function printCertificate() {

    window.print();

}

loadCertificate();