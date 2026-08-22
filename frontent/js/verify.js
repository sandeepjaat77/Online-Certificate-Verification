```javascript
// ==========================================
// CERTIFICATE VERIFICATION
// ==========================================

const API_URL = "https://online-certificate-verification-backend.onrender.com";

const verifyForm = document.getElementById("verifyForm");
const certificateInput = document.getElementById("certificateInput");
const verifyButton = document.getElementById("verifyButton");
const message = document.getElementById("message");
const certificateResult = document.getElementById("certificateResult");


// ==========================================
// VERIFY CERTIFICATE
// ==========================================

verifyForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const certificateId = certificateInput.value.trim();

    // Clear previous result
    message.textContent = "";
    certificateResult.innerHTML = "";

    // Check empty ID
    if (!certificateId) {

        message.textContent = "Please enter a Certificate ID.";
        message.style.color = "#dc3545";

        return;
    }


    // Disable button while checking
    verifyButton.disabled = true;
    verifyButton.innerHTML = "Verifying...";


    try {

        console.log("Verifying certificate:", certificateId);

        const response = await fetch(
            `${API_URL}/api/certificates/verify/${encodeURIComponent(certificateId)}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );


        // Try to read server response
        let data;

        try {
            data = await response.json();
        } catch (jsonError) {

            throw new Error(
                "Verification server returned an invalid response."
            );
        }


        console.log("Verification response:", data);


        // ==========================================
        // CERTIFICATE NOT FOUND / INVALID
        // ==========================================

        if (!response.ok) {

            message.textContent =
                data.message ||
                data.error ||
                "Certificate not found.";

            message.style.color = "#dc3545";

            certificateResult.innerHTML = "";

            return;
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        message.textContent = "Certificate is valid.";
        message.style.color = "#198754";


        const certificate = data.certificate || data;


        certificateResult.innerHTML = `

            <div class="verification-success">

                <div class="success-icon">
                    ✓
                </div>

                <h2>Certificate Verified</h2>

                <p class="success-text">
                    This certificate has been successfully verified
                    and is authentic.
                </p>


                <div class="certificate-details">

                    <div class="detail-row">
                        <span>Certificate ID</span>
                        <strong>
                            ${certificate.certificateId || certificate.id || certificateId}
                        </strong>
                    </div>


                    <div class="detail-row">
                        <span>Recipient</span>
                        <strong>
                            ${certificate.recipientName || certificate.recipient || "N/A"}
                        </strong>
                    </div>


                    <div class="detail-row">
                        <span>Course</span>
                        <strong>
                            ${certificate.courseName || certificate.course || "N/A"}
                        </strong>
                    </div>


                    <div class="detail-row">
                        <span>Email</span>
                        <strong>
                            ${certificate.recipientEmail || certificate.email || "N/A"}
                        </strong>
                    </div>


                    <div class="detail-row">
                        <span>Issue Date</span>
                        <strong>
                            ${formatDate(certificate.issueDate)}
                        </strong>
                    </div>


                    <div class="detail-row">
                        <span>Expiry Date</span>
                        <strong>
                            ${formatDate(certificate.expiryDate)}
                        </strong>
                    </div>


                    <div class="detail-row">
                        <span>Status</span>

                        <strong class="status-valid">
                            VALID
                        </strong>
                    </div>

                </div>


                <a
                    class="view-certificate-btn"
                    href="certificate.html?id=${encodeURIComponent(
                        certificate.certificateId || certificate.id || certificateId
                    )}"
                >
                    View Certificate
                </a>

            </div>

        `;


    } catch (error) {

        console.error("Verification error:", error);


        // ==========================================
        // SERVER CONNECTION ERROR
        // ==========================================

        message.textContent =
            "Unable to connect to verification server.";

        message.style.color = "#dc3545";


        certificateResult.innerHTML = `

            <div class="verification-error">

                <div class="error-icon">
                    !
                </div>

                <h2>Verification Failed</h2>

                <p>
                    We could not connect to the verification server.
                    Please try again in a few moments.
                </p>

            </div>

        `;

    } finally {

        // Enable button again
        verifyButton.disabled = false;
        verifyButton.innerHTML = "Verify Certificate";

    }

});


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    if (!date) {
        return "N/A";
    }

    try {

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        });

    } catch (error) {

        return date;

    }

}
```
