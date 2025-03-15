import { Target } from './defaultTargets'

interface TargetResult {
  target: string
  success: boolean
  error?: string
}

interface FillPromptResponse {
  success: boolean
  error?: string
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'distributePrompt') {
    const { prompt, targets } = request

    if (
      !prompt ||
      !targets ||
      !Array.isArray(targets) ||
      targets.length === 0
    ) {
      sendResponse({
        success: false,
        error: 'Invalid request. Missing prompt or targets.',
      })
      return
    }

    console.log(`Distributing prompt to ${targets.length} targets...`)

    // Process targets one by one
    processTargets(prompt, targets)
      .then((results: TargetResult[]) => {
        const failed = results.filter((r) => !r.success)

        if (failed.length === 0) {
          sendResponse({ success: true })
        } else {
          sendResponse({
            success: false,
            error: `Failed to distribute to ${failed.length} of ${targets.length} targets.`,
          })
        }
      })
      .catch((error: unknown) => {
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        })
      })

    // Return true to indicate that we will respond asynchronously
    return true
  }
})

async function processTargets(
  prompt: string,
  targets: Target[],
): Promise<TargetResult[]> {
  const results: TargetResult[] = []

  for (const target of targets) {
    try {
      // Check if the tab already exists
      const existingTabs = await chrome.tabs.query({ url: target.url + '*' })
      let tab: chrome.tabs.Tab

      // Add a small delay between tab operations
      if (target !== targets[0]) {
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      if (existingTabs.length > 0) {
        // Use the first existing tab
        tab = existingTabs[0]
        await chrome.tabs.update(tab.id!, { active: true })
      } else {
        // Create a new tab
        tab = await chrome.tabs.create({ url: target.url, active: false })
      }

      // Give the page some time to load
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Try to inject the prompt
      if (tab.id) {
        try {
          // Send message to content script and get response
          const result: FillPromptResponse = await new Promise((resolve) => {
            chrome.tabs.sendMessage(
              tab.id!,
              {
                action: 'fillPrompt',
                prompt: prompt,
                inputSelector: target.inputSelector,
                submitSelector: target.submitSelector,
              },
              (response) => {
                resolve(
                  response || {
                    success: false,
                    error: 'No response from content script',
                  },
                )
              },
            )
          })

          results.push({
            target: target.name,
            success: result?.success || false,
            error: result?.error,
          })
        } catch (error: unknown) {
          results.push({
            target: target.name,
            success: false,
            error:
              'Failed to communicate with content script: ' +
              (error instanceof Error ? error.message : String(error)),
          })
        }
      }
    } catch (error: unknown) {
      results.push({
        target: target.name,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return results
}

// Initial setup
chrome.runtime.onInstalled.addListener(() => {
  console.log('Vibe Extension installed/updated')
})
