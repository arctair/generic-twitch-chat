import React from 'react'
import './App.css'

function Chat({ messages }) {
  return (
    <>
      {messages.map(({ message, user }, index) => (
        <div key={index}>
          {user}: {message}
        </div>
      ))}
    </>
  )
}

function App() {
  const messages = [
    {
      user: 'jsonwebdev',
      message: 'i love trailing commas',
    },
    {
      user: 'ozown',
      message: 'i need html',
    },
  ]
  return <Chat messages={messages} />
}

export default App
