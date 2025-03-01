const AUTH_TOKEN = 'access_token';

const token = localStorage.getItem(AUTH_TOKEN) || '';


function _get(url, header) {
    return fetch(url, {
        method: 'GET',
        headers: header
    })
}

function _post(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function _put(url, data) {
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
}

