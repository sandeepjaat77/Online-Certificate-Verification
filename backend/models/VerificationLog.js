const mongoose = require("mongoose");

const verificationLogSchema = new mongoose.Schema(
    {
        certificateId: {
            type: String,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: [
                "VALID",
                "EXPIRED",
                "REVOKED",
                "NOT_FOUND"
            ]
        },

        verifiedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "VerificationLog",
    verificationLogSchema
);