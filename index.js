import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.addEventListener("click", connect)
fundButton.addEventListener("click", fund)
balanceButton.addEventListener("click", getBalance)
withdrawButton.addEventListener("click", withdraw)

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("Connected to MetaMask")
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Please install MetaMask"
    }
}

//fund function
async function fund(ethAmount) {
    ethAmount = document.getElementById("ethAmount").value
    console.log("Funding with " + ethAmount + " ETH")
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (err) {
            console.log(err)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    //return new Promise();
    //create a listener for the blockchain
    return new Promise((res, rej) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with -- ${transactionReceipt.confirmations} confirmations`
            )
            res(transactionReceipt)
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log("Balance: " + ethers.utils.formatEther(balance) + " ETH");
        
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        console.log("Contract owner: " + await contract.getOwner());
        //signer address:
        console.log("Signer address: " + await signer.getAddress());

        //get public key from private key string
        const privateKet = "b0e62a4946f4b6ebf5c06c4d60e67cc2fc0cd29b4ec266916fb04cea25b88005"
        const wallet = new ethers.Wallet(privateKet)
        console.log("Wallet address: " + wallet.address)
    }
}

//withdraw function
async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.cheaperWithdraw()
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch (err) {
            console.log(err)
        }
    }
}