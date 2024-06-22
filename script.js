document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('searchForm');
    const yearSwitch = document.getElementById('yearSwitch');
    const resultContainer = document.getElementById('resultContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        resultContainer.innerHTML = ''; // Clear previous results
        loadingIndicator.style.display = 'block'; // Show loading indicator

        const sbd = document.getElementById('sbd').value.trim();
        const year = yearSwitch.value;

        if (sbd === '') {
            loadingIndicator.style.display = 'none'; // Hide loading indicator
            alert('Vui lòng nhập SBD');
            return;
        }

        fetch(`data_${year}.csv`)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                let found = false;

                rows.forEach(row => {
                    const columns = row.split(',');
                    const studentSbd = columns[0].trim();

                    if (studentSbd === sbd) {
                        found = true;
                        displayResult(columns);
                    }
                });

                if (!found) {
                    displayNotFound();
                }

                loadingIndicator.style.display = 'none'; // Hide loading indicator
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                displayError();
                loadingIndicator.style.display = 'none'; // Hide loading indicator
            });
    });

    function displayResult(columns) {
        const subjects = ['Toán', 'Ngữ Văn', 'Ngoại Ngữ', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Lịch Sử', 'Địa Lý', 'GDCD'];

        const resultHTML = subjects.map((subject, index) => {
            return `
                <div class="result-item">
                    <span class="result-label">${subject}:</span>
                    <span class="result-value">${columns[index + 1]}</span>
                </div>
            `;
        }).join('');

        resultContainer.innerHTML = resultHTML;
    }

    function displayNotFound() {
        resultContainer.innerHTML = '<p>Không tìm thấy thông tin cho SBD này.</p>';
    }

    function displayError() {
        resultContainer.innerHTML = '<p>Có lỗi xảy ra trong quá trình tra cứu.</p>';
    }
});
