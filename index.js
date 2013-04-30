var funderscore = require('funderscore')
// type Match: {
//   path: Array<String>,
//   key: String,
//   value: Value,
//   parent: Object
// }

// (selectors: String|Array<String>, obj: Object) => Array<Match>
// or (selectors: String|Array<String>) => (obj: Object) => Array<Match>
module.exports = function match (selectors, obj) {
  selectors = [].concat(selectors).map(function (selector) {
    return selector.split('.')
  })

  return obj ? findMatches(obj, selectors)
             : function (obj) { return findMatches(obj, selectors) }
}

function exactMatch(path) {
  return function (selector) {
    return path.length === selector.length && path.every(function (segment, i) {
      return selector[i] === '*' || selector[i] === segment
    })
  }
}

function partialMatch(path) {
  var i = path.length - 1
  return function (selector) {
    return selector[i] === '*' || selector[i] === path[i]
  }
}

function findMatches(obj, selectors, path, parent) {
  if (path === void 0) { path = [] }

  // full selector match
  if(selectors.some(exactMatch(path))) {
    return {
      path: path,
      value: obj,
      parent: parent,
      key: path[path.length - 1]
    }
  }

  // first node or partial match
  if(!parent || selectors.some(partialMatch(path))) { 
    return funderscore.flatMap(obj, function (val, key) {
      return findMatches(val, selectors, path.concat(key), obj)
    })
  }

  // default
  return []
}