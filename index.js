require('babel/register')

const fs = require('fs')
const mdast = require('mdast')
const plugin = require('./lib/plugin')

var yargs = require('yargs')
  .usage('Usage: $0 documentation [file=README.md] [options] [-- documentationjs options]')

  .demand('s')
  .alias('s', 'section')
  .describe('s', 'The section heading after which to inject generated documentation')

  .help('h')
  .alias('h', 'help')

  .example('$0 -s "API Docs" -- index.js --github')

var dashdash = process.argv.indexOf('--')
if (dashdash < 0) {
  dashdash = process.argv.length
}
var arglist = process.argv.slice(2, dashdash)
var documentationArgs = process.argv.slice(dashdash)
var argv = yargs.parse(arglist)

if (documentationArgs.filter(a => a === 'f' || a === 'format').length) {
  console.log('Setting documentationjs format is not allowed in documentation-readme.')
  process.exit(1)
}

var readmeFile = argv._.length ? argv._[0] : 'README.md'

mdast.use(plugin, {
  section: argv.s,
  documentationArgs: documentationArgs
}).process(fs.readFileSync(readmeFile, 'utf-8'), function (err, file, content) {
  if (err) {
    throw err
  }
  fs.writeFileSync(readmeFile, content)
})


