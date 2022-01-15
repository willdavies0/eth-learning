// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

contract TodoList {
  uint256 public taskCount = 0;

  struct Task {
    uint256 id;
    string content;
    bool completed;
  }

  mapping(uint => Task) public tasks;

  event TaskCreated(uint id, string content, bool completed);

  event TaskCompleted(uint id, bool completed);

  function createTask(string memory _content) public {
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false);
    emit TaskCreated(taskCount, _content, false);
  }

  function toggleTask(uint id, bool completed) public {
    Task storage task = tasks[id];
    task.completed = completed;
    emit TaskCompleted(id, completed);
  }

  constructor() {
    createTask('fuck off');
  }
}
