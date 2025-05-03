"use strict";
//@ts-check


function getEndpoint(endpoint) {
    const endpointDiv = document.getElementById(endpoint);
    const responseSpan = endpointDiv.querySelector(".response")
    responseSpan.textContent = "fetching...";
    fetch(`{{ api_host }}/${endpoint}`)
    .then(response => response.json())
    .then(json => {
        responseSpan.textContent = JSON.stringify(json);
    })
}

function postEndpoint(endpoint) {
    const endpointDiv = document.getElementById(endpoint);
    const responseSpan = endpointDiv.querySelector(".response")
    const endpointInputElements = endpointDiv.querySelectorAll("input[type=text]")
    responseSpan.textContent = "parsing input client-side...";
    const data = {};
    endpointInputElements.forEach(element => {
        data[element.name] = parseFloat(element.value);
    });
    const apiToken = document.getElementById("api-token");
    responseSpan.textContent = "posting...";
    fetch(`http://api.goldhill.fi/${endpoint}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiToken.value
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
    .then(json => {
        responseSpan.textContent = JSON.stringify(json);
    });
}