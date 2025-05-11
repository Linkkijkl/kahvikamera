let interestedMax = 0;

const updateImage = () => {
    const coffeeImageEndpoint = '{{ api_host }}/coffee/image';
    const newImageUrl = coffeeImageEndpoint + '?t=' + new Date().getTime();
    document.getElementById('coffee-image').src = newImageUrl;
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
                for (const membership of user.memberships) {
                    userElement.classList.add(membership);
                }
                for (const boardMembership of user.board_memberships) {
                    userElement.classList.add(`board-${boardMembership}`);
                }
                userElements.append(userElement);
            }
            seurantaContainerElement.replaceChildren(userElements);
        });
};

document.addEventListener('DOMContentLoaded', () => {
    const interestedMaxEndpoint = '{{ api_host }}/interested/max';
    fetch(interestedMaxEndpoint)
        .then(response => response.text())
        .then(interestedMaxResponse => {
            interestedMax = interestedMaxResponse;
        });

    document.getElementById('coffee-button').addEventListener('click', () => {
        const interestedPostEndpoint = '{{ api_host }}/interested';
        fetch(interestedPostEndpoint, {
            method: 'POST'
        });
        updateInterested();
    }); 
    
    const updateInterval = 10_000;
    const update = () => {
        updateImage();
        updateInterested();
        updateSeuranta();
    };
    setInterval(update, updateInterval);
    update();
});