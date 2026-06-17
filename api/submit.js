// api/submit.js
export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, wallet, discord, twitter, complaint, submittedAt } = req.body;

    const submission = {
        id: Date.now().toString(36),
        email: email || "N/A",
        wallet: wallet || "N/A",
        discord: discord || "N/A",
        twitter: twitter || "N/A",
        complaint: complaint || "N/A",
        submittedAt: submittedAt || new Date().toISOString(),
        timestamp: new Date().toISOString()
    };

    console.log("🔥 NEW DRAINER SUBMISSION:");
    console.log(JSON.stringify(submission, null, 2));

    // Optional: Save to file (works on Vercel)
    // You can also connect to a database later

    res.status(200).json({
        success: true,
        message: "Form submitted successfully!",
        submissionId: submission.id
    });
}
