let form = document.getElementById('txForm');
let text = document.getElementById('txList');
let incomeValue = document.getElementById('incomeValue');
let expenseValue = document.getElementById('expenseValue');

// Initialize the display to 0 so the math works immediately
incomeValue.textContent = "0";
expenseValue.textContent = "0";

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Get Values
    let dateValue = document.getElementById('date').value;
    let amountValue = parseFloat(document.getElementById('amount').value) || 0;
    let typeValue = document.getElementById('type').value; // 'income' or 'expense'
    let categoryValue = document.getElementById('category').value; 

    // 2. Add to List
    let newLine = document.createElement('li');
    newLine.textContent = `${dateValue} - ${categoryValue}: €${amountValue.toFixed(2)}`;
    text.appendChild(newLine);

    // 3. Update Totals (Matching your HTML lowercase values)
    if (typeValue === 'income') {
        let currentIncome = parseFloat(incomeValue.textContent);
        incomeValue.textContent = (currentIncome + amountValue).toFixed(2);
    } else if (typeValue === 'expense') {
        let currentExpense = parseFloat(expenseValue.textContent);
        expenseValue.textContent = (currentExpense + amountValue).toFixed(2);
    }

    // 4. Clear form
    form.reset();
});