export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method == 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        const date = req.query.date;
        const apiKey = process.env.NASA_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'The API key is missing' });
        } 
        let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
        if (date) {
            url += `&date=${date}`;
        }
        
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 503) {
                return res.status(503).json({ error: 'APOD is not published for that date yet' });
            }
            return res.status(response.status).json({ error: 'NASA API failed'});
        }
        const data = await response.json();
        return res.json(data)
      
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'something broke'});
    } 
}