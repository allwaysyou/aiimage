// Backend se cards fetch karna
async function fetchCards() {
    try {
        const res = await fetch('http://localhost:5000/api/cards');
        return await res.json();
    } catch (err) {
        alert('Server se data lana mein error: '+ err.message);
        return [];
    }
}

async function renderCards() {
    const container = document.getElementById('cards-container');
    const cards = await fetchCards();
    container.innerHTML = '';

    if (cards.length === 0) {
        container.innerHTML = '<p>Koi card available nahi hai. Admin panel se add karein.</p>';
        return;
    }

    cards.forEach(({ buttonName, promptText, thumbnailUrl }) => {
        const card = document.createElement('div');
        card.className = 'card';

        const btn = document.createElement('button');
        btn.textContent = buttonName;
        btn.setAttribute('data-prompt', promptText);
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(promptText).then(() => {
                alert('Prompt copied: ' + promptText);
            }).catch(() => {
                alert('Copy karne mein problem hui');
            });
        });

        const img = document.createElement('img');
        img.src = thumbnailUrl;
        img.alt = 'YouTube Thumbnail';

        card.appendChild(btn);
        card.appendChild(img);
        container.appendChild(card);
    });
}

renderCards();
