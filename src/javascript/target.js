const CATEGORIES = {
    Food: 'Makanan', Drink: 'Minuman', Transport: 'Transportasi',
    Entertainment: 'Hiburan', Health: 'Kesehatan', Education: 'Pendidikan',
    Shopping: 'Belanja', Other: 'Other'
}

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

function getTargets() { return JSON.parse(localStorage.getItem('targets') || '{}') }
function saveTargets(t) { localStorage.setItem('targets', JSON.stringify(t)) }

function renderTargets() {
    const targets = getTargets()
    const el = document.getElementById('targets-display')
    const entries = Object.entries(targets)

    if (entries.length === 0) {
        el.innerHTML = '<p class="no-targets">Belum ada target nih. Ayo disiplin!</p>'
        return
    }

    el.innerHTML = entries.map(([cat, amount]) => `
        <div class="target-item">
            <div class="target-left">
                <span class="target-category">${CATEGORIES[cat] || cat}</span>
                <span class="target-amount">Rp ${Number(amount).toLocaleString('id-ID')}</span>
            </div>
            <div class="target-actions">
                <button class="btn-edit" onclick="editTarget('${cat}')" title="Edit">✏️</button>
                <button class="btn-delete" onclick="deleteTarget('${cat}')" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('')
}

function editTarget(cat) {
    const targets = getTargets()
    document.getElementById('target-category').value = cat
    document.getElementById('target-amount').value   = targets[cat]
    document.getElementById('edit-key').value        = cat

    const btn = document.getElementById('submit-btn')
    btn.textContent = 'Simpan Perubahan'
    btn.classList.add('editing')

    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' })
}

function deleteTarget(cat) {
    const label = CATEGORIES[cat] || cat
    if (!confirm(`Hapus target untuk ${label}?`)) return
    const targets = getTargets()
    delete targets[cat]
    saveTargets(targets)
    renderTargets()
    showToast(`Target ${label} dihapus`, 'delete')
}

document.getElementById('target-form').addEventListener('submit', function(e) {
    e.preventDefault()

    const cat    = document.getElementById('target-category').value
    const amount = document.getElementById('target-amount').value

    const targets = getTargets()
    targets[cat] = amount
    saveTargets(targets)

    const isEdit = document.getElementById('edit-key').value !== ''
    showToast(isEdit
        ? `Target ${CATEGORIES[cat] || cat} diperbarui!`
        : `Target disimpan! Semoga bisa nahan diri ya`
    )

    this.reset()
    document.getElementById('edit-key').value = ''
    const btn = document.getElementById('submit-btn')
    btn.textContent = 'Add Target'
    btn.classList.remove('editing')

    renderTargets()
})

renderTargets()