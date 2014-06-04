var ReactTools = require('react-tools');
var fs = require('fs');

require.extensions['.jsx'] = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8');
  var answer = ReactTools.transform(content);
  return module._compile(answer, filename);
};
