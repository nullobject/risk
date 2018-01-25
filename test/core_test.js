import * as core from '../src/core'
import {assert} from 'chai'

describe('core', () => {
  describe('.distribute', () => {
    it('distributes the units', () => {
      assert.deepEqual(core.distribute(0, [1, 2, 3]), [0, 0, 0])
      assert.deepEqual(core.distribute(1, [1, 2, 3]), [1, 0, 0])
      assert.deepEqual(core.distribute(2, [1, 2, 3]), [1, 1, 0])
      assert.deepEqual(core.distribute(3, [1, 2, 3]), [1, 1, 1])
      assert.deepEqual(core.distribute(4, [1, 2, 3]), [1, 2, 1])
      assert.deepEqual(core.distribute(5, [1, 2, 3]), [1, 2, 2])
      assert.deepEqual(core.distribute(6, [1, 2, 3]), [1, 2, 3])
      assert.deepEqual(core.distribute(7, [1, 2, 3]), [1, 2, 3])
    })
  })
})
