import { tokenDecode } from './functions.js'
import { notification } from './notification.js'
const backEndUrl = 'https://automarketbackend.onrender.com/api'

const fetchRequest = async (request) => {
    try {
        const response = await fetch(request)
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
            if (!response.ok) {
                const result = await response.json()
                throw new Error(result.error)
            }
            else {
                const result = await response.json()
                return result
            }
        }
        else {
            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`)
            }
            return response
        }
    }
    catch (error) {
        console.log(error)
        if (error.message === 'Unauthorized') {
            document.getElementsByTagName('body')[0].innerHTML = ''
            notification({ error: { name: 'Error', message: 'Ei oikeuksia!' }, doWeRedirectLater: true })
            setTimeout(() => { window.location = '../index.html' }, 5000)
        }
        else if (error.message === 'Invalid username or password') {
            notification({ error: { name: 'Error', message: 'Käyttäjänimi tai salasana väärin' }, doWeRedirectLater: false })
        }
    }
    return
}

const registrationRequest = async (data) => {
    const request = new Request(backEndUrl + '/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),

    })

    const result = await fetchRequest(request)
    return result
}

const loginRequest = async (data) => {
    const request = new Request(backEndUrl + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
    })

    const result = await fetchRequest(request)
    return result
}

const usersListRequest = async () => {
    const token = localStorage.getItem('token')
    if (token && tokenDecode().role === 'admin') {
        const request = new Request(backEndUrl + '/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        const result = await fetchRequest(request)
        return result
    }
}

const deleteUserRequest = async (userId) => {
    const token = localStorage.getItem('token')
    const request = new Request(backEndUrl + `/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    const result = await fetchRequest(request)
    return result
}

const deleteItemRequest = async (itemId) => {
    const token = localStorage.getItem('token')
    const request = new Request(backEndUrl + `/item/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    const result = await fetchRequest(request)
    return result
}

const itemsListRequest = async () => {
    const request = new Request(backEndUrl + '/items', {
        method: 'GET',
    })
    const result = await fetchRequest(request)
    return result
}

const sendMessageRequest = async (data) => {
    const token = localStorage.getItem('token')
    const request = new Request(backEndUrl + '/message', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    const result = await fetchRequest(request)
    return result
}

export { registrationRequest, loginRequest, usersListRequest, deleteUserRequest, itemsListRequest, deleteItemRequest, sendMessageRequest }