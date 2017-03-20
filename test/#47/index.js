'use strict'

const assert = require('assert')
const Promise = require('bluebird')
const test = require('../../lib/test')

const vector = test.Vector()

before(vector.before(__dirname, {protocol: 'http:'}))
after(vector.after())

it('#47', vector.it(function (manager) {
  this.timeout(10 * 1000)

  const source = `
    contract Test{
      string _withSpace = "  Pieter";
      string _withoutSpace = "Pieter";

      function getWithSpaceConstant() constant returns (string) {
        return _withSpace;
      }

      function getWithoutSpaceConstant () constant returns (string) {
        return _withoutSpace;
      }
    }
  `

  return test.compile(manager, source, 'Test').then((contract) =>
    Promise.all([
      Promise.fromCallback((callback) =>
        contract.getWithSpaceConstant(callback)
      ),
      Promise.fromCallback((callback) =>
        contract.getWithoutSpaceConstant(callback)
      )
    ]).then(([withSpace, withoutSpace]) => {
      assert.equal(withSpace, '  Pieter')
      assert.equal(withoutSpace, 'Pieter')
    })
  )
}))
