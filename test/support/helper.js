var chai      = require('chai'),
    sinon     = require('sinon'),
    sinonChai = require('sinon-chai'),
    to5       = require('6to5/register');

global.expect = chai.expect;
global.sinon  = sinon;

chai.use(sinonChai);

// Register 6to5.
to5({ignore: /(lib|node_modules)/});
