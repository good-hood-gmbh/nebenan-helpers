import { assert } from 'chai';
import normalize from '../../src//smartcontent/normalize';

describe('modules/smartcontent/normalize', () => {
  it('normalize - newlines', () => {
    const strangeContent = 'blah blah \r\n\n\n\n\r awesome \r\n';
    assert.equal(normalize(strangeContent), 'blah blah \n\n\n\n\n awesome', 'normalizes returns properly');
  });
  it('normalize - tabs', () => {
    const strangeContent = 'awesome \t\n\t stuff';
    assert.equal(normalize(strangeContent), 'awesome \n stuff', 'normalizes tabs properly');
  });
  it('normalize - formFeed', () => {
    const strangeContent = 'awesome \f\n\f stuff';
    assert.equal(normalize(strangeContent), 'awesome  \n  stuff', 'normalizes formFeed properly');
  });
});
