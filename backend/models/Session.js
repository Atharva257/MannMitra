import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        scheduledAt: {
            type: Date,
            required: true,
        },

        duration: {
            type: Number, // in minutes
            default: 30,
        },
            
        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],
            default: "scheduled",
        },
        
        meetingRoomId: {
            type: String, // Legacy/Custom Room ID
        },

        meetingLink: {
            type: String, // Google Meet Link
        },

        calendarEventId: {
            type: String, // Google Calendar Event ID
        },
        
        notes: {
            type: String,
        },
    },
    { timestamps: true}
);

export default mongoose.model("Session", sessionSchema);
