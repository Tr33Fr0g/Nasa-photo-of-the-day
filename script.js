const datePicker = document.getElementById('date-picker');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const contentEl = document.getElementById('content');
const photoTitle = document.getElementById('photo-title');
const mediaContainer = document.getElementById('media-container');
const dateDisplay = document.getElementById('date-display');
const explanationEl = document.getElementById('explanation');
const copyrightEl = document.getElementById('copyright');

// NASA APOD API endpoint and demo key
const API_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = 'XpCUQsbO9zc00OFbRK6dR8oJ7O5oKqukWfd3HMoQ';



// Returns todays dat as a year month date string
function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Configures the date picker using valid boundaries only
function setupDatePicker() {
    datePicker.max = getTodayString();
    datePicker.min = '1995-06-16';
    datePicker.value = getTodayString();
}

// Fetches the photo from nasa and refreshes/updates the page
async function fetchAPOD(date) {
    //shows the loading state and hides the old content
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    contentEl.style.display = 'none';
    datePicker.disabled = true;

    try {
        //builds the api url using the key and optional date
        let url = `${API_URL}?api_key=${API_KEY}`;
        if (date) {
            url += `&date=${date}`;
        }
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 503) {
                throw new Error("NASA has not published the APOD for this date yet. Try again later.");
            }
            throw new Error("Failed to load the astronomy photo. Please try again.");
        }
        const data = await response.json();
        //Update the page using the returned data
        photoTitle.textContent = data.title;
        dateDisplay.textContent = data.date;
        explanationEl.textContent = data.explanation;

        // Shows copyright if possible i think
        if (data.copyright) {
            copyrightEl.textContent = `Image Credit: ${data.copyright}`;
            copyrightEl.style.display = 'block';
        } else {
            copyrightEl.style.display = 'none';
        }

        // Handles the video vs image media types
        if (data.media_type === 'video') {
            mediaContainer.innerHTML = `<iframe src="${data.url}" allowfullScreen></iframe>`;
            }    else {
                mediaContainer.innerHTML = `<img src="${data.url}" alt="${data.title}">`;
            }
            // Hides the loading and shows content
            loadingEl.style.display = 'none';
            contentEl.style.display = 'block';
        } catch (error) {
            //shows an error message if the fetch fails
            loadingEl.style.display = 'none';
            errorEl.textContent = 'Failed to load the astronomy photo. Please try again'
            errorEl.style.display = 'block';
        } finally {
            //always re-enable the date picker
            datePicker.disabled = false;
        }
}

datePicker.addEventListener('change', function () {
    fetchAPOD(this.value);
});
//setup the date picker and todays photo
setupDatePicker();
fetchAPOD();