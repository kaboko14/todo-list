'use strict'
{
//変数・定数の宣言
  const formTask = document.querySelector('#form-task');
  const formTaskInput = document.querySelector('#form-task-input');
  const listTitle = document.querySelector('.list-title');
  const taskBox = document.querySelector('.task-list');
  let taskList = [];
  let taskId = 0;
  const formSearch = document.querySelector('#form-search');
  const formSearchInput = document.querySelector('#form-search-input');


//ローカルステージにデータがあれば取得
  if (loadStorage()) {
    const localStorageDate = loadStorage();
    taskList = localStorageDate;
    //taskListが空ならidの初期値は０、空でなければ最大値+1
    taskId = taskList.length
      ? Math.max.apply(null, taskList.map(item => item.id)) + 1
      : 0;
    upDateHtml();
  }

//タスクを追加する関数の呼び出し
  addTask();
//検索機能の関数の呼び出し
  search();




/*------------------
新しいタスクのひな形
-------------------*/
  class NewItem {
    constructor(task) {
      this.taskName = task;
      this.id = taskId++;
      this.completed = false;
      this.filtered = false;
    }
  }

/*------------
タスクの追加
------------*/
  function addTask() {
    formTask.addEventListener('submit', (e) => {
      e.preventDefault();
      taskList.forEach(item => {
        item.filtered = false;
      });
      listTitle.innerHTML='リスト一覧'
      const taskName = wordCheck(formTaskInput.value);
      if (!taskName) {
        formTaskInput.value = '';
        return
      };
      const newTask = new NewItem(taskName);
      taskList.push(newTask);
      console.log(taskList);
      upDateHtml()
      formTaskInput.value = '';
    })
  }

/*---------------------------
入力されたタスクの文字の確認
---------------------------*/
  function wordCheck(word) {
    const str = word.trim()
    if (str === '') {
      caution(true, formTask,'タスクを入力してください')
      return;
    }
    if (taskList.some((task)=>
      task.taskName === str)) {
      caution(true, formTask, '登録済みのタスクです')
      return
    }
    caution(false);
      return word;
  }

/*----------------
注意のコメント表示
----------------*/
  function caution(display,node, comment) {
    const cautionElement = document.querySelector('.caution');
    if (cautionElement) {
      console.log(cautionElement);
      cautionElement.parentNode.removeChild(cautionElement)
    }
    if (!display) {
      return
    }
    const newCautionElement = document.createElement('p');
    newCautionElement.classList.add('caution')
    newCautionElement.textContent = `${comment}`;
    node.insertBefore(newCautionElement, node.firstChild);
  }

/*--------------------------------
タスクのHTML<li>の作成・イベントの付与
--------------------------------*/
  function makeHtml(taskItem) {
    //taskItemの完了・検索の状態に合わせた<li>の作成
    const newNode = document.createElement('li');
    const newNodeHtml = taskItem.completed
      ? `<input type="checkbox" class="checkbox" checked>
          <span class="checked">${taskItem.taskName}</span>
            <span class="delete-button">×</span>`
      : `<input type="checkbox" class="checkbox">
          <span>${taskItem.taskName}</span>
          <span class="delete-button">×</span>`;
    if (taskItem.filtered) {
      newNode.classList.add('filtered')
    }
    newNode.innerHTML = newNodeHtml;

    // チェックボックスとitem.completedの同期機能
    const checkbox = newNode.querySelector('.checkbox');
    checkbox.addEventListener('click', () => {
      if (taskItem.completed) {
        taskItem.completed = false
      } else if (!taskItem.completed) {
        taskItem.completed = true;
      }
      upDateHtml();
    });

    //削除機能
    const deleteButton = newNode.querySelector('.delete-button');
    const deleteId = taskItem.id;
    deleteButton.addEventListener('click', () => {
      taskList = taskList.filter((task) => {
        return task.id !== deleteId;
      });
      upDateHtml()
    });

    taskBox.appendChild(newNode);
  }


/*--------------
<ul>内の更新
---------------*/
  function upDateHtml() {
    // <ul>を削除後、再度HTMLの作成
    taskBox.innerHTML = '';
    taskList.forEach(item => {
      makeHtml(item);
    });
    //ローカルストレージのセーブ
    saveStorage()
  }

/*--------
検索機能
--------*/
  function search() {
    formSearch.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyword = formSearchInput.value;
      const lowerKeyword = keyword.toLowerCase();
      console.log(lowerKeyword);
      if (!keyword.trim()) {
        caution(true, formSearch, 'キーワードを入力してください')
        return
      } else {
        caution(false);
      }
      taskList.forEach((item) => {
        const lowerTaskName = item.taskName.toLowerCase();
        if (!lowerTaskName.includes(keyword)){
          item.filtered = true;
        } else {
          item.filtered = false;
        }
      });
      upDateHtml();
      formSearchInput.value = '';
      listTitle.innerHTML = `「${keyword}」検索結果 <span class="searchCancel">[検索解除]</span>`;
      document.querySelector('.searchCancel').addEventListener('click', () => {
        taskList.forEach((item) => {
          item.filtered = false;
        });
        upDateHtml();
        listTitle.innerHTML = 'リスト一覧'
      });
    });
  }

  /*-------------------------------------
  taskListをローカルストレージへ保存・取得
  --------------------------------------*/
  function saveStorage() {
    let setJson = JSON.stringify(taskList);
    localStorage.setItem('localStorageKye', setJson);
  }
  function loadStorage() {
    let getJson = localStorage.getItem('localStorageKye');
    return JSON.parse(getJson);
  }
}
