let interestedMax = 0;
let interval;
const UPDATE_INTERVAL = 10_000;


const updateImage = () => {
    const timestamp = new Date().getTime()
    const coffeeImageElement = document.getElementById('coffee-image');
    const coffeeImageEndpoint = '{{ api_host }}/coffee/image';
    const newImageUrl = coffeeImageEndpoint + '?t=' + timestamp;
    coffeeImageElement.src = newImageUrl;
    coffeeImageElement.setAttribute("data-timestamp", timestamp);
};


const updateInterested = () => {
    const interestedAmountEndpoint = '{{ api_host }}/interested/amount';
    const interestedElement = document.getElementById('interested');
    fetch(interestedAmountEndpoint)
        .then(response => response.text())
        .then(interestedAmount => {
            interestedElement.textContent = `Halukkaat: ${interestedAmount}/${interestedMax}`;
        });
};


const updateSeuranta = () => {
    const seurantaEndpoint = '{{ api_host }}/seuranta/users';
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
    const interestedMaxEndpoint = '{{ api_host }}/interested/max';
    fetch(interestedMaxEndpoint)
        .then(response => response.text())
        .then(interestedMaxResponse => {
            interestedMax = interestedMaxResponse;
            updateInterested();
        });

    document.getElementById('coffee-button').addEventListener('click', () => {
        const interestedPostEndpoint = '{{ api_host }}/interested';
        const interestedElement = document.getElementById('interested');
        fetch(interestedPostEndpoint, {
            method: 'POST'
        })
        .then(response => response.text())
        .then(interestedAmount => {
            interestedElement.textContent = `Halukkaat: ${interestedAmount}/${interestedMax}`;
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
