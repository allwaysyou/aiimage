const form = document.getElementById('add-card-form');
const container = document.getElementById('cards-container');

async function fetchCards() {
    try {
        const res = await fetch('http://localhost:5000/api/cards');
        if (!res.ok) throw new Error('Failed to fetch cards: ' + res.status);
        return await res.json();
    } catch (err) {
        alert('Server se data lana mein error: ' + err.message);
        return [];
    }
}

async function deleteCard(id) {
    if (!confirm('Kya aap ye card delete karna chahte hain?')) return;
    try {
        const res = await fetch(`http://localhost:5000/api/cards/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (res.ok) {
            alert('Card delete ho gaya!');
            renderAdminCards();
        } else {
            alert(data.error || 'Delete karne mein error aayi');
        }
    } catch (err) {
        alert('Server se delete karne mein error: ' + err.message);
    }
}

async function renderAdminCards() {
    const cards = await fetchCards();
    container.innerHTML = '';
    if (!cards.length) {
        container.innerHTML = '<p style="color:#bcbcdf;">Koi card abhi tak add nahi hua hai.</p>';
        return;
    }
    cards.forEach(({ _id, buttonName, promptText, thumbnailUrl }) => {
        const card = document.createElement('div');
        card.className = 'card';

        const btnTry = document.createElement('button');
        btnTry.className = 'try-btn';
        btnTry.textContent = buttonName;
        btnTry.addEventListener('click', () => {
            navigator.clipboard.writeText(promptText).then(() => {
                alert('Prompt copied: ' + promptText);
            }).catch(() => {
                alert('Copy karne mein problem hui');
            });
        });

        const img = document.createElement('img');
        img.src = thumbnailUrl;
        img.alt = 'Thumbnail';

        const p = document.createElement('p');
        p.textContent = promptText;

        const btnDelete = document.createElement('button');
        btnDelete.className = 'delete-btn';
        btnDelete.innerHTML = '×';
        btnDelete.title = 'Card Delete Karein';
        btnDelete.onclick = () => deleteCard(_id);

        card.appendChild(btnTry);
        card.appendChild(img);
        card.appendChild(p);
        card.appendChild(btnDelete);

        container.appendChild(card);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const buttonName = document.getElementById('buttonName').value.trim();
    const promptText = document.getElementById('promptText').value.trim();
    const thumbnailUrl = document.getElementById('thumbnailUrl').value.trim();
    const imageFile = document.getElementById('imageFile').files[0];

    if (!buttonName || !promptText || (!thumbnailUrl && !imageFile)) {
        alert('Sabhi field bharna zaroori hai!');
        return;
    }

    const formData = new FormData();
    formData.append('buttonName', buttonName);
    formData.append('promptText', promptText);
    formData.append('thumbnailUrl', thumbnailUrl);
    if (imageFile) formData.append('image', imageFile);

    try {
        const res = await fetch('http://localhost:5000/api/cards', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            form.reset();
            renderAdminCards();
        } else {
            alert('Error: ' + (data.error || 'Unknown error'));
        }
    } catch (err) {
        alert('Server se data bhejne mein error: ' + err.message);
    }
});

renderAdminCards();
