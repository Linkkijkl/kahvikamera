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

function postInterested() {
    const interestedPostEndpoint = "{{ api_host }}/interested";
    fetch(interestedPostEndpoint, {
        method: "POST"
    });
}

setInterval(updateCoffeeImage, 10000);
setInterval(updateInterested, 10000);
