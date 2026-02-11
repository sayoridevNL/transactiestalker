// 1. Get the main pieces from your HTML
let form = document.getElementById('txForm');
let txList = document.getElementById('txList');
let editInput = document.getElementById('editIndex');

// 2. Load the list from the browser's memory
let transactions = JSON.parse(localStorage.getItem('my_tasks')) || [];

// 3. The function that shows everything on the screen
function showData() {
    txList.innerHTML = ""; // Clear the list first
    let income = 0;
    let expense = 0;

    for (let i = 0; i < transactions.length; i++) {
        let item = transactions[i];
        
        // Add up the money
        if (item.type === 'income') {
            income = income + parseFloat(item.amount);
        } else {
            expense = expense + parseFloat(item.amount);
        }

        // Create a simple list item
        let li = document.createElement('li');
        
        // Use simple parts to make the text
        let text = item.category + ": €" + item.amount;
        let buttons = ` <button onclick="edit(${i})">Edit</button> 
                        <button onclick="del(${i})">X</button>`;
        
        li.innerHTML = text + buttons;
        txList.appendChild(li);
    }

    // Update the total display
    document.getElementById('incomeValue').innerText = "€" + income;
    document.getElementById('expenseValue').innerText = "€" + expense;
    
    // Save to memory
    localStorage.setItem('my_tasks', JSON.stringify(transactions));
}

// 4. Adding a new item
form.onsubmit = function(event) {
    event.preventDefault();

    let newItem = {
        date: document.getElementById('date').value,
        amount: document.getElementById('amount').value,
        type: document.getElementById('type').value,
        category: document.getElementById('category').value
    };

    let index = editInput.value;

    if (index == -1) {
        transactions.push(newItem); // Add new one
    } else {
        transactions[index] = newItem; // Overwrite old one
        editInput.value = -1; // Stop editing
    }

    form.reset();
    showData();
};

// 5. Delete and Edit functions
window.del = function(i) {
    transactions.splice(i, 1);
    showData();
};

window.edit = function(i) {
    let item = transactions[i];
    document.getElementById('date').value = item.date;
    document.getElementById('amount').value = item.amount;
    document.getElementById('type').value = item.type;
    document.getElementById('category').value = item.category;
    
    editInput.value = i; // Tell the form we are editing
};

// Run the function when the page opens
showData();