import User from "../models/User.js";
import Mentor from "../models/Mentor.js";
import Notification from "../models/Notification.js";

/**
 * Automatically allots a mentor to a student based on current load (Round Robin / Least Loaded)
 * @param {string} studentId 
 */
export const allotMentorToStudent = async (studentId) => {
    try {
        const student = await User.findById(studentId);
        if (!student || student.role !== "student") return;
        if (student.mentor) return; // Already allotted

        // Find all approved mentors
        const mentors = await Mentor.find({ approved: true });
        if (mentors.length === 0) return;

        // Strategy: Least Loaded (Count students assigned to each mentor)
        const mentorUsage = await User.aggregate([
            { $match: { role: "student", mentor: { $ne: null } } },
            { $group: { _id: "$mentor", count: { $sum: 1 } } }
        ]);

        const usageMap = {};
        mentorUsage.forEach(m => usageMap[m._id.toString()] = m.count);

        // Sort mentors by usage (ascending)
        mentors.sort((a, b) => (usageMap[a._id.toString()] || 0) - (usageMap[b._id.toString()] || 0));

        const selectedMentor = mentors[0];

        // Update student
        student.mentor = selectedMentor._id;
        await student.save();

        // Notify Student
        await Notification.create({
            recipient: student._id,
            message: `Great news! Mentor ${selectedMentor.name} has been allotted to you. You can now schedule your first session.`,
            type: "allotment"
        });

        // Notify Mentor (Find the User record for the mentor to get their user ID if notification is linked to User)
        // Note: In this architecture, Mentor profile email matches User email.
        const mentorUser = await User.findOne({ email: selectedMentor.email });
        if (mentorUser) {
            await Notification.create({
                recipient: mentorUser._id,
                message: `New student ${student.name} has been assigned to you. Check your dashboard for details.`,
                type: "allotment"
            });
        }

        return selectedMentor;
    } catch (error) {
        console.error("Error in automatic allotment:", error);
    }
};
