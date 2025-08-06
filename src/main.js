import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const renderTasks = () => {
    list.innerHTML = '';

    // Mostrar tareas no completadas primero
    tasks
      .filter(task => !task.completed)
      .forEach((task) => {
        renderTask(task);
      });

    // Luego las completadas
    tasks
      .filter(task => task.completed)
      .forEach((task) => {
        renderTask(task);
      });
  };
  const renderTask = (task) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const checkIcon = document.createElement('i');
    checkIcon.className = task.completed
      ? 'fa-solid fa-square-check'
      : 'fa-regular fa-square';
    checkIcon.classList.add('check-icon');

    checkIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement('span');
    span.textContent = task.text;

    const optionsBtn = document.createElement('button');
    optionsBtn.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i>';
    optionsBtn.classList.add('options-btn');

    const menu = document.createElement('div');
    menu.classList.add('options-menu');
    menu.innerHTML = `
    <button class="edit">Editar</button>
    <button class="delete" style="color:red;">Eliminar</button>
  `;
    menu.style.display = 'none';

    optionsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', () => {
      menu.style.display = 'none';
    });

    menu.querySelector('.delete').addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        tasks.splice(tasks.indexOf(task), 1);
        saveTasks();
        renderTasks();
      }
    });

    const editModal = document.getElementById('edit-modal');
    const editInput = document.getElementById('edit-input');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const confirmEditBtn = document.getElementById('confirm-edit');

    menu.querySelector('.edit').addEventListener('click', () => {
      editInput.value = task.text;
      editModal.style.display = 'block';

      confirmEditBtn.onclick = () => {
        const newText = editInput.value.trim();
        if (newText !== '') {
          task.text = newText;
          saveTasks();
          renderTasks();
        }
        editModal.style.display = 'none';
      };

      cancelEditBtn.onclick = () => {
        editModal.style.display = 'none';
      };
    });

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');
    optionsContainer.appendChild(optionsBtn);
    optionsContainer.appendChild(menu);

    li.appendChild(checkIcon);
    li.appendChild(span);
    li.appendChild(optionsContainer);

    list.appendChild(li);
  };
  const mainOptionsBtn = document.getElementById('main-options-btn');
  const mainOptionsMenu = document.getElementById('main-options-menu');
  const deleteAllBtn = document.getElementById('delete-all-btn');
  const deleteCompletedBtn = document.getElementById('delete-completed-btn');

  // Mostrar/ocultar menú desplegable
  mainOptionsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mainOptionsMenu.style.display = mainOptionsMenu.style.display === 'block' ? 'none' : 'block';
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', () => {
    mainOptionsMenu.style.display = 'none';
  });

  // Función eliminar todas
  deleteAllBtn.addEventListener('click', () => {
    if (confirm('¿Eliminar TODAS las tareas?')) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  });

  // Función eliminar realizadas
  deleteCompletedBtn.addEventListener('click', () => {
    if (confirm('¿Eliminar solo las tareas realizadas?')) {
      tasks = tasks.filter(task => !task.completed);
      saveTasks();
      renderTasks();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskText = input.value.trim();
    if (taskText === '') return;

    tasks.push({ text: taskText, completed: false });
    saveTasks();
    renderTasks();
    input.value = '';
  });

  renderTasks();
});
