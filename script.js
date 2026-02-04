let form  = document.getElementById('txForm');
let text = document.getElementById('txList');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let dateValue = document.getElementById('date').value;
    let amountValue = document.getElementById('amount').value;
    let typeValue = document.getElementById('type').value;
    let categoryValue = document.getElementById('category').value; 

    let transaction = `Date: ${dateValue}, Amount: ${amountValue}, Type: ${typeValue}, Category: ${categoryValue}\n`;
    text.innerHTML += transaction;
});