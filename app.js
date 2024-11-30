
const API_URL="http://localhost:5002/todos"

//INICIALIZAR LA APLICACIÓN
document.addEventListener("DOMContentLoaded", ()=>{
    fetchTodos();
});

//OBTENER TAREAS DEL SERVIDOR
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        console.log(todos);
        renderTodos(todos);

    } catch (error) {
        console.log(error)        
    }
}

function renderTodos(todos){
    const todoList = document.querySelector('#todo-list')
    todoList.innerHTML = "";

    todos.forEach((todo) => {
        const todoItem = document.createElement("li");
        todoItem.innerHTML = `
        <span class="todo-text" data-id="${todo.id}">${todo.text}</span>
        <input type="checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.id}">
        <button data-id="${todo.id}" class="update-btn">actualizar</button>
        <button data-id="${todo.id}" class="delet-btn">Borrar</button>
        `;
        todoList.appendChild(todoItem)
    });
}

//AGREGAR DATOS
document.querySelector("#todo-form").addEventListener("submit",async(e)=>{
    e.preventDefault();
    const text= document.querySelector("#todo-input").value.trim();
    if (text==="")return;
    try {
        const response = await fetch(API_URL,{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body: JSON.stringify({text})
        });
        await response.json();
        fetchTodos();
        document.querySelector("#todos-input").value="";

    } catch (error) {
        console.log(error)
    }
    
});

//ACTUALIZAR LOS ESTADOS Y EL TEXTO DE LA TAREA

document.querySelector("#todo-list").addEventListener("click",(e) =>{
    const id = e.target.dataset.id;
    if (e.target.classList.contains("update-btn")) {
        const todoText = document.querySelector(`.todo-text[data-id="${id}"]`)
        const newText = prompt("Editar tarea:",todoText.textContent)

        if (newText && newText.trim()!=="") {
            updateTodoText (id,newText.trim())
        }

    }else if(e.target.type=='checkbox'){
        updateTodotstatus(id,e.target.checked)
        
    }else if(e.target.classList.contains("delet-btn")){
        deletetodo(id);
    }
});

async function updateTodoText(id,newText) {
    try {
        await fetch(`${API_URL}/${id}`,{
            method:"PUT",
            headers:{"content-type":"application/json"},
            body: JSON.stringify({text:newText})
        })
        fetchTodos();
    } catch (error) {
        console.log("Erro al actualizar el texto ", error)
    }
}

//ACTUALIZAR EL ESTADO (COMPLETADO)

async function updateTodotstatus(id,completed) {
    try {
        await fetch(`${API_URL}/${id}`,{
            method:"PUT",
            headers:{"content-type":"application/json"},
            body: JSON.stringify({completed})
        })
        fetchTodos();
    } catch (error) {
        console.log("Se ha preentado un error al actualizar el estado ", error)
    }
}

async function deletetodo(id) {
    console.log("estoy en deletetodo",id)
    try {
        await fetch(`${API_URL}/${id}`,{
            method:"DELETE",
        })
        fetchTodos();
    } catch (error) {
        console.log("Error al borrar tareas ", error)
    }
    
}

