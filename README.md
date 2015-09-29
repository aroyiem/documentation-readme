# documentation-readme

Inject [documentationjs](http://documentation.js.org/)-generated documentation into your README.md.

## Usage

### Command line

```sh
npm install -g documentation-readme
cd /your/project
documentation-readme -o README.md -s "API Usage" -- [documentationjs opts]
```

### npm script

    cd /your/project
    npm install --save-dev documentation-readme

And then add to your `package.json`:

```javascript
{
  // ... other scripts
  "docs": "documentation-readme -s \"API Usage\""
}
```

### mdast plugin

#### `plugin`

An mdast plugin to inject the output of documentationjs at a certain
heading in a markdown file.

##### Examples

```js
var docjsReadme = require('documentation-readme/lib/plugin')
mdast.use(docjsReadme, {
 section: 'usage', // inject into the ## Usage section of the input doc
 documentationArgs: [ '--shallow', '/path/to/entry.js' ]
}).process(inputMarkdownContent, function(err, vfile, content) {
 console.log(content)
})
```

## [Contributing](CONTRIBUTING.md)

_We have plenty of
[issues](https://github.com/documentationjs/documentation/issues) that we'd
love help with._

-   Robust and complete `JSDoc` support, including typedefs.
-   Strong support for HTML and Markdown output
-   Documentation coverage, statistics, and validation

documentation is an OPEN Open Source Project. This means that:

Individuals making significant and valuable contributions are given
commit-access to the project to contribute as they see fit. This
project is more like an open wiki than a standard guarded open source project.
