// =============================================
// server.js - Backend for Airdrop Form
// Improved Version with Logging & File Save
// =============================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Create logs and submissions folder
const submissionsDir = path.join(__dirname, 'submissions');
if (!fs.existsSync(submissionsDir)) {
    fs.mkdirSync(submissionsDir, { recursive: true });
}

// ===================== MAIN SUBMISSION ENDPOINT =====================
app.post('/api/submit', (req, res) => {
    const { email, wallet, discord, twitter, complaint, submittedAt } = req.body;

    const submission = {
        id: Date.now().toString(36),
        email: email || "N/A",
        wallet: wallet || "N/A",
        discord: discord || "N/A",
        twitter: twitter || "N/A",
        complaint: complaint || "N/A",
        submittedAt: submittedAt || new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
    };

    // Log to console
    console.log("🔥 NEW SUBMISSION RECEIVED");
    console.log(JSON.stringify(submission, null, 2));

    // Save to JSON file
    const fileName = `submission_${Date.now()}.json`;
    const filePath = path.join(submissionsDir, fileName);

    fs.writeFile(filePath, JSON.stringify(submission, null, 2), (err) => {
        if (err) {
            console.error("Failed to save submission:", err);
        } else {
            console.log(`✅ Saved to: submissions/${fileName}`);
        }
    });

    // Optional: Append to a master log file
    const logEntry = `${new Date().toISOString()} | ${submission.wallet} | ${submission.email} | ${submission.discord}\n`;
    fs.appendFile(path.join(__dirname, 'all_submissions.log'), logEntry, () => {});

    res.status(200).json({
        success: true,
        message: "Form submitted successfully!",
        submissionId: submission.id
    });
});

// ===================== HEALTH CHECK =====================
app.get('/health', (req, res) => {
    res.json({
        status: "running",
        timestamp: new Date().toISOString(),
        submissionsDir: fs.existsSync(submissionsDir)
    });
});

app.get('/', (req, res) => {
    res.send(`
        <h1>Airdrop Form Backend ✅</h1>
        <p>Server is running properly.</p>
        <p><a href="/health">Check Health</a></p>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`📡 Submission endpoint: /api/submit`);
    console.log(`📁 Submissions will be saved in /submissions folder`);
});
