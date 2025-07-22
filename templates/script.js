const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('image');
const uploadBtn = document.getElementById('upload-btn');
const loading = document.getElementById('loading');
const resultBox = document.getElementById('result');
const outputImg = document.getElementById('output-img');
const detectionsList = document.getElementById('detections-list');

let selectedFile = null;

// Drag & Drop Events
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = '#e0f2f1';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.backgroundColor = '';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    selectedFile = e.dataTransfer.files[0];
    fileInput.files = e.dataTransfer.files;
});

// File picker fallback
fileInput.addEventListener('change', () => {
    selectedFile = fileInput.files[0];
});

// Upload button
uploadBtn.onclick = async () => {
    if (!selectedFile) {
        alert('Please select or drop an image first.');
        return;
    }

    loading.classList.remove('hidden');
    resultBox.classList.add('hidden');
    detectionsList.innerHTML = '';

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
        const res = await fetch('/detect', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (data.image_url) {
            outputImg.src = '/' + data.image_url;
            data.detections.forEach(obj => {
                const li = document.createElement('li');
                li.textContent = `${obj.name} (Confidence: ${(obj.confidence || obj.conf).toFixed(2)})`;
                detectionsList.appendChild(li);
            });

            resultBox.classList.remove('hidden');
        } else {
            alert(data.error || 'Error detecting objects.');
        }

    } catch (err) {
        alert('Upload failed. See console.');
        console.error(err);
    } finally {
        loading.classList.add('hidden');
    }
};
