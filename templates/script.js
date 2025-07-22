document.getElementById('upload-form').onsubmit = async function (e) {
    e.preventDefault();

    const imageInput = document.getElementById('image');
    const loading = document.getElementById('loading');
    const resultBox = document.getElementById('result');
    const detectionsList = document.getElementById('detections-list');
    const outputImg = document.getElementById('output-img');

    if (!imageInput.files.length) {
        alert("Please select an image!");
        return;
    }

    loading.classList.remove('hidden');
    resultBox.classList.add('hidden');

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    try {
        const response = await fetch('/detect', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.image_url) {
            outputImg.src = '/' + data.image_url;
            detectionsList.innerHTML = "";

            if (data.detections.length === 0) {
                detectionsList.innerHTML = "<li>No objects detected.</li>";
            } else {
                data.detections.forEach(det => {
                    const item = document.createElement('li');
                    item.textContent = `${det.name} (Confidence: ${(det.confidence || det.conf).toFixed(2)})`;
                    detectionsList.appendChild(item);
                });
            }

            resultBox.classList.remove('hidden');
        } else {
            alert('Detection failed: ' + (data.error || 'Unknown error'));
        }
    } catch (err) {
        alert("Error communicating with server.");
        console.error(err);
    }

    loading.classList.add('hidden');
};
