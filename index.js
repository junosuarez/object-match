// type Match: {
//   path: Array<String>,
//   key: String,
//   value: Value,
//   parent: Object
// }

// (selectors: String|Array<String>, obj: Object) => Array<Match>
// or
// (selectors: String|Array<String>) => (obj: Object) => Array<Match>
var match = function (selectors, obj) {

  selectors = [].concat(selectors).map(function (selector) {
    return selector.split('.')
  })

  var fn = function (document) {

    var matches = []
    var pathSeg
    var seg = document
    var stack = [{path: [], value: document, depth: -1}]
    var node

    // breadth-first search
    while(node = stack.pop()) {

      // full selector match
      if(selectors.some(exactMatch(node))) {

        // in ES6, I would so yield.
        matches.push({
          path: node.path,
          value: node.value,
          parent: node.parent,
          key: node.path[node.path.length - 1]})
        continue
      }

      // first node or partial match
      if(node.depth === -1 || selectors.some(partialMatch(node))) {

        for(var child in node.value) {
          stack.push({
            path: node.path.concat(child),
            value: node.value[child],
            parent: node.value,
            depth: node.depth + 1
          })
        }
      }

    }
    return matches
  }

  return obj ? fn(obj) : fn
}

function exactMatch(node) {
  var len = node.path.length
  return function (selector) {
    return len === selector.length && node.path.every(function (segment, i) {
      return selector[i] === '*' || selector[i] === segment
    })
  }
}

function partialMatch(node) {
  var i = node.depth
  return function (selector) {
    return selector[i] === '*' || selector[i] === node.path[node.depth]
  }
}
module.exports = match