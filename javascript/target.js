const CATEGORIES = {
    Food: 'Makanan', Drink: 'Minuman', Transport: 'Transportasi',
    Entertainment: 'Hiburan', Health: 'Kesehatan', Education: 'Pendidikan',
    Shopping: 'Belanja', Other: 'Other'
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
}

document.getElementById('target-form').addEventListener('submit', function(e) {
    e.preventDefault()

    const cat    = document.getElementById('target-category').value
    const amount = document.getElementById('target-amount').value

    const targets = getTargets()
    targets[cat] = amount
    saveTargets(targets)

    const isEdit = document.getElementById('edit-key').value !== ''
    alert(isEdit
    ? `Target ${CATEGORIES[cat] || cat} diperbarui!`
    : `Target ${CATEGORIES[cat] || cat} disimpan! Semoga bisa nahan diri ya!`
    )

    this.reset()
    document.getElementById('edit-key').value = ''
    const btn = document.getElementById('submit-btn')
    btn.textContent = 'Add Target'
    btn.classList.remove('editing')

    renderTargets()
})

renderTargets()