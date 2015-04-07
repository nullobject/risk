var babel     = require('babel-core/register'),
    chai      = require('chai'),
    sinon     = require('sinon'),
    sinonChai = require('sinon-chai');

global.expect = chai.expect;
global.sinon  = sinon;

chai.use(sinonChai);

// Register babel.
babel({ignore: /(lib|node_modules)/});
