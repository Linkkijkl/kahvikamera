let interestedMax = 0;
let interval;
const UPDATE_INTERVAL = 10_000;


const updateImage = () => {
    const timestamp = new Date().getTime()
    const coffeeImageElement = document.getElementById('coffee-image');
    const coffeeImageEndpoint = 'https://kattila-api.linkkijkl.fi/coffee/image';
    const newImageUrl = coffeeImageEndpoint + '?t=' + timestamp;
    coffeeImageElement.src = newImageUrl;
    coffeeImageElement.setAttribute("data-timestamp", timestamp);
};


const updateInterested = () => {
    const interestedAmountEndpoint = 'https://kattila-api.linkkijkl.fi/interested/amount';
    const interestedElement = document.getElementById('interested');
    fetch(interestedAmountEndpoint)
        .then(response => response.text())
        .then(interestedAmount => {
            if (document.documentElement.lang === "en") {
                interestedElement.textContent = `Interested: ${interestedAmount}/${interestedMax}`;
            } else {
            interestedElement.textContent = `Halukkaat: ${interestedAmount}/${interestedMax}`;
            }
        });
};


const updateSeuranta = () => {
    const seurantaEndpoint = 'https://kattila-api.linkkijkl.fi/seuranta/users';
    const seurantaContainerElement = document.getElementById('seuranta-list');
    fetch(seurantaEndpoint)
        .then(response => response.json())
        .then(seurantaJson => {
            const userElements = new DocumentFragment;
            for (const user of seurantaJson.users) {
                const userElement = document.createElement('li');
                userElement.textContent = user.username;
                user.memberships ??= []
                userElement.dataset.memberships = user.memberships.join(" ");
                userElements.append(userElement);
            }
            seurantaContainerElement.replaceChildren(userElements);
        });
};


const startUpdating = () => {
    const update = () => {
        updateImage();
        updateInterested();
        updateSeuranta();
    };
    interval = setInterval(update, UPDATE_INTERVAL);
    update();
};


document.addEventListener('DOMContentLoaded', () => {
    const interestedMaxEndpoint = 'https://kattila-api.linkkijkl.fi/interested/max';
    fetch(interestedMaxEndpoint)
        .then(response => response.text())
        .then(interestedMaxResponse => {
            interestedMax = interestedMaxResponse;
            updateInterested();
        });

    document.getElementById('coffee-button').addEventListener('click', () => {
        const interestedPostEndpoint = 'https://kattila-api.linkkijkl.fi/interested';
        const interestedElement = document.getElementById('interested');
        fetch(interestedPostEndpoint, {
            method: 'POST'
        })
        .then(response => response.text())
        .then(interestedAmount => {
            if (document.documentElement.lang === "en") {
                interestedElement.textContent = `Interested: ${interestedAmount}/${interestedMax}`;
            } else {
                interestedElement.textContent = `Halukkaat: ${interestedAmount}/${interestedMax}`;
            }
        });
    });

    startUpdating();
});


document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(interval);
    } else {
        startUpdating();
    }
});
