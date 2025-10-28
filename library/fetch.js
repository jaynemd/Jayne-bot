
const fetch = require('node-fetch');

/**
 * Fetch JSON from a URL
 * @param {string} url - the endpoint to fetch
 * @param {object} options - optional fetch options
 * @returns {Promise<object>} - parsed JSON response
 */
async function fetchJson(url, options = {}) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(`fetchJson error: ${err.message}`);
        throw err;
    }
}

module.exports = { fetchJson };