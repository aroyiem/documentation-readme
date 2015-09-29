require('babel/register')

const fs = require('fs')
const mdast = require('mdast')
const plugin = require('./lib/plugin')

var yargs = require('yargs')
  .usage('Usage: $0 documentation [options] [-- documentationjs options]')
  .alias('o', 'output')
  .default('o', 'README.md')
  .describe('o', 'Markdown file into which to ouput generated documentation')

  .demand('s')
  .alias('s', 'section')
  .describe('s', 'The section heading after which to inject generated documentation')

  .help('h')
  .alias('h', 'help')

  .example('$0 -s "API Docs" -- index.js --github')

var argv = yargs.argv

if (argv._.filter(a => a === 'f' || a === 'format').length) {
  console.log('Setting documentationjs format is not allowed in documentation-readme.')
  process.exit(1)
}

mdast.use(plugin, {
  section: argv.s,
  documentationArgs: argv._
}).process(fs.readFileSync(argv.o, 'utf-8'), function (err, file, content) {
  if (err) {
    throw err
  }
  fs.writeFileSync(argv.o, content)
})


