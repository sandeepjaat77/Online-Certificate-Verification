const express = require("express");

const Certificate =
    require("../models/Certificate");

const VerificationLog =
    require("../models/VerificationLog");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// GET ISSUER ANALYTICS
// ========================================

router.get(
    "/issuer/:issuerId",
    authMiddleware,
    async (req, res) => {

        try {

            // Check role

            if (
                req.user.role !== "issuer"
            ) {

                return res.status(403).json({

                    message:
                        "Only issuers can access analytics"

                });

            }


            // Check issuer ID

            if (
                req.params.issuerId !==
                req.user.id
            ) {

                return res.status(403).json({

                    message:
                        "You are not allowed to view these analytics"

                });

            }


            // Total certificates

            const totalCertificates =
                await Certificate.countDocuments({

                    issuerId:
                        req.user.id

                });


            // Get certificates

            const certificates =
                await Certificate.find({

                    issuerId:
                        req.user.id

                }).select(
                    "certificateId"
                );


            // Certificate IDs

            const certificateIds =
                certificates.map(
                    (certificate) =>
                        certificate.certificateId
                );


            // Total verifications

            const totalVerifications =
                await VerificationLog.countDocuments({

                    certificateId: {
                        $in:
                            certificateIds
                    }

                });


            // Valid verifications

            const validVerifications =
                await VerificationLog.countDocuments({

                    certificateId: {
                        $in:
                            certificateIds
                    },

                    status:
                        "VALID"

                });


            // Expired verifications

            const expiredVerifications =
                await VerificationLog.countDocuments({

                    certificateId: {
                        $in:
                            certificateIds
                    },

                    status:
                        "EXPIRED"

                });


            // Response

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
