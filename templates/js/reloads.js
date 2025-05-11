let interested_max = 0;

const interestedMaxEndpoint = "{{ api_host }}/interested/max";
fetch(interestedMaxEndpoint)
.then(response => response.text())
.then(interested_max_response => {
    interested_max = interested_max_response;
})

function updateCoffeeImage() {
    const coffeeImageEndpoint = "{{ api_host }}/coffee/image";
    const newImageUrl = coffeeImageEndpoint + "?t=" + new Date().getTime();

    document.getElementById("coffee-image").src = newImageUrl;
}

function updateInterested() {
    const interestedAmountEndpoint = "{{ api_host }}/interested/amount";
    const interestedElement = document.getElementById("interested");

    fetch(interestedAmountEndpoint)
    .then(response => response.text())
    .then(interested_amount => {
        interestedElement.textContent = `Halukkaat: ${interested_amount}/${interested_max}`;
    })
}

function updateSeuranta() {
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
}

function postInterested() {
    const interestedPostEndpoint = "{{ api_host }}/interested";
    fetch(interestedPostEndpoint, {
        method: "POST"
    });
    updateInterested()
}

setInterval(updateCoffeeImage, 10000);
setInterval(updateInterested, 10000);
setInterval(updateSeuranta, 10000);
