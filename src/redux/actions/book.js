import { APP_URL, Get, Post } from '../../config/config';

export const getPopularBooks = (jwt) => {
    return {
        type: 'GET_POPULAR_BOOKS',
        payload: Get(APP_URL.concat('/item?sort[created_at]=desc'), jwt)
    }
}

export const getBooks = (jwt, params) => {
    return {
        type: 'GET_BOOKS',
        payload: Get(APP_URL.concat('/item?' + params), jwt)
    }
}

export const getBook = (jwt, id) => {
    return {
        type: 'GET_BOOK',
        payload: Get(APP_URL.concat('/item/' + id), jwt)
    }
}

// export const getLastOrdered = (jwt, ids) => {
//     return {
//         type: 'GET_LAST_ORDERED',
//         payload: Post(APP_URL.concat('/order/item'), jwt, {ids})
//     }
// }

// export const postReview = (jwt, data) => {
//     return {
//         type: 'POST_REVIEW',
//         payload: Post(APP_URL.concat('/review'), jwt, data)
//     }
// }