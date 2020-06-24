'use strict'
{
  const form = document.querySelector('#form');
  console.log(form);
  const formText = document.querySelector('#form-text');
  const taskBox = document.querySelector('.task-list');
  const taskList = [];
  let taskId = 0;


// タスクの追加
  function addTask() {
    console.log('hello');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const taskName = textCheck(formText.value);
      const newTask = new NewItem(taskName);
      taskList.push(newTask);
      console.log(taskList);
      upDateHtml();
      formText.value = '';
    })
  }

//入力された文字の確認・トリム
  function textCheck(text) {
    if (text.trim() === '') {
      alert('タスクを入力してください')
      return
    } else {
      return text;
    }
  }

// 新しいタスクのひな形
  class NewItem {
    constructor(task) {
      this.taskName = task;
      this.id = taskId++;
      this.completed = false;
    }
  }

//HTML<ul>内の更新
  function upDateHtml() {
    taskBox.innerHTML = '';
    taskList.forEach(item => {
      const newNode = document.createElement('li');
      const newNodeHtml = item.completed
        ? `<input type="checkbox" class="checkbox" checked>
          <span class="task-name">${item.taskName}</span
            <span>×</span>`
        : `<input type="checkbox" class="checkbox">
          <span class="task-name">${item.taskName}</span>
          <span>×</span>`;
      newNode.innerHTML = newNodeHtml;

      const checkbox = newNode.querySelector('.checkbox');
      const taskDecoration = newNode.querySelector('.task-name')
      checkbox.addEventListener('click', () => {
        if (item.completed) {
          item.completed = false;
        } else if (!item.completed) {
          item.completed = true;
        }
        taskDecoration.classList.toggle('checked');
        console.log(item);
      });
      taskBox.appendChild(newNode);
      }
    );
  }


  addTask();
}
