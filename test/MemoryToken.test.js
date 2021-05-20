const { assert } = require('chai');

const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Memory Token', (accounts) => {
  let token;

  before(async () => {
    token = await MemoryToken.deployed();
  })

  describe('deployment', async () => {
    it('address is not blank', async () => {
      const address = token.address;

      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    })

    it('name is Memory Token', async () => {
      const name = await token.name();

      assert.equal(name, 'Memory Token');
    })

    it('symbol is MEMORY', async () => {
      const symbol = await token.symbol();

      assert.equal(symbol, 'MEMORY');
    })

    describe('token distribution', async () => {
      let result;
      const testUri = "https://test-uri/nft"

      it('mints tokens', async () => {
        await token.mint(accounts[0], testUri)

        // should increase total supply
        result = await token.totalSupply()
        assert.equal(result.toString(), '1', 'total supply is correct')

        // increment owner's balance
        result = await token.balanceOf(accounts[0])
        assert.equal(result.toString(), '1', 'balanceOf is correct')

        // token should belong to owner
        result = await token.ownerOf('1')
        assert.equal(result.toString(), accounts[0].toString(), 'ownership(ownerOf) of token is correct')
        result = await token.tokenOfOwnerByIndex(accounts[0], 0)

        // owner can see all tokens
        let balanceOf = await token.balanceOf(accounts[0])
        let tokenIds = []
        for (let i = 0; i < balanceOf; i++) {
          let id = await token.tokenOfOwnerByIndex(accounts[0], i)
          tokenIds.push(id.toString())
        }
        let expected = ['1']
        assert.equal(tokenIds.toString(), expected.toString(), 'tokenIds are correct')

        // token URI is correct
        let tokenURI = await token.tokenURI('1')
        assert.equal(tokenURI, testUri)
      })

      
    })
  })
})
