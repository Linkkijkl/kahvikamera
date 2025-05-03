function updateImage() {
    const imageUrl = "{{ api_host }}/coffee/image";
    const newImageUrl = imageUrl + "?t=" + new Date().getTime();

    document.getElementById("coffee-image").src = newImageUrl;
}

setInterval(updateImage, 10000);
