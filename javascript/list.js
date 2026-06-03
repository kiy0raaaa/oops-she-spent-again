function renderExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')
    const el = document.getElementById('expense-list')

    if (expenses.length === 0) {
        el.innerHTML = '<p>Belum ada pengeluaran.</p>'
        return
    }

    el.innerHTML = expenses.map(e => `
        <div class="expense-item">
            <div class="expense-left">
                <span class="expense-name">${e.note}</span>
                <span class="expense-category">${e.description}</span>
            </div>
            <div class="expense-right">
                <span class="expense-amount">Rp ${Number(e.amount).toLocaleString('id-ID')}</span>
                <span class="expense-date">${e.date}</span>
            </div>
        </div>
    `).join('')
}

renderExpenses()