//imports
const { ethers, run, network } = require("hardhat")
const readline = require("readline")

//async main
async function main() {
    const simpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract ...")
    const simpleStorage = await simpleStorageFactory.deploy()
    await simpleStorage.deployed()
    //
    console.log(`Deployed contract to:${simpleStorage.address}`)
    //
    //console.log(network.config)
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("waiting for block txes ....")
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Currnet Value is : ${currentValue}`)
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const udpatedValue = await simpleStorage.retrieve()
    console.log(`Updated Value is : ${udpatedValue}`)

    //Read user input
    const prompt = require("prompt-sync")()
    const personCount = 3
    for (let i = 0; i < personCount; i++) {
        const newPersonName = prompt(
            `What is the new pesrson ${i + 1}'s name? `
        )
        const newPersonFavoriteNum = prompt(
            `What is the new pesrson ${i + 1}'s Favorite number? `
        )

        // Add entered name as a new person
        await simpleStorage.addPerson(newPersonName, newPersonFavoriteNum)
    }
    console.log("\n")
    // get the list of people added
    const people = await simpleStorage.getPeoples()
    let personFavNum = 0

    //Print the list of people added
    for (let i = 0; i < personCount; i++) {
        personFavNum = await simpleStorage.getMappingValue(people[i][1])
        console.log(
            `Person ${i + 1}'s name is '${
                people[i][1]
            }', their Favorite number is '${personFavNum}'`
        )
    }
    console.log("\n")
}

async function verify(contractAddress, args) {
    console.log("Verifying contract ...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified ...")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
