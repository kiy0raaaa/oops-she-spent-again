const CATEGORIES = {
    Food: 'Makanan', Drink: 'Minuman', Transport: 'Transportasi',
    Entertainment: 'Hiburan', Health: 'Kesehatan', Education: 'Pendidikan',
    Shopping: 'Belanja', Other: 'Other'
}

function getExpenses() { return JSON.parse(localStorage.getItem('expenses') || '[]') }
function getTargets()  { return JSON.parse(localStorage.getItem('targets')  || '{}') }

function deleteExpense(id) {
    if (!confirm('Hapus pengeluaran ini?')) return
    const updated = getExpenses().filter(e => e.id !== id)
    localStorage.setItem('expenses', JSON.stringify(updated))
    renderExpenses(document.getElementById('filter-category').value)
    renderTargetSummary()
}

function startEdit(id) {
    const e = getExpenses().find(e => e.id === id)
    if (!e) return
    
    const item = document.querySelector(`.expense-item[data-id="${id}"]`)
    item.classList.add('is-editing')
    item.innerHTML = `
        <div class="edit-form">
        <select class="edit-field" id="edit-cat-${id}">
            ${Object.entries(CATEGORIES).map(([val, label]) =>
            `<option value="${val}" ${e.description === val ? 'selected' : ''}>${label}</option>`
            ).join('')}
        </select>
        <input class="edit-field" id="edit-note-${id}"   type="text"   value="${e.note}">
        <div class="edit-row">
            <input class="edit-field" id="edit-amount-${id}" type="number" value="${e.amount}">
            <input class="edit-field" id="edit-date-${id}"   type="date"   value="${e.date}">
        </div>
        <div class="edit-actions">
            <button class="btn-save-edit"   onclick="saveEdit(${id})">Simpan</button>
            <button class="btn-cancel-edit" onclick="renderExpenses(document.getElementById('filter-category').value)">✕ Batal</button>
        </div>
        </div>
    `
}

function saveEdit(id) {
    const expenses = getExpenses()
    const idx = expenses.findIndex(e => e.id === id)
    if (idx === -1) return
    
    expenses[idx] = {
        ...expenses[idx],
        description: document.getElementById(`edit-cat-${id}`).value,
        note:        document.getElementById(`edit-note-${id}`).value,
        amount:      document.getElementById(`edit-amount-${id}`).value,
        date:        document.getElementById(`edit-date-${id}`).value,
    }
    
    localStorage.setItem('expenses', JSON.stringify(expenses))
    renderExpenses(document.getElementById('filter-category').value)
    renderTargetSummary()
}

function renderExpenses(filter = '') {
    const expenses = getExpenses()
    const el = document.getElementById('expense-list')
    const filtered = filter ? expenses.filter(e => e.description === filter) : expenses

    if (filtered.length === 0) {
        el.innerHTML = '<p>Belum ada pengeluaran' + (filter ? ' di kategori ini' : '') + '. Selamat!</p>'
    return
    }

    el.innerHTML = filtered.map(e => `
        <div class="expense-item">
        <div class="expense-left">
            <span class="expense-name">${e.note}</span>
            <span class="expense-category">${CATEGORIES[e.description] || e.description}</span>
        </div>
        <div class="expense-right">
            <div class="expense-desc">
                <span class="expense-amount">Rp ${Number(e.amount).toLocaleString('id-ID')}</span>
                <span class="expense-date">${e.date}</span>
            </div>
            <div class="item-actions">
                <button class="btn-edit-item" onclick="startEdit(${e.id})">✏️</button>
                <button class="btn-delete-item" onclick="deleteExpense(${e.id})">🗑️</button>
            </div>
        </div>
        </div>
    `).join('')
}

function renderTargetSummary() {
    const expenses = getExpenses()
    const targets  = getTargets()
    const el = document.getElementById('target-summary')

    if (Object.keys(targets).length === 0) {
    el.innerHTML = '<p class="no-target">Belum ada target. Set dulu yuk! 🎯</p>'
    return
    }

  // hitung spending per kategori
    const spent = {}
    expenses.forEach(e => {
    spent[e.description] = (spent[e.description] || 0) + Number(e.amount)
    })

    el.innerHTML = Object.entries(targets).map(([cat, budget]) => {
    const spentAmt  = spent[cat] || 0
    const pct       = Math.min((spentAmt / budget) * 100, 100)
    const fillClass = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'safe'
    const label     = CATEGORIES[cat] || cat

    return `
        <div class="progress-item">
            <div class="progress-header">
            <span class="progress-category">${label}</span>
            <span class="progress-amounts">Rp ${spentAmt.toLocaleString('id-ID')} / Rp ${Number(budget).toLocaleString('id-ID')}</span>
            </div>
            <div class="progress-bar">
            <div class="progress-fill ${fillClass}" style="width: ${pct}%"></div>
            </div>
            </div>
        `
    }).join('')
}

// filter handler
document.getElementById('filter-category').addEventListener('change', function() {
    renderExpenses(this.value)
})

renderExpenses()
renderTargetSummary()