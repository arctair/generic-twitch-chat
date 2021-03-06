import React, { useEffect, useRef, useState } from 'react'
import './App.css'

function Messages({ messages }) {
  return messages.length ? (
    <ChatMessages messages={messages} />
  ) : (
    <div>Connecting...</div>
  )
}

function ChatMessages({ messages }) {
  const chatMessages = messages
    .filter(({ user }) => user)
    .map(({ text, user }, index) => (
      <div key={index}>
        {user}: {text}
      </div>
    ))

  return chatMessages.length ? (
    chatMessages
  ) : (
    <div>Welcome to the stream! Hope you enjoy your time here :)</div>
  )
}

function useMessages(shouldPop) {
  const [messages, setMessages] = useState([])
  useEffect(() => {
    if (shouldPop) setMessages((messages) => messages.slice(1))
  }, [shouldPop, messages])
  useEffect(() => {
    const webSocket = new WebSocket(
      'wss://irc-ws.chat.twitch.tv:443',
      'irc',
    )
    webSocket.addEventListener('message', ({ data }) => {
      if (data.startsWith('PING ')) {
        webSocket.send('PONG tmi.twitch.tv')
        console.log('>', 'PONG tmi.twitch.tv')
      }
      console.log('<', data)
      setMessages((messages) => messages.concat(parseMessage(data.trim())))
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

function parseMessage(message) {
  try {
    const [, user, text] = /^:(.+?)!\S+ \w+ #\w+ :(.+)$/.exec(message)
    return { user, text }
  } catch {
    return { text: message }
  }
}

function App() {
  const containerRef = useRef(null)
  const [shouldPop, setShouldPop] = useState(false)
  const messages = useMessages(shouldPop)
  useEffect(() => {
    setShouldPop(
      containerRef.current.offsetHeight <
        containerRef.current.scrollHeight,
    )
  }, [containerRef, messages])
  return (
    <div ref={containerRef} className="container">
      <Messages messages={messages} />
    </div>
  )
}

export default App
