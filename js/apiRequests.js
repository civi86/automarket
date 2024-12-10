const backEndUrl = 'https://automarketbackend.onrender.com/api'

const registrationRequest = async (data) => {
    const request = new Request(backEndUrl + '/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),

    })
    const response = await fetch(request)
    if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error)
    }
    else {
        const result = await response.json()

        return result
    }
}

const loginRequest = async (data) => {
    const request = new Request(backEndUrl + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
    })
    const response = await fetch(request)
    if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error)
    }
    else {
        const result = await response.json()

        return result
    }
}

export { registrationRequest, loginRequest }