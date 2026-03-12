let form = document.getElementById('txForm');
let subForm = document.getElementById('subForm');
let upcomingForm = document.getElementById('upcomingForm');
let txList = document.getElementById('txList');
let subList = document.getElementById('subList');
let upcomingList = document.getElementById('upcomingList');
let editInput = document.getElementById('editIndex');
let subEditInput = document.getElementById('subEditIndex');

let transactions = JSON.parse(localStorage.getItem('my_tasks')) || [];
let subscriptions = JSON.parse(localStorage.getItem('my_subs')) || [];
let oneOffUpcoming = JSON.parse(localStorage.getItem('my_upcomings')) || [];

function showData() {
    txList.innerHTML = "";
    let income = 0;
    let expense = 0;

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    for (let i = 0; i < transactions.length; i++) {
        let item = transactions[i];
        if (item.type === 'income') income += parseFloat(item.amount);
        else expense += parseFloat(item.amount);

        let li = document.createElement('li');
        li.innerHTML = `
            <div class="tx-info">
                <span class="tx-date">${item.date}</span>
                <span class="tx-cat">${item.category}</span>
            </div>
            <div class="tx-amount ${item.type}">€${item.amount}</div>
            <div class="tx-actions">
                <button onclick="edit(${i})">Edit</button> 
                <button onclick="del(${i})">X</button>
            </div>`;
        txList.appendChild(li);
    }

    document.getElementById('incomeValue').innerText = "€ " + income.toFixed(2);
    document.getElementById('expenseValue').innerText = "€ " + expense.toFixed(2);

    subList.innerHTML = "";
    subscriptions.forEach((sub, i) => {
        let li = document.createElement('li');
        li.innerHTML = `
            <div class="tx-info">
                <span class="tx-date">Volgende: ${sub.date}</span>
                <span class="tx-cat">${sub.name} <small>(${sub.interval})</small></span>
            </div>
            <div class="tx-amount expense">€${sub.amount}</div>
            <div class="tx-actions">
                <button onclick="paySub(${i})">Betaald</button>
                <button onclick="editSub(${i})">Edit</button> 
                <button onclick="delSub(${i})">X</button>
            </div>`;
        subList.appendChild(li);
    });

    showUpcoming();

    localStorage.setItem('my_tasks', JSON.stringify(transactions));
    localStorage.setItem('my_subs', JSON.stringify(subscriptions));
    localStorage.setItem('my_upcomings', JSON.stringify(oneOffUpcoming));
}

function showUpcoming() {
    upcomingList.innerHTML = "";
    let total = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    let items = [];

    subscriptions.forEach((sub, subIdx) => {
        let d = new Date(sub.date);
        while (d <= nextMonth) {
            if (d >= today) {
                items.push({ name: sub.name, amount: sub.amount, date: new Date(d), type: 'sub', index: subIdx });
            }
            if (sub.interval === 'monthly') d.setMonth(d.getMonth() + 1);
            else d.setFullYear(d.getFullYear() + 1);
        }
    });

    oneOffUpcoming.forEach((up, upIdx) => {
        let d = new Date(up.date);
        if (d <= nextMonth) {
            items.push({ name: up.name, amount: up.amount, date: d, type: 'oneoff', index: upIdx });
        }
    });

    items.sort((a, b) => a.date - b.date);

    items.forEach(item => {
        total += parseFloat(item.amount);
        let li = document.createElement('li');
        let diff = Math.ceil((item.date - today) / (1000 * 60 * 60 * 24));
        let relative = diff === 0 ? "Vandaag" : diff === 1 ? "Morgen" : `Over ${diff} dagen`;

        let actionBtn = item.type === 'oneoff'
            ? `<button onclick="payUpcoming(${item.index})">Bevestig</button>`
            : `<button onclick="paySub(${item.index})">Bevestig</button>`;

        li.innerHTML = `
            <div class="tx-info">
                <span class="tx-date">${relative} (${item.date.toLocaleDateString('nl-NL')})</span>
                <span class="tx-cat">${item.name}</span>
            </div>
            <div class="tx-amount expense">€${item.amount}</div>
            <div class="tx-actions">
                ${actionBtn}
                ${item.type === 'oneoff' ? `<button onclick="delUpcoming(${item.index})">X</button>` : ''}
            </div>`;
        upcomingList.appendChild(li);
    });

    document.getElementById('upcomingTotal').innerText = `Totaal komende 30 dagen: € ${total.toFixed(2)}`;
}

form.onsubmit = function (event) {
    event.preventDefault();
    let newItem = {
        date: document.getElementById('date').value,
        amount: document.getElementById('amount').value,
        type: document.getElementById('type').value,
        category: document.getElementById('category').value
    };
    let index = editInput.value;
    if (index == -1) transactions.push(newItem);
    else {
        transactions[index] = newItem;
        editInput.value = -1;
    }
    form.reset();
    showData();
};

subForm.onsubmit = function (event) {
    event.preventDefault();
    let newItem = {
        name: document.getElementById('subName').value,
        amount: document.getElementById('subAmount').value,
        date: document.getElementById('subDate').value,
        interval: document.getElementById('subInterval').value
    };
    let index = subEditInput.value;
    if (index == -1) subscriptions.push(newItem);
    else {
        subscriptions[index] = newItem;
        subEditInput.value = -1;
    }
    subForm.reset();
    showData();
};

if (upcomingForm) {
    upcomingForm.onsubmit = function (event) {
        event.preventDefault();
        let newItem = {
            name: document.getElementById('upName').value,
            amount: document.getElementById('upAmount').value,
            date: document.getElementById('upDate').value
        };
        oneOffUpcoming.push(newItem);
        upcomingForm.reset();
        showData();
    };
}

window.del = (i) => { transactions.splice(i, 1); showData(); };
window.edit = (i) => {
    let item = transactions[i];
    document.getElementById('date').value = item.date;
    document.getElementById('amount').value = item.amount;
    document.getElementById('type').value = item.type;
    document.getElementById('category').value = item.category;
    editInput.value = i;
};

window.delSub = (i) => { subscriptions.splice(i, 1); showData(); };
window.editSub = (i) => {
    let item = subscriptions[i];
    document.getElementById('subName').value = item.name;
    document.getElementById('subAmount').value = item.amount;
    document.getElementById('subDate').value = item.date;
    document.getElementById('subInterval').value = item.interval;
    subEditInput.value = i;
};

window.paySub = (i) => {
    let sub = subscriptions[i];
    transactions.push({
        date: sub.date,
        amount: sub.amount,
        type: 'expense',
        category: sub.name
    });
    let d = new Date(sub.date);
    if (sub.interval === 'monthly') d.setMonth(d.getMonth() + 1);
    else d.setFullYear(d.getFullYear() + 1);
    sub.date = d.toISOString().split('T')[0];
    showData();
};

window.payUpcoming = (i) => {
    let up = oneOffUpcoming[i];
    transactions.push({
        date: up.date,
        amount: up.amount,
        type: 'expense',
        category: up.name
    });
    oneOffUpcoming.splice(i, 1);
    showData();
};

window.delUpcoming = (i) => { oneOffUpcoming.splice(i, 1); showData(); };

document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});

showData();