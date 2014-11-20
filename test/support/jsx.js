var fs         = require('fs'),
    ReactTools = require('react-tools');

require.extensions['.jsx'] = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8'),
      answer  = ReactTools.transform(content);

  return module._compile(answer, filename);
};
