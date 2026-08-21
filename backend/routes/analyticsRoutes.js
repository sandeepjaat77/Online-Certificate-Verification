const express = require("express");
const Certificate = require("../models/Certificate");
const VerificationLog = require("../models/VerificationLog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET ISSUER ANALYTICS

router.get(
    "/issuer/:issuerId",
    authMiddleware,
    async (req, res) => {

        try {

            // Check logged-in user is issuer

            if (req.user.role !== "issuer") {

                return res.status(403).json({

                    message:
                        "Only issuers can access analytics"

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
                        "You are not allowed to view these analytics"

                });

            }


            // Count total certificates
            // issued by this issuer

            const totalCertificates =
                await Certificate.countDocuments({

                    issuerId:
                        req.user.id

                });


            // Get all certificates
            // issued by this issuer

            const certificates =
                await Certificate.find({

                    issuerId:
                        req.user.id

                }).select(
                    "certificateId"
                );


            // Get certificate IDs

            const certificateIds =
                certificates.map(
                    (certificate) =>
                        certificate.certificateId
                );


            // Count total verification attempts

            const totalVerifications =
                await VerificationLog.countDocuments({

                    certificateId: {
                        $in:
                            certificateIds
                    }

                });


            // Count valid verifications

            const validVerifications =
                await VerificationLog.countDocuments({

                    certificateId: {
                        $in:
                            certificateIds
                    },

                    status:
                        "VALID"

                });


            // Count expired verifications

            const expiredVerifications =
                await VerificationLog.countDocuments({

                    certificateId: {
                        $in:
                            certificateIds
                    },

                    status:
                        "EXPIRED"

                });


            // Return analytics

            res.status(200).json({

                message:
                    "Analytics fetched successfully",

                analytics: {

                    totalCertificates,

                    totalVerifications,

                    validVerifications,

                    expiredVerifications

                }

            });


        } catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Failed to fetch analytics",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;