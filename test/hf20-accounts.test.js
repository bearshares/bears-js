import Promise from 'bluebird';
import should from 'should';
import bears from '../src';

const username = process.env.BEARS_USERNAME || 'guest123';
const password = process.env.BEARS_PASSWORD;
const activeWif = bears.auth.toWif(username, password, 'active');

describe('bears.hf20-accounts:', () => {
  it('has generated methods', () => {
    should.exist(bears.broadcast.claimAccount);
    should.exist(bears.broadcast.createClaimedAccount);
  });

  it('has promise methods', () => {
    should.exist(bears.broadcast.claimAccountAsync);
    should.exist(bears.broadcast.createClaimedAccountAsync);
  });


  describe('claimAccount', () => {

    it('signs and verifies auth', function(done) {
      let tx = {
        'operations': [[
          'claim_account', {
            'creator': username,
            'fee': '0.000 TESTS'}]]
      }

      bears.api.callAsync('condenser_api.get_version', []).then((result) => {
        result.should.have.property('blockchain_version');
        if(result['blockchain_version'] < '0.21.0') return done(); /* SKIP */
        result.should.have.property('blockchain_version', '0.21.0')

        bears.broadcast._prepareTransaction(tx).then(function(tx){
          tx = bears.auth.signTransaction(tx, [activeWif]);
          bears.api.verifyAuthorityAsync(tx).then(
            (result) => {result.should.equal(true); done();},
            (err)    => {done(err);}
          );
        });
      });

    });

    it('claims and creates account', function(done) {
      this.skip(); // (!) need test account with enough RC

      bears.api.callAsync('condenser_api.get_version', []).then((result) => {
        result.should.have.property('blockchain_version');
        if(result['blockchain_version'] < '0.21.0') return done(); /* SKIP */
        result.should.have.property('blockchain_version', '0.21.0')

        bears.broadcast.claimAccountAsync(activeWif, username, '0.000 TESTS', []).then((result) => {
            let newAccountName = username + '-' + Math.floor(Math.random() * 10000);
            let keys = bears.auth.generateKeys(
                username, password, ['posting', 'active', 'owner', 'memo']);

            bears.broadcast.createClaimedAccountAsync(
                activeWif,
                username,
                newAccountName,
                keys['owner'],
                keys['active'],
                keys['posting'],
                keys['memo'],
                {}, []
              ).then((result) => {
                should.exist(result);
                done();
            }, (err) => {done(err)});
        }, (err) => {done(err)});
      });
    });

  });
});
