var ReactTools = require('react-tools'),
    fs         = require('fs');

require.extensions['.jsx'] = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8'),
      answer  = ReactTools.transform(content);

  return module._compile(answer, filename);
};
