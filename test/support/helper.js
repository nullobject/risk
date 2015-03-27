var chai      = require('chai'),
    sinon     = require('sinon'),
    sinonChai = require('sinon-chai'),
    to5       = require('babel/register');

global.expect = chai.expect;
global.sinon  = sinon;

chai.use(sinonChai);

// Register babel.
to5({ignore: /(lib|node_modules)/});
