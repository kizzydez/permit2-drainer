// api/submit.js
export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, wallet, discord, twitter, complaint, submittedAt } = req.body;

    const submission = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toISOString(),
        email: email || "N/A",
        wallet: wallet || "N/A",
        discord: discord || "N/A",
        twitter: twitter || "N/A",
        complaint: complaint || "N/A",
        submittedAt: submittedAt || new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.ip || "Unknown"
    };

    // Log to Vercel Console
    console.log("🚨 NEW SUBMISSION RECEIVED");
    console.log(JSON.stringify(submission, null, 2));

    res.status(200).json({
        success: true,
        message: "Form submitted successfully!",
        submissionId: submission.id
    });
}
