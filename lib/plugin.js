'use strict'

const execFile = require('child_process').execFile

module.exports = plugin

/**
 * An mdast plugin to inject the output of documentationjs at a certain
 * heading in a markdown file.
 *
 * @example
 * ```javascript
 * var docjsReadme = require('documentation-readme/lib/plugin')
 * mdast.use(docjsReadme, {
 *  section: 'usage', // inject into the ## Usage section of the input doc
 *  documentationArgs: [ '--shallow', '/path/to/entry.js' ]
 * }).process(inputMarkdownContent, function(err, vfile, content) {
 *  console.log(content)
 * })
 * ```
 */
function plugin(mdast, opts) {
  let args = opts.documentationArgs || []
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
    // find the heading after which to inject the new content
    let head = ast.children.findIndex(node => isHeading(node, opts.section))
    if (!(head >= 0)) {
      return
    }

    // find the next heading at the same heading level, which is where we'll
    // STOP inserting
    let depth = ast.children[head].depth
    let nextHead = ast.children.findIndex((node, i) => {
      return isHeading(node, false, depth) && i > head
    })

    let parsed = mdast.parse(content)

    // bump heading levels so they fall within the parent documents' heirarchy
    bumpHeadings(parsed, depth)

    // insert content
    ast.children.splice.apply(ast.children, [
      head + 1, // start splice
      (nextHead >= 0 ? nextHead - head : ast.children.length - head) - 1 // items to delete
    ].concat(parsed.children))
  }

  /*
   * Test if the given node is a heading, optionally with the given text,
   * or <= the given depth
   */
  function isHeading(node, text, depth) {
    if (node.type !== 'heading') {
      return false
    }

    if (text) {
      let headingText = mdast.stringify({
        type: 'root',
        children: node.children
      })
      // TODO: more flexible match?
      return text.trim().toLowerCase() === headingText.trim().toLowerCase()
    }

    if (depth) {
      return node.depth <= depth
    }

    return true
  }
}

const MAX_HEADING_DEPTH = 99999

function bumpHeadings(root, baseDepth) {
  let headings = []
  walk(root, function (node) {
    if (node.type === 'heading') {
      headings.push(node)
    }
  })
  let minDepth = headings.reduce((memo, h) => Math.min(memo, h.depth), MAX_HEADING_DEPTH)
  let diff = baseDepth + 1 - minDepth
  headings.forEach(h => h.depth += diff)
}

function walk(node, fn) {
  fn(node)
  if (node.children) {
    node.children.forEach(fn)
  }
}

