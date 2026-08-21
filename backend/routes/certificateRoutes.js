const express = require("express");
const Certificate = require("../models/Certificate");
const authMiddleware = require("../middleware/authMiddleware");
const VerificationLog = require("../models/VerificationLog");

const router = express.Router();

// CREATE CERTIFICATE

router.post("/", authMiddleware, async (req, res) => {

    try {

        const {
            recipientName,
            recipientEmail,
            courseName,
            expiryDate
        } = req.body;


        // Check logged-in user is issuer

        if (req.user.role !== "issuer") {

            return res.status(403).json({

                message:
                    "Only issuers can create certificates"

            });

        }


        // Generate unique certificate ID

        const certificateId =
            "CERT-" + Date.now();


        // Create certificate

        const certificate =
            await Certificate.create({

                certificateId,

                recipientName,

                recipientEmail,

                courseName,

                // Get issuer ID
                // from verified JWT

                issuerId:
                    req.user.id,

                expiryDate

            });


        res.status(201).json({

            message:
                "Certificate created successfully",

            certificate

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            message:
                "Certificate creation failed",

            error:
                error.message

        });

    }

});


// GET ALL CERTIFICATES OF AN ISSUER

router.get(
    "/issuer/:issuerId",
    authMiddleware,
    async (req, res) => {

        try {

            // Check logged-in user is issuer

            if (req.user.role !== "issuer") {

                return res.status(403).json({

                    message:
                        "Only issuers can access this page"

                });

            }


            // Check issuer ID belongs
            // to logged-in user

            if (
                req.params.issuerId !==
                req.user.id
            ) {

                return res.status(403).json({

                    message:
                        "You are not allowed to view these certificates"

                });

            }


            // Find certificates
            // of logged-in issuer

            const certificates =
                await Certificate.find({

                    issuerId:
                        req.user.id

                }).sort({

                    createdAt:
                        -1

                });


            res.status(200).json({

                message:
                    "Certificates fetched successfully",

                certificates

            });


        } catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Failed to fetch certificates",

                error:
                    error.message

            });

        }

    }
);


// GET ALL CERTIFICATES OF A RECIPIENT

router.get(
    "/recipient/:recipientEmail",
    authMiddleware,
    async (req, res) => {

        try {

            // Check logged-in user is recipient

            if (req.user.role !== "recipient") {

                return res.status(403).json({

                    message:
                        "Only recipients can access this page"

                });

            }


            // Check email belongs
            // to logged-in user

            if (
                req.params.recipientEmail !==
                req.user.email
            ) {

                return res.status(403).json({

                    message:
                        "You are not allowed to view these certificates"

                });

            }


            // Find certificates
            // of logged-in recipient

            const certificates =
                await Certificate.find({

                    recipientEmail:
                        req.user.email

                }).sort({

                    createdAt:
                        -1

                });


            res.status(200).json({

                message:
                    "Certificates fetched successfully",

                certificates

            });


        } catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Failed to fetch certificates",

                error:
                    error.message

            });

        }

    }
);


// VERIFY CERTIFICATE

router.get(
    "/verify/:certificateId",
    async (req, res) => {

        try {

            // Get certificate ID
            // and remove extra spaces

            const certificateId =
                req.params.certificateId.trim();


            // Find certificate

            const certificate =
                await Certificate.findOne({

                    certificateId:
                        certificateId

                });


            // Certificate not found

            if (!certificate) {

                // Save verification log

                await VerificationLog.create({

                    certificateId:
                        certificateId,

                    status:
                        "NOT_FOUND"

                });


                return res.status(404).json({

                    message:
                        "Certificate not found",

                    valid:
                        false

                });

            }


            // Check expiry date

            if (
                certificate.expiryDate &&
                new Date(
                    certificate.expiryDate
                ) < new Date()
            ) {

                // Save verification log

                await VerificationLog.create({

                    certificateId:
                        certificate.certificateId,

                    status:
                        "EXPIRED"

                });


                return res.status(200).json({

                    message:
                        "Certificate has expired",

                    valid:
                        false,

                    certificate

                });

            }


            // Save successful verification log

            await VerificationLog.create({

                certificateId:
                    certificate.certificateId,

                status:
                    "VALID"

            });


            // Certificate is valid

            return res.status(200).json({

                message:
                    "Certificate is valid",

                valid:
                    true,

                certificate

            });


        } catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Certificate verification failed",

                error:
                    error.message

            });

        }

    }
);
// ========================================
// ISSUER ANALYTICS
// ========================================

router.get(
    "/analytics/:issuerId",
    authMiddleware,
    async (req, res) => {

        try {

            // Check logged-in user is issuer

            if (req.user.role !== "issuer") {

                return res.status(403).json({

                    message:
                        "Only issuers can view analytics"

                });

            }


            // Check issuer ID

            if (
                req.params.issuerId
                !== req.user.id
            ) {

                return res.status(403).json({

                    message:
                        "You are not allowed to view these analytics"

                });

            }


            // Get all certificates issued
            // by logged-in issuer

            const certificates =
                await Certificate.find({

                    issuerId:
                        req.user.id

                });


            // Get certificate IDs

            const certificateIds =
                certificates.map(

                    certificate =>
                        certificate.certificateId

                );


            // Get verification logs
            // for issuer certificates

            const logs =
                await VerificationLog.find({

                    certificateId:
                        {
                            $in:
                                certificateIds
                        }

                });


            // Total certificates

            const totalCertificates =
                certificates.length;


            // Total verification attempts

            const totalVerifications =
                logs.length;


            // Valid verifications

            const validVerifications =
                logs.filter(

                    log =>
                        log.status === "VALID"

                ).length;


            // Expired verifications

            const expiredVerifications =
                logs.filter(

                    log =>
                        log.status === "EXPIRED"

                ).length;


            // Not found attempts

            const notFoundVerifications =
                logs.filter(

                    log =>
                        log.status === "NOT_FOUND"

                ).length;


            // Send analytics

            res.status(200).json({

                totalCertificates,

                totalVerifications,

                validVerifications,

                expiredVerifications,

                notFoundVerifications

            });


        } catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Failed to load analytics",

                error:
                    error.message

            });

        }

    }
);

module.exports = router;