var execFile = require('child_process').execFile

/**
 * An mdast plugin to inject the output of documentationjs at a certain
 * heading in a markdown file
 */
module.exports = function (mdast, opts) {
  var args = opts.documentationArgs || []
  args = ['-f', 'md'].concat(args)
  return function transform(ast, file, next) {
    execFile('node_modules/.bin/documentation', args, function (err, stdout, stderr) {
      if (err) {
        return next(err)
      }

      inject(opts, ast, stdout)
      next()

    })
  }

  function inject(opts, ast, content) {
    var head = ast.children.findIndex(node => isHeading(node, opts.section))
    var nextHead = ast.children.findIndex((node, i) => isHeading(node) && i > head)
    var parsed = mdast.parse(content)

    // TODO: bump heading levels so they fall within the parent documents' heirarchy

    ast.children.splice.apply(ast.children, [
      head + 1, // start splice
      nextHead >= 0 ? (ast.children.length - head) : 0 // items to delete
    ].concat(parsed.children))
  }

  function isHeading(node, text) {
    if (node.type !== 'heading') {
      return false
    }

    if (text) {
      var headingText = mdast.stringify({
        type: 'root',
        children: node.children
      })
      // TODO: more flexible match?
      return text.trim().toLowerCase() === headingText.trim().toLowerCase()
    }

    return true
  }
}

