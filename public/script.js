document.addEventListener('DOMContentLoaded', function() {
    const itemForm = document.getElementById('itemForm');
    const itemsList = document.getElementById('itemsList');
  
    // Función para obtener y mostrar los registros
    async function fetchItems() {
      const res = await fetch('/api/items');
      const items = await res.json();
      displayItems(items);
    }
  
    // Mostrar los registros en el DOM
    function displayItems(items) {
      itemsList.innerHTML = '';
      items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <button onclick="editItem(${item.id})">Editar</button>
          <button onclick="deleteItem(${item.id})">Eliminar</button>
        `;
        itemsList.appendChild(itemDiv);
      });
    }
  
    // Manejar el envío del formulario (crear o actualizar registro)
    itemForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const itemId = document.getElementById('itemId').value;
      const name = document.getElementById('name').value;
      const description = document.getElementById('description').value;
      
      if (itemId) {
        // Actualizar registro existente
        await fetch(`/api/items/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description })
        });
      } else {
        // Crear nuevo registro
        await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description })
        });
      }
      // Reiniciar formulario y recargar los registros
      itemForm.reset();
      document.getElementById('itemId').value = '';
      fetchItems();
    });
  
    // Función para editar un registro
    window.editItem = async function(id) {
      const res = await fetch(`/api/items/${id}`);
      const item = await res.json();
      document.getElementById('itemId').value = item.id;
      document.getElementById('name').value = item.name;
      document.getElementById('description').value = item.description;
    };
  
    // Función para eliminar un registro
    window.deleteItem = async function(id) {
      await fetch(`/api/items/${id}`, {
        method: 'DELETE'
      });
      fetchItems();
    };
  
    // Cargar los registros al iniciar
    fetchItems();
  });
  