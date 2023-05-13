import React from 'react'

export const getAuthenticityToken = () => (
  $('head meta[name=\'csrf-token\']').attr('content')
)