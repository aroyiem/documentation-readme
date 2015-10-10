var diff = require('diff')
var chalk = require('chalk')

module.exports = function (pre, post) {
  var changes = diff.diffLines(pre, post, { newlineIsToken: true })
  var didChange = changes.filter(function (change) {
    return change.added || change.removed
  }).length > 0

  return didChange ? formatDiff(changes) : false
}

function formatDiff(changes) {
  return changes.map(function (change, i) {
    if (change.added) {
      return chalk.green(prepend('+ ', change.value))
    } else if (change.removed) {
      return chalk.red(prepend('- ', change.value))
    }

    // unchanged lines: only grab the end to use as context for actual changed
    // text
    if (i < changes.length - 1) {
      return [
        chalk.cyan('================'),
        getEnding(change.value)
      ].join('\n')
    }

    return false
  })
  .filter(function (f) {
    return !!f
  })
  .join('\n')
}

// prepend prefix to each line of str
function prepend(prefix, str) {
  return str.split('\n').map(function (line) {
    return prefix + line
  })
  .join('\n')
}

// grab the 'ending' of the string, defined here as: from the penultimate
// non-whitespace line to the end
function getEnding(str) {
  var lines = str.split('\n')
  var nonWhitespace = lines.map(function (line, j) {
    return [line.trim().length, j]
  })
  .filter(function (f) {
    return f[0]
  })
  .map(function (m) {
    return m[1]
  })

  if (nonWhitespace.length < 2) {
    return str
  }

  return lines.slice(nonWhitespace[nonWhitespace.length - 2]).join('\n')
}
