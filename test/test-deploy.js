const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

// describe("SimpleStorage", () => {})
describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage

    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })
    it("Should start with a Favorite number = 0 ", async function () {
        //
        const cuurentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        assert.equal(cuurentValue.toString(), expectedValue)
        //expect(cuurentValue.toString()).to.equal(expectedValue)
    })
    //
    //it.only("Should update when we call store", async function () {
    it("Should update when we call store", async function () {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)
        const currentValue = await simpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Tests the addPerson works", async function () {
        const personCount = 3

        // Add entered name as a new person
        await simpleStorage.addPerson("Omar", 3600)
        await simpleStorage.addPerson("Maryam", 77800)
        await simpleStorage.addPerson("Hamed", 109000)

        // get the list of people added
        const peopleLstLen = await simpleStorage.personLstLen()
        const tmpPeople = await simpleStorage.getPeoples()
        const aPerasonFavoriteNum = await simpleStorage.getMappingValue(
            "Maryam"
        )
        //
        assert.equal(peopleLstLen, personCount)
        assert.notEqual(tmpPeople.length, 0)
        assert.equal(aPerasonFavoriteNum, 77800)
    })
})
