const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
    {
        certificateId: {
            type: String,
            required: true,
            unique: true
        },

        recipientName: {
            type: String,
            required: true
        },

        recipientEmail: {
            type: String,
            required: true
        },

        courseName: {
            type: String,
            required: true
        },

        issuerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        issueDate: {
            type: Date,
            default: Date.now
        },

        expiryDate: {
            type: Date
        },

        status: {
            type: String,
            enum: ["VALID", "EXPIRED", "REVOKED"],
            default: "VALID"
        }
    },
    {
        timestamps: true
    }
);

const Certificate = mongoose.model(
    "Certificate",
    certificateSchema
);

module.exports = Certificate;