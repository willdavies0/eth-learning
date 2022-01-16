const Election = artifacts.require('./Election.sol');

contract('Election', accounts => {
  it('initisalises with 2 candidates', async () => {
    const election = await Election.deployed();
    const count = await election.candidatesCount();
    assert.equal(count, 2);
  });

  it('initialises candidates with correct values', async () => {
    const election = await Election.deployed();
    const candA = await election.candidates(1);
    const candB = await election.candidates(2);

    assert.equal(candA[0], 1, 'contains correct id')
    assert.equal(candA[1], 'Candidate 1', 'contains correct name')
    assert.equal(candA[2], 0, 'contains correct # votes')

    assert.equal(candB[0], 2, 'contains correct id')
    assert.equal(candB[1], 'Candidate 2', 'contains correct name')
    assert.equal(candB[2], 0, 'contains correct # votes')
  })

  it("allows a voter to cast a vote", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      return electionInstance.vote(candidateId, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
      assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
      return electionInstance.voters(accounts[0]);
    }).then(function(voted) {
      assert(voted, "the voter was marked as voted");
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = parseInt(candidate[2]);
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    });
  });

  it("throws an exception for invalid candidates", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = parseInt(candidate1[2]);
      assert.equal(voteCount, 0, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = parseInt(candidate2[2]);
      assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
    });
  });

  it("throws an exception for double voting", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(parseInt(voteCount), 1, "accepts first vote");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 0, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 2, "candidate 2 did not receive any votes");
    });
  });
});