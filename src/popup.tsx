import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import defaultTargets, { Target } from './defaultTargets'

// Debug: Add global error handler
console.log('Popup script loaded')

const Popup = () => {
  const [prompt, setPrompt] = useState('')
  const [targets, setTargets] = useState<Target[]>(defaultTargets)
  const [selectedTargets, setSelectedTargets] = useState<string[]>(
    defaultTargets.map((t) => t.name),
  )
  const [status, setStatus] = useState<Record<string, string>>({})
  const [customTarget, setCustomTarget] = useState({
    name: '',
    url: '',
    inputSelector: '',
    submitSelector: '',
  })
  const [showCustomForm, setShowCustomForm] = useState(false)

  useEffect(() => {
    // Load saved targets from storage
    chrome.storage.local.get(['vibeTargets'], (result) => {
      if (result.vibeTargets) {
        setTargets(result.vibeTargets)
        setSelectedTargets(result.vibeTargets.map((t: Target) => t.name))
      }
    })
  }, [])

  const saveTargets = (newTargets: Target[]) => {
    chrome.storage.local.set({ vibeTargets: newTargets })
    setTargets(newTargets)
  }

  const handleTargetSelection = (targetName: string) => {
    if (selectedTargets.includes(targetName)) {
      setSelectedTargets(selectedTargets.filter((name) => name !== targetName))
    } else {
      setSelectedTargets([...selectedTargets, targetName])
    }
  }

  const addCustomTarget = () => {
    if (customTarget.name && customTarget.url && customTarget.inputSelector) {
      const newTargets = [...targets, customTarget]
      saveTargets(newTargets)
      setSelectedTargets([...selectedTargets, customTarget.name])
      setCustomTarget({
        name: '',
        url: '',
        inputSelector: '',
        submitSelector: '',
      })
      setShowCustomForm(false)
    }
  }

  const removeTarget = (targetName: string) => {
    const newTargets = targets.filter((t) => t.name !== targetName)
    saveTargets(newTargets)
    setSelectedTargets(selectedTargets.filter((name) => name !== targetName))
  }

  const distributePrompt = async () => {
    if (!prompt.trim()) {
      setStatus({ error: 'Please enter a prompt' })
      return
    }

    const filteredTargets = targets.filter((t) =>
      selectedTargets.includes(t.name),
    )

    if (filteredTargets.length === 0) {
      setStatus({ error: 'Please select at least one target' })
      return
    }

    setStatus({ general: 'Distributing prompt...' })

    // Send message to background script to handle opening tabs and injecting prompt
    chrome.runtime.sendMessage(
      {
        action: 'distributePrompt',
        prompt: prompt,
        targets: filteredTargets,
      },
      (response) => {
        if (response?.success) {
          setStatus({ general: 'Prompt distributed successfully!' })
        } else {
          setStatus({ error: response?.error || 'An error occurred' })
        }
      },
    )
  }

  return (
    <div style={{ minWidth: '500px', padding: '20px' }}>
      <h1>Vibe Extension</h1>
      <p>Distribute your prompts to multiple AI tools simultaneously</p>

      <div style={{ marginBottom: '20px' }}>
        <h2>Your Prompt</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', height: '100px', marginBottom: '10px' }}
          placeholder="Enter your prompt here..."
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Target AI Tools</h2>
        <div style={{ marginBottom: '10px' }}>
          {targets.map((target) => (
            <div
              key={target.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '5px',
              }}
            >
              <input
                type="checkbox"
                id={target.name}
                checked={selectedTargets.includes(target.name)}
                onChange={() => handleTargetSelection(target.name)}
              />
              <label
                htmlFor={target.name}
                style={{ marginLeft: '5px', marginRight: 'auto' }}
              >
                {target.name} ({target.url})
              </label>
              <button
                onClick={() => removeTarget(target.name)}
                style={{ marginLeft: '10px', padding: '2px 5px' }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        {showCustomForm ? (
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            <h3>Add Custom Target</h3>
            <div style={{ marginBottom: '5px' }}>
              <label>Name: </label>
              <input
                type="text"
                value={customTarget.name}
                onChange={(e) =>
                  setCustomTarget({ ...customTarget, name: e.target.value })
                }
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: '5px' }}>
              <label>URL: </label>
              <input
                type="text"
                value={customTarget.url}
                onChange={(e) =>
                  setCustomTarget({ ...customTarget, url: e.target.value })
                }
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: '5px' }}>
              <label>Input Selector: </label>
              <input
                type="text"
                value={customTarget.inputSelector}
                onChange={(e) =>
                  setCustomTarget({
                    ...customTarget,
                    inputSelector: e.target.value,
                  })
                }
                style={{ width: '100%' }}
                placeholder="CSS Selector for input field (e.g., textarea.myClass)"
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Submit Button Selector (optional): </label>
              <input
                type="text"
                value={customTarget.submitSelector}
                onChange={(e) =>
                  setCustomTarget({
                    ...customTarget,
                    submitSelector: e.target.value,
                  })
                }
                style={{ width: '100%' }}
                placeholder="CSS Selector for submit button (e.g., button.send)"
              />
            </div>
            <div>
              <button onClick={addCustomTarget} style={{ marginRight: '5px' }}>
                Add
              </button>
              <button onClick={() => setShowCustomForm(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowCustomForm(true)}>
            + Add Custom Target
          </button>
        )}
      </div>

      <button
        onClick={distributePrompt}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Distribute Prompt
      </button>

      {status.error && (
        <p style={{ color: 'red', marginTop: '10px' }}>{status.error}</p>
      )}

      {status.general && <p style={{ marginTop: '10px' }}>{status.general}</p>}
    </div>
  )
}

// Debug: Check if root element exists
const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)

if (!rootElement) {
  console.error('Root element not found')
  const fallback = document.querySelector('.fallback')
  if (fallback instanceof HTMLElement) {
    fallback.style.display = 'block'
  }
  const errorMessage = document.getElementById('error-message')
  if (errorMessage) {
    errorMessage.textContent = 'Root element not found'
  }
  throw new Error('Root element not found')
}

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
)
