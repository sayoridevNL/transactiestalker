const form = document.getElementById('txForm');
const txList = document.getElementById('txList');
const incomeValue = document.getElementById('incomeValue');
const expenseValue = document.getElementById('expenseValue');
const errorMessage = document.getElementById('errorMessage');
const editIndexInput = document.getElementById('editIndex');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

function render() {
    txList.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx, index) => {
        const amount = parseFloat(tx.amount);
        if (tx.type === 'income') totalIncome += amount;
        else totalExpense += amount;

        const li = document.createElement('li');
        li.className = 'transaction-item';
        li.innerHTML = `
      <div class="transaction-info">
        <span class="transaction-category">${tx.category}</span>
        <span class="transaction-date">${tx.date}</span>
      </div>
      <div class="transaction-actions">
        <span class="transaction-amount ${tx.type === 'income' ? 'income-amount' : 'expense-amount'}">
          ${tx.type === 'income' ? '+' : '-'} €${amount.toFixed(2)}
        </span>
        <button class="btn-icon btn-edit" title="Bewerken" onclick="editTransaction(${index})">
          Edit
        </button>
        <button class="btn-icon btn-delete" title="Verwijderen" onclick="deleteTransaction(${index})">
          Delete
        </button>
      </div>
    `;
        txList.appendChild(li);
    });

    incomeValue.textContent = `€ ${totalIncome.toFixed(2)}`;
    expenseValue.textContent = `€ ${totalExpense.toFixed(2)}`;
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const editIndex = parseInt(editIndexInput.value);

    // Validation
    if (!date || isNaN(amount) || amount <= 0 || !category.trim()) {
        showError('Vul alle velden geldig in. Bedrag moet groter zijn dan 0.');
        return;
    }

    const transaction = { date, amount, type, category: category.trim() };

    if (editIndex === -1) {
        // Create
        transactions.push(transaction);
    } else {
        // Update
        transactions[editIndex] = transaction;
        editIndexInput.value = -1;
        form.querySelector('button[type="submit"]').textContent = 'Transactie Toevoegen';
    }

    saveData();
    render();
    form.reset();
});

window.deleteTransaction = function (index) {
    if (confirm('Weet je zeker dat je deze transactie wilt verwijderen?')) {
        transactions.splice(index, 1);
        saveData();
        render();
    }
};

window.editTransaction = function (index) {
    const tx = transactions[index];
    document.getElementById('date').value = tx.date;
    document.getElementById('amount').value = tx.amount;
    document.getElementById('type').value = tx.type;
    document.getElementById('category').value = tx.category;
    editIndexInput.value = index;

    form.querySelector('button[type="submit"]').textContent = 'Wijziging Opslaan';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Initial render
render();