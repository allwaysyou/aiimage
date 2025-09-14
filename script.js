<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cards | My Website</title>
  <style>
  .cards-list {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 8px;
  }

  .card {
    background: #19194d;
    border-radius: 18px;
    box-shadow: 0 4px 18px #00000030;
    padding: 14px 10px;
    margin: 0 auto;
    max-width: 390px;
    text-align: center;
  }

  .card img {
    display: block;
    width: 94%;
    max-width: 340px;
    height: 202px;
    object-fit: cover;
    background: #fff;
    margin: 10px auto 12px;
    border-radius: 15px;
    box-shadow: 0 2px 12px #00000015;
  }

  .card-title {
    font-size: 1.16rem;
    color: #ecece1;
    font-weight: 700;
    margin-bottom: 3px;
  }

  .card-desc {
    font-size: 1.02rem;
    color: #d8d8e7;
    margin-bottom: 10px;
  }

  .copy-btn {
    background: #41cf60;
    color: #fff;
    font-weight: bold;
    padding: 8px 22px;
    border-radius: 8px;
    border: none;
    margin: 0 auto 2px;
    display: block;
    cursor: pointer;
    font-size: 1rem;
  }
  </style>
</head>
<body>
  <nav class="navbar">
    <span class="navbar-brand">My Website</span>
  </nav>

  <div class="page-container">
    <h1 style="margin-top:10px; font-size:2rem; text-align:center;">Cards</h1>
    <div class="search-bar-container">
      <div class="search-bar-premium">
        <input type="text" id="searchInput" placeholder="🔍 Search cards, prompts, tags..." />
      </div>
    </div>
    <div class="cards-list" id="cards-container"></div>
  </div>

  <script>
    const backendBase = 'https://aiimage-q8fv.onrender.com';
    let allCards = [];

    async function fetchCards() {
      try {
        const res = await fetch(backendBase + '/api/cards');
        if(!res.ok) throw new Error(res.statusText);
        return await res.json();
      } catch (err) {
        alert('Server se data lana mein error: ' + err.message);
        return [];
      }
    }

    function filterCards(cards, query) {
      query = query.trim().toLowerCase();
      if (!query) return cards;
      return cards.filter(card =>
        (card.buttonName && card.buttonName.toLowerCase().includes(query)) ||
        (card.promptText && card.promptText.toLowerCase().includes(query)) ||
        (Array.isArray(card.tags) && card.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    function showCards(cards) {
      const container = document.getElementById('cards-container');
      container.innerHTML = '';
      if (cards.length === 0) {
        container.innerHTML = '<p style="color:#bcbcdf; text-align:center;">Koi card available nahi hai.</p>';
        return;
      }
      cards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';

        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = card.buttonName || '';

        const img = document.createElement('img');
        img.src = card.thumbnailUrl && card.thumbnailUrl.startsWith('/uploads/')
          ? backendBase + card.thumbnailUrl
          : card.thumbnailUrl || '';
        img.alt = 'Card Image';

        const desc = document.createElement('div');
        desc.className = 'card-desc';
        desc.textContent = card.promptText || '';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'COPY';
        copyBtn.onclick = () => navigator.clipboard.writeText(card.promptText);

        cardDiv.appendChild(title);
        cardDiv.appendChild(img);
        cardDiv.appendChild(desc);
        cardDiv.appendChild(copyBtn);

        container.appendChild(cardDiv);
      });
    }

    document.getElementById('searchInput').addEventListener('input', (e) => {
      const query = e.target.value;
      showCards(filterCards(allCards, query));
    });

    async function renderCards() {
      allCards = await fetchCards();
      showCards(allCards);
    }

    renderCards();
  </script>
</body>
</html>
