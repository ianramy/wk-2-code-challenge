// script.js
document.addEventListener('DOMContentLoaded', () => {
    const itemInput = document.getElementById('itemInput');
    const addItemButton = document.getElementById('addItem');
    const itemList = document.getElementById('itemList');
    const clearListButton = document.getElementById('clearList');

    // Load items from local storage
    const loadItems = () => {
        const items = JSON.parse(localStorage.getItem('shoppingList')) || [];
        items.forEach(item => {
            addItemToDOM(item.text, item.purchased);
        });
    };

    // Save items to local storage
    const saveItems = () => {
        const items = [];
        itemList.querySelectorAll('li').forEach(li => {
            items.push({
                text: li.querySelector('.item-text').textContent,
                purchased: li.classList.contains('purchased')
            });
        });
        localStorage.setItem('shoppingList', JSON.stringify(items));
    };

    // Add item to DOM
    const addItemToDOM = (text, purchased = false) => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = text;
        span.className = 'item-text';

        if (purchased) {
            li.classList.add('purchased');
        }

        // Toggle purchased status
        li.addEventListener('click', (e) => {
            if (e.target !== span) return; // Only mark item purchased if text is clicked
            li.classList.toggle('purchased');
            saveItems();
        });

        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            span.textContent = '';
            span.appendChild(input);
            input.focus();

            // Save edited item
            input.addEventListener('blur', () => {
                span.textContent = input.value;
                saveItems();
            });

            // Save on Enter key
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            li.remove();
            saveItems();
        });

        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        itemList.appendChild(li);
    };

    // Add item handler
    const addItemHandler = () => {
        const itemText = itemInput.value.trim();
        if (itemText) {
            addItemToDOM(itemText);
            itemInput.value = '';
            saveItems();
        }
    };

    // Add item button click
    addItemButton.addEventListener('click', addItemHandler);

    // Add item on Enter key
    itemInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addItemHandler();
        }
    });

    // Clear list handler
    clearListButton.addEventListener('click', () => {
        itemList.innerHTML = '';
        localStorage.removeItem('shoppingList');
    });

    // Load initial items
    loadItems();
});
