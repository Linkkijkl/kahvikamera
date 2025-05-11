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
    const seurantaEndpoint = "{{ api_host }}/seuranta/users";
    const seurantaContainerElement = document.getElementById("seuranta-list");
    fetch(seurantaEndpoint)
    .then(response => response.json())
    .then(seurantaJson => {
        let userElements = new DocumentFragment;
        for (let userIndex in seurantaJson.users) {
            userObject = seurantaJson.users[userIndex]
            let userElement = document.createElement("li");
            userElement.textContent = userObject.username;
            for (membershipIndex in userObject.memberships) {
                userElement.classList.add(userObject.memberships[membershipIndex]);
            }
            for (board_membershipIndex in userObject.board_memberships) {
                userElement.classList.add(`board-${userObject.board_memberships[board_membershipIndex]}`);
            }
            userElements.append(userElement);
        }
        seurantaContainerElement.replaceChildren(userElements);
    })
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
    };
    setInterval(() => update(), updateInterval);
    update();
});