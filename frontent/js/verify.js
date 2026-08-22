document.addEventListener("DOMContentLoaded", () => {

    const verifyForm = document.getElementById("verifyForm");
    const certificateInput = document.getElementById("certificateInput");
    const verifyButton = document.getElementById("verifyButton");
    const message = document.getElementById("message");
    const certificateResult = document.getElementById("certificateResult");

    console.log("verify.js loaded successfully");

    if (!verifyForm) {
        console.error("verifyForm not found");
        return;
    }

    verifyForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const certificateId = certificateInput.value.trim();

        console.log("Verify clicked:", certificateId);

        if (!certificateId) {

            message.textContent = "Please enter a Certificate ID.";
            message.style.color = "#dc3545";

            return;
        }

        verifyButton.disabled = true;
        verifyButton.innerHTML = "Verifying...";

        message.textContent = "";
        certificateResult.innerHTML = "";

        try {

            /*
             * IMPORTANT:
             * Change this URL only if your backend uses
             * a different verification endpoint.
             */

            const response = await fetch(
                `https://online-certificate-verification-backend.onrender.com/api/certificates/verify/${encodeURIComponent(certificateId)}`
            );

            const data = await response.json();

            console.log("Backend response:", data);

            if (!response.ok) {

                throw new Error(
                    data.message || "Certificate verification failed."
                );
            }

            message.textContent = "Certificate is valid";
            message.style.color = "#198754";

            certificateResult.innerHTML = `

                <div class="certificate-result-card">

                    <div class="result-header">

                        <div class="success-icon">
                            ✓
                        </div>

                        <div>
                            <h2>Valid Certificate</h2>
                            <p>
                                This certificate has been successfully verified.
                            </p>
                        </div>

                    </div>

                    <div class="certificate-details">

                        <div class="detail-row">
                            <span>Certificate ID</span>
                            <strong>
                                ${data.certificateId || certificateId}
                            </strong>
                        </div>

                        <div class="detail-row">
                            <span>Recipient</span>
                            <strong>
                                ${data.recipientName || data.recipient || "-"}
                            </strong>
                        </div>

                        <div class="detail-row">
                            <span>Course</span>
                            <strong>
                                ${data.courseName || data.course || "-"}
                            </strong>
                        </div>

                        <div class="detail-row">
                            <span>Email</span>
                            <strong>
                                ${data.recipientEmail || data.email || "-"}
                            </strong>
                        </div>

                        <div class="detail-row">
                            <span>Issue Date</span>
                            <strong>
                                ${data.issueDate || "-"}
                            </strong>
                        </div>

                        <div class="detail-row">
                            <span>Expiry Date</span>
                            <strong>
                                ${data.expiryDate || "-"}
                            </strong>
                        </div>

                        <div class="detail-row">
                            <span>Status</span>
                            <strong class="valid-status">
                                ${data.status || "VALID"}
                            </strong>
                        </div>

                    </div>

                </div>
            `;

        } catch (error) {

            console.error("Verification error:", error);

            message.textContent =
                error.message || "Unable to verify certificate.";

            message.style.color = "#dc3545";

            certificateResult.innerHTML = `
                <div class="certificate-error">

                    <div class="error-icon">
                        !
                    </div>

                    <h2>Certificate Not Found</h2>

                    <p>
                        We could not verify this certificate.
                        Please check the Certificate ID and try again.
                    </p>

                </div>
            `;

        } finally {

            verifyButton.disabled = false;
            verifyButton.innerHTML = `
                <span>Verify Certificate</span>
            `;
        }

    });

});
