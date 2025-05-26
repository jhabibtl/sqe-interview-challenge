document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // ** SUBSTITUA ESTE URL PELO URL DA SUA API NO REPL.IT (ou outra plataforma de backend) **
    const API_URL = 'https://e47b91dd-0303-4844-882f-b40217e5bdf7-00-zt0zvl9ny2eu.worf.replit.dev/tasks'; // Ex: 'https://seu-projeto-api.replit.app/tasks'

    // Função para carregar tarefas da API
    async function fetchTasks() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            alert('Não foi possível carregar as tarefas. Verifique a conexão com a API.');
        }
    }

    // Função para adicionar uma nova tarefa via API
    async function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('A tarefa não pode estar vazia!');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: taskText }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            taskInput.value = ''; // Limpa o input
            fetchTasks(); // Recarrega a lista para mostrar a nova tarefa
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
            alert('Não foi possível adicionar a tarefa.');
        }
    }

    // Função para alternar o status de uma tarefa via API (PUT)
    async function toggleTaskStatus(task) {
        try {
            const response = await fetch(`${API_URL}/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !task.completed }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fetchTasks(); // Recarrega a lista
        } catch (error) {
            console.error('Erro ao alternar status da tarefa:', error);
            alert('Não foi possível atualizar o status da tarefa.');
        }
    }

    // Função para remover uma tarefa via API (DELETE)
    async function removeTask(taskId) {
        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                // Se a tarefa não for encontrada (404), ainda queremos recarregar a lista
                if (response.status !== 404) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            fetchTasks(); // Recarrega a lista
        } catch (error) {
            console.error('Erro ao remover tarefa:', error);
            alert('Não foi possível remover a tarefa.');
        }
    }

    // Função para renderizar as tarefas na UI
    function renderTasks(tasks) {
        taskList.innerHTML = ''; // Limpa a lista existente
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.text;
            if (task.completed) {
                li.classList.add('completed');
            }
            // Adiciona listener para toggle status (clique no texto da tarefa)
            li.addEventListener('click', () => toggleTaskStatus(task));

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.classList.add('remove-btn');
            // Adiciona listener para remover (clique no botão 'Remover')
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que o evento de clique do <li> seja disparado
                removeTask(task.id);
            });

            li.appendChild(removeBtn);
            taskList.appendChild(li);
        });
    }

    // Event Listeners para botões e input
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Carregar tarefas quando a página é carregada
    fetchTasks();
});
