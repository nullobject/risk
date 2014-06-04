var chai      = require('chai');
var sinon     = require('sinon');
var sinonChai = require('sinon-chai');

global.expect = chai.expect;
global.sinon  = sinon;

chai.use(sinonChai);
