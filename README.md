# object-match
match selectors in an object

## usage

Let's say you have an object that looks like this:

    var obj = {
      animals: {
        ostrich: {size: 4},
        'kangaroo rat': {size: 3},
        owl: {size: 2},
        'blue whale': {size: 80},
        megalodon: {size: 100}
      }
    }

We can't know the keys in advance, but the structure follows a pattern:

    'animals.*.size'

We can get the size of all of the animals like so:

    var objectMatch = require('object-match')

    var sizes = objectMatch('animals.*.size', obj).map(function (match) { return {
      name: match.path[1],
      size: match.value
    })
    // => [
    //  {name: 'ostrich', size: 4},
    //  {name: 'kangaroo rat', size: 3},
    //  {name: 'owl', size: 2},
    //  {name: 'blue whale': size: 80},
    //  {name: 'megalodon', size: 100}
    // ]

Matching uses dot notation. Wildcards match any key at that level, and work for either objects or arrays (since array elements are accessible by their index).

You can also supply an array of selectors, which are connected with a logical OR:

    objectMatch(['animal.ostrich.size', 'animal.owl.size'], obj).length
    // => 2

Match objects look like:

    {
      path: ['animals','owl','size'],
      key: 'size',
      value: 2,
      parent: obj.animals.owl
    }

In [jsig notation](https://github.com/jden/jsig):

    Match: {
      path: Array<String>,
      key: String,
      value: Value,
      parent: Object
    }

`matchObject` is curried. If you don't supply an object, it will return a function with the selectors bound.

## function signature

In [jsig notation](https://github.com/jden/jsig):

    matchObject: (selectors: String|Array<String>, obj: Object) => Array<Match>

or curried

    matchObject: (selectors: String|Array<String>) => (obj: Object) => Array<Match>

## installation

    $ npm install match-object

## running the tests

From project root:

    $ npm install
    $ npm test

## contributors

jden <jason@denizac.org>

## license

MIT. (c) 2013 Agile Diagnosis <hello@agilediagnosis.com>. See LICENSE.md