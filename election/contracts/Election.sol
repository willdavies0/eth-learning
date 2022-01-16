// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
  
  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  mapping(uint => Candidate) public candidates;

  uint public candidatesCount;

  function addCandidate(string memory _name) private {
    candidatesCount++;
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
  }

  mapping(address => bool) public voters;

  event votedEvent(uint indexed _candidateId);

  function vote(uint _candidateId) public {
    require(!voters[msg.sender]);
    require(_candidateId > 0 && _candidateId <= candidatesCount);
    voters[msg.sender] = true;
    candidates[_candidateId].voteCount ++;

    emit votedEvent(_candidateId);
  }

  // syntax error with constructor. compiler needs public keyword
  constructor() public {
    addCandidate('Candidate 1');
    addCandidate('Candidate 2');
  }
}