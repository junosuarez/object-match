var chai = require('chai')
chai.should()

var match = require('../index')

describe('match', function () {

  it('match objects', function () {
    var obj = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4
      }
    }

    var m = match('c.d')(obj)[0]

    m.should.deep.equal({
      path: ['c','d'],
      key: 'd',
      value: 3,
      parent: obj.c
    })

  })

  it('is curried by default (returns a function if not all arguments are given)', function () {

    var parser = match('foo.bar')

    parser.should.be.a('function')

  })

  it('matches selectors in an object', function () {
    var obj = {
      platypus: {
        ostrich: {
          enemies: false
        },
        tiger: {
          enemies: true
        }
      }
    }

    var m = match('platypus.ostrich', obj)

    m.should.deep.equal([
      {path: ['platypus','ostrich'], value: {enemies: false}, parent: obj.platypus, key: 'ostrich'}
    ])
  })

  it('takes an object and returns an array of matches', function () {
    var obj = {
      platypus: {
        ostrich: {
          enemies: false
        },
        tiger: {
          enemies: true
        }
      }
    }

    var m = match('platypus.ostrich')(obj)

    m.should.deep.equal([
      {path: ['platypus','ostrich'], value: {enemies: false}, parent: obj.platypus, key: 'ostrich'}
    ])
  })

  describe('selectors', function () {


    it('supports wildcards for objects', function () {
      var m = match('animals.*.size')({
        animals: {
          ostrich: {size: 4},
          'kangaroo rat': {size: 3},
          owl: {size: 2},
          'blue whale': {size: 80},
          megalodon: {size: 100}
        }
      })

      m.should.deep.equal([
        {path: ['animals','ostrich','size'], value: 4, parent: {size: 4}, key: 'size'},
        {path: ['animals','kangaroo rat','size'], value: 3, parent: {size: 3}, key: 'size'},
        {path: ['animals','owl','size'], value: 2, parent: {size: 2}, key: 'size'},
        {path: ['animals','blue whale','size'], value: 80, parent: {size: 80}, key: 'size'},
        {path: ['animals','megalodon','size'], value: 100, parent: {size: 100}, key: 'size'}
      ])
    })

    it('works on arrays', function () {
      var m = match('a.*.c')({
        a: [{c: 1}, {c: 2}, {c: 3}]
      })

      m.should.deep.equal([
        { path: [ 'a', '2', 'c' ], value: 3, parent: {c: 3}, key: 'c' },
        { path: [ 'a', '1', 'c' ], value: 2, parent: {c: 2}, key: 'c' },
        { path: [ 'a', '0', 'c' ], value: 1, parent: {c: 1}, key: 'c' }
      ].reverse())
    })

    it('works with multiple wildcards', function () {
      var m = match('a.*.c.*')({
        a: {
          b: {
            c: ['d','dee']
          },
          B: {
            c: ['D','DEE']
          },
          β: {
            c: ['gamma','GAMMA']
          }
        }
      })

      m.length.should.equal(6)
    })
  })


})