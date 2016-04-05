var chai, expect, sinon;

chai = require('chai');

sinon = require('sinon');

chai.use(require('sinon-chai'));

expect = chai.expect;

describe('analytics', function() {
  beforeEach(function() {
    this.robot = {
      respond: sinon.spy(),
      hear: sinon.spy()
    };
    return require('../src/analytics')(this.robot);
  });
  it('registers a respond listener', function() {
    return expect(this.robot.respond).to.have.been.calledWith(/hello/);
  });
  return it('registers a hear listener', function() {
    return expect(this.robot.hear).to.have.been.calledWith(/orly/);
  });
});
