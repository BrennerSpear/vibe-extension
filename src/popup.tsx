import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import defaultTargets, { Target } from './defaultTargets'

import type { CSSProperties } from 'react'

const styles: Record<string, CSSProperties> = {
  container: {
    width: '480px',
    // paddingTop: '16px',
    // paddingBottom: '16px',
    padding: '16px',
    backgroundColor: '#1a1a2e',
    color: '#e4e4e4',
    fontFamily: '"Chakra Petch", system-ui, -apple-system, sans-serif'
  },
  title: {
    color: '#e4e4e4',
    fontSize: '28px',
    marginBottom: '4px',
    fontWeight: 500
  },
  subtitle: {
    color: '#9d4edd',
    fontSize: '14px',
    marginBottom: '16px',
    opacity: 0.8
  },
  textarea: {
    width: '100%',
    height: '80px',
    marginBottom: '12px',
    backgroundColor: '#282846',
    border: '1px solid #3f3f5f',
    borderRadius: '8px',
    padding: '12px',
    color: '#e4e4e4',
    fontSize: '14px',
    resize: 'vertical' as const
  },
  sectionTitle: {
    color: '#9d4edd',
    fontSize: '20px',
    marginBottom: '8px',
    fontWeight: 500,
    letterSpacing: '0.5px'
  },
  targetContainer: {
    backgroundColor: '#282846',
    borderRadius: '8px',
    padding: '8px',
    marginBottom: '12px'
  },
  targetItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#1a1a2e',
    borderRadius: '6px',
    border: '1px solid #3f3f5f',
    fontSize: '13px',
    marginBottom: '4px'
  },
  checkbox: {
    accentColor: '#9d4edd'
  },
  label: {
    marginLeft: '8px',
    marginRight: 'auto',
    color: '#e4e4e4'
  },
  button: {
    backgroundColor: '#9d4edd',
    color: '#ffffff',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    width: 'auto',
    fontWeight: 500,
    height: '40px',
    letterSpacing: '0.5px'
  },
  removeButton: {
    backgroundColor: 'transparent',
    color: '#9d4edd',
    border: '1px solid #9d4edd',
    padding: '4px',
    borderRadius: '4px',
    marginLeft: '8px',
    cursor: 'pointer',
    minWidth: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px'
  },
  customForm: {
    backgroundColor: '#282846',
    border: '1px solid #3f3f5f',
    borderRadius: '4px',
    padding: '8px',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    backgroundColor: '#1a1a2e',
    border: '1px solid #3f3f5f',
    borderRadius: '4px',
    padding: '6px',
    color: '#e4e4e4',
    marginBottom: '6px',
    fontSize: '12px'
  },
  status: {
    padding: '8px',
    borderRadius: '4px',
    marginTop: '8px',
    backgroundColor: '#282846',
    border: '1px solid #3f3f5f'
  },
  error: {
    color: '#ff6b6b',
    backgroundColor: '#2d232f',
    padding: '8px',
    borderRadius: '4px',
    marginTop: '8px',
    border: '1px solid #ff6b6b'
  }
}

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
    // Load saved targets, prompt, and selected targets from storage
    chrome.storage.local.get(['vibeTargets', 'vibePrompt', 'vibeSelectedTargets'], (result) => {
      if (result.vibeTargets) {
        setTargets(result.vibeTargets)
      }
      if (result.vibeSelectedTargets) {
        setSelectedTargets(result.vibeSelectedTargets)
      } else if (result.vibeTargets) {
        // Default to all targets selected if no selection is saved
        setSelectedTargets(result.vibeTargets.map((t: Target) => t.name))
      }
      if (result.vibePrompt) {
        setPrompt(result.vibePrompt)
      }
    })
  }, [])

  const saveTargets = (newTargets: Target[]) => {
    chrome.storage.local.set({ vibeTargets: newTargets })
    setTargets(newTargets)
  }

  const handleTargetSelection = (targetName: string) => {
    let newSelectedTargets;
    if (selectedTargets.includes(targetName)) {
      newSelectedTargets = selectedTargets.filter((name) => name !== targetName);
    } else {
      newSelectedTargets = [...selectedTargets, targetName];
    }
    
    // Update state and save to storage
    setSelectedTargets(newSelectedTargets);
    chrome.storage.local.set({ vibeSelectedTargets: newSelectedTargets });
  }
  
  const savePrompt = (newPrompt: string) => {
    setPrompt(newPrompt)
    chrome.storage.local.set({ vibePrompt: newPrompt })
  }
  
  const clearPrompt = () => {
    setPrompt('')
    chrome.storage.local.remove('vibePrompt')
  }

  const addCustomTarget = () => {
    if (customTarget.name && customTarget.url && customTarget.inputSelector) {
      // Mark as custom target
      const customTargetWithFlag = {
        ...customTarget,
        isCustom: true
      }
      
      const newTargets = [...targets, customTargetWithFlag]
      saveTargets(newTargets)
      
      // Update selected targets and save to storage
      const newSelectedTargets = [...selectedTargets, customTarget.name]
      setSelectedTargets(newSelectedTargets)
      chrome.storage.local.set({ vibeSelectedTargets: newSelectedTargets })
      
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
    
    // Update selected targets and save to storage
    const newSelectedTargets = selectedTargets.filter((name) => name !== targetName)
    setSelectedTargets(newSelectedTargets)
    chrome.storage.local.set({ vibeSelectedTargets: newSelectedTargets })
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
          // Note: We no longer clear the prompt here
        } else {
          setStatus({ error: response?.error || 'An error occurred' })
        }
      },
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>Vibe Aggregator</div>
      <div style={styles.subtitle}>Distribute your prompts to multiple AI tools simultaneously</div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={styles.sectionTitle}>Your Prompt</h2>
          <button 
            onClick={clearPrompt}
            style={{
              backgroundColor: 'transparent',
              color: '#9d4edd',
              border: '1px solid #9d4edd',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              height: '24px'
            }}
          >
            Clear
          </button>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => savePrompt(e.target.value)}
          style={styles.textarea}
          placeholder="Enter your prompt here..."
        />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={styles.sectionTitle}>Target Tools</h2>
          <button 
            onClick={() => setShowCustomForm(true)}
            style={{
              backgroundColor: 'transparent',
              color: '#9d4edd',
              border: '1px solid #9d4edd',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              height: '24px'
            }}
          >
            + Add Custom
          </button>
        </div>
        <div style={styles.targetContainer}>
          {targets.map((target) => (
            <div
              key={target.name}
              style={styles.targetItem}
            >
              <input
                type="checkbox"
                id={target.name}
                checked={selectedTargets.includes(target.name)}
                onChange={() => handleTargetSelection(target.name)}
                style={styles.checkbox}
              />
              <label
                htmlFor={target.name}
                style={styles.label}
              >
                {target.name} ({target.url})
              </label>
              {target.isCustom && (
                <button
                  onClick={() => removeTarget(target.name)}
                  style={styles.removeButton}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {showCustomForm ? (
          <div style={styles.customForm}>
            <h3 style={styles.sectionTitle}>Add Custom Target</h3>
            <div style={{ marginBottom: '5px' }}>
              <label>Name: </label>
              <input
                type="text"
                value={customTarget.name}
                onChange={(e) =>
                  setCustomTarget({ ...customTarget, name: e.target.value })
                }
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
                placeholder="CSS Selector for submit button (e.g., button.send)"
              />
            </div>
            <div>
              <button 
                onClick={addCustomTarget} 
                style={{...styles.button, marginRight: '10px'}}
              >
                Add Target
              </button>
              <button 
                onClick={() => setShowCustomForm(false)}
                style={{...styles.button, backgroundColor: '#282846', border: '1px solid #9d4edd', color: '#9d4edd'}}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <button
        onClick={distributePrompt}
        style={{...styles.button, marginTop: '12px', width: '100%', height: '40px', fontSize: '14px'}}
      >
        Distribute Prompt
      </button>

      {status.error && (
        <div style={styles.error}>{status.error}</div>
      )}
      {status.general && (
        <div style={styles.status}>{status.general}</div>
      )}
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
