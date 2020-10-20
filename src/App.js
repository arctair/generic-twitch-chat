import React, { useEffect, useState } from 'react'
import './App.css'

function Chat({ messages }) {
  return messages.length ? (
    <ChatMessages messages={messages} />
  ) : (
    <div>Connecting...</div>
  )
}

function ChatMessages({ messages }) {
  return messages.map((message, index) => <div key={index}>{message}</div>)
}

function useMessages() {
  const [messages, setMessages] = useState([])
  useEffect(() => {
    const webSocket = new WebSocket(
      'wss://irc-ws.chat.twitch.tv:443',
      'irc',
    )
    webSocket.addEventListener('message', ({ data }) => {
      console.log('new message', data, typeof data)
      setMessages((messages) => messages.concat('>>>' + data))
    })
    webSocket.addEventListener('open', () => {
      webSocket.send('PASS foobar')
      webSocket.send('NICK justinfan123')
      webSocket.send(`JOIN #krispykitty`)
    })
    webSocket.addEventListener('error', (event) => {
      setMessages((messages) =>
        messages.concat('Could not connect to chat'),
      )
      console.error(event)
    })
    return () => webSocket.close()
  }, [])
  return messages
}

function App() {
  return <Chat messages={useMessages()} />
}

export default App
