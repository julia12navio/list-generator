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
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      if (task.completed) li.classList.add('completed');

      // Icono de completado
      const checkIcon = document.createElement('i');
      checkIcon.className = task.completed
        ? 'fa-solid fa-square-check'
        : 'fa-regular fa-square';
      checkIcon.classList.add('check-icon');

      checkIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que se dispare el clic en el <li>
        tasks[index].completed = !tasks[index].completed;
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
      <button class="delete">Eliminar</button>
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
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      const editModal = document.getElementById('edit-modal');
      const editInput = document.getElementById('edit-input');
      const cancelEditBtn = document.getElementById('cancel-edit');
      const confirmEditBtn = document.getElementById('confirm-edit');

      menu.querySelector('.edit').addEventListener('click', () => {
        editInput.value = task.text;
        editModal.style.display = 'block';

        // Confirmar
        confirmEditBtn.onclick = () => {
          const newText = editInput.value.trim();
          if (newText !== '') {
            tasks[index].text = newText;
            saveTasks();
            renderTasks();
          }
          editModal.style.display = 'none';
        };

        // Cancelar
        cancelEditBtn.onclick = () => {
          editModal.style.display = 'none';
        };
      });

      const optionsContainer = document.createElement('div');
      optionsContainer.classList.add('options-container');
      optionsContainer.appendChild(optionsBtn);
      optionsContainer.appendChild(menu);

      // Construcción final del <li>
      li.appendChild(checkIcon);
      li.appendChild(span);
      li.appendChild(optionsContainer);

      list.appendChild(li);
    });
  };

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
