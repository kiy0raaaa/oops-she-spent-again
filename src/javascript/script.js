function showToast(message, type = 'success') {
    const existing = document.getElementById('toast')
    if (existing) existing.remove()

    const toast = document.createElement('div')
    toast.id = 'toast'
    toast.className = `toast toast-${type}`
    toast.textContent = message
    document.body.appendChild(toast)

    requestAnimationFrame(() => toast.classList.add('toast-show'))

    setTimeout(() => {
        toast.classList.remove('toast-show')
        setTimeout(() => toast.remove(), 300)
    }, 3000)
}

document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault()

    const expense = {
        id: Date.now(),
        description: document.getElementById('description').value,
        note: document.getElementById('note').value,
        amount: document.getElementById('amount').value,
        date: document.getElementById('date').value
    }

    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')
    expenses.push(expense)
    localStorage.setItem('expenses', JSON.stringify(expenses))

    showToast('Tercatat. Semoga ini yang terakhir hari ini ya!')
    this.reset()
})