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

    alert('Tercatat. Semoga ini yang terakhir hari ini ya! 🙏')
    this.reset()
})