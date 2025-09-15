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

        // Cloudinary URL ya local uploads ke liye logic
        if (thumbnailUrl) {
            if (thumbnailUrl.startsWith('http')) {
                img.src = thumbnailUrl; // Cloudinary URL
            } else if (thumbnailUrl.startsWith('/uploads/')) {
                img.src = 'http://localhost:5000' + thumbnailUrl; // Local URL
            } else {
                img.src = 'http://localhost:5000/uploads/' + thumbnailUrl;
            }
        } else {
            img.src = ''; // fallback agar image na ho
        }

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
