'use strict'
{
  const form = document.querySelector('#form');
  console.log(form);
  const formText = document.querySelector('#form-text');
  const taskBox = document.querySelector('.task-list');
  let taskList = [];
  let taskId = 0;


// タスクの追加
  function addTask() {
    console.log('hello');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const taskName = textCheck(formText.value);
      if (!taskName) {
        formText.value = '';
        return
      };
      const newTask = new NewItem(taskName);
      taskList.push(newTask);
      console.log(taskList);
      upDateHtml();
      formText.value = '';
    })
  }

//入力された文字の確認
  function textCheck(text) {
    if (text.trim() === '') {
      alert('タスクを入力してください')
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

    // <ul>を削除後、itemの完了状態に合わせた子要素の追加
    taskBox.innerHTML = '';
    taskList.forEach(item => {
      const newNode = document.createElement('li');
      const newNodeHtml = item.completed
        ? `<input type="checkbox" class="checkbox" checked>
          <span class="checked">${item.taskName}</span>
            <span class="delete-button">×</span>`
        : `<input type="checkbox" class="checkbox">
          <span>${item.taskName}</span>
          <span class="delete-button">×</span>`;
      newNode.innerHTML = newNodeHtml;

      // チェックボックスとitem.completedの同期
      const checkbox = newNode.querySelector('.checkbox');
      checkbox.addEventListener('click', () => {
        if (item.completed) {
          item.completed = false
        } else if (!item.completed) {
          item.completed = true;
        }
        upDateHtml();
      });

      //削除機能
      const deleteButton = newNode.querySelector('.delete-button');
      const deleteId = item.id;
      deleteButton.addEventListener('click', () => {
        taskList = taskList.filter((task) => {
          return task.id !== deleteId;
        });
        console.log(taskList);
        upDateHtml()
      });

      taskBox.appendChild(newNode);
      }
    );
  }


  addTask();
}
