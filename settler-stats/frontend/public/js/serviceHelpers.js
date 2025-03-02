const AUTH_TOKEN = 'access_token';

let token = localStorage.getItem(AUTH_TOKEN) || '';

const _buildHeader = (noToken) => {
    const h = {
        'Content-Type': 'application/json'
    };

    console.log("token: ", token);
    if (token !== '' && !noToken) {
        h['Authorization'] = `Bearer ${token}`;
    }

    return h;
}

const _get = async(url, noToken) => {
    
    const h = _buildHeader(noToken);

    const res = fetch(url, {
        method: 'GET',
        headers: h
    })

    return res;
}


const _post = async(url, data, noToken) => {
    const h = _buildHeader(noToken);

    const res = await fetch(url, {
        method: 'POST',
        headers: h,
        body: JSON.stringify(data)
    });

    return res;
}

const _put = async(url, data) => {
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    return res;
}

const _delete = async(url) => {
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    return res;
}

