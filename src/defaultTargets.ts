export interface Target {
  name: string
  url: string
  inputSelector: string
  submitSelector?: string
}

const defaultTargets: Target[] = [
  {
    name: 'Replit',
    url: 'https://replit.com/~',
    inputSelector: ".cm-content", // Target the contenteditable div directly
    submitSelector: "button[data-cy='ai-prompt-submit']",
  },
  {
    name: 'Sourcebook',
    url: 'https://srcbook.com/apps',
    inputSelector: "textarea[placeholder*='Ask a question']",
    submitSelector: "button[type='submit']",
  },
  {
    name: 'Lovable.dev',
    url: 'https://lovable.dev/',
    inputSelector: "textarea.prompt-textarea",
    submitSelector: "button.submit-button",
  },
  {
    name: 'V0.dev',
    url: 'https://v0.dev/',
    inputSelector: "textarea[placeholder*='Describe your webpage']",
    submitSelector: "button[type='submit']",
  },
  {
    name: 'Bolt.new',
    url: 'https://bolt.new/',
    inputSelector: "textarea.react-scroll-to-bottom--css-jjtwn-1wbg1rp[placeholder*='Message Bolt']",
    submitSelector: "button[aria-label='Send message']",
  }
]

export default defaultTargets