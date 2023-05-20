import React from 'react'
import queryString from 'query-string'
import _ from 'lodash'

export const getAuthenticityToken = () => (
  $('head meta[name=\'csrf-token\']').attr('content')
)

export const callAPI = (url, method = 'GET', data = {}, headers = {}) => {
  let fullURL = url
  if (method === 'GET') {
    fullURL = `${ url }${ url.includes('?') ? '&' : '?' }${ $.param(data) }`
  }

  let fetchData = {
    method,
    credentials: 'same-origin',
  }
  if (method === 'POST') {
    fetchData = {
      ...fetchData,
      headers: {
        'X-CSRF-Token': getAuthenticityToken(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: queryString.stringify(data),
    }
  } else if (method === 'PUT') {
    fetchData = {
      ...fetchData,
      headers: {
        'X-CSRF-Token': getAuthenticityToken(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: queryString.stringify(data),
    }
  } else if (headers !== {}) {
    fetchData = {
      ...fetchData,
      headers: headers,
    }
  }

  return new Promise((resolve, reject) => {
    fetch(fullURL, fetchData)
      .then(response => Promise.all([ response, response.json() ]))
      .then(([ response, json ]) => {
        if (response.status === 200) {
          if (_.isEmpty(json.errorMessage)) {
            resolve(json)
          } else {
            reject(json.errorMessage, json)
          }
        }
        else if (_.isEmpty(json.errorMessage)){
          resolve({})
        } else{
          reject(json.errorMessage, json)
        }
      })
      .catch((error) => {
        console.log(error)
        reject()
      })
  })
}