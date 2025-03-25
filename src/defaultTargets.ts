export interface Target {
  name: string
  url: string
  inputSelector: string
  submitSelector?: string
  isCustom?: boolean
}

const defaultTargets: Target[] = [
  {
    name: 'Replit',
    url: 'https://replit.com/~',
    inputSelector: '.cm-content', // Target the contenteditable div directly
    submitSelector: 'button.css-1dz4r82',
  },
  {
    name: 'Srcbook',
    url: 'https://srcbook.com/apps',
    inputSelector: 'textarea.caret-ai-btn.scrollbar-hide',
    submitSelector: 'button.bg-generate-gradient',
  },
  {
    name: 'Lovable.dev',
    url: 'https://lovable.dev/',
    inputSelector: 'textarea#chatinput',
    submitSelector: 'button#chatinput-send-message-button',
  },
  {
    name: 'V0.dev',
    url: 'https://v0.dev/',
    inputSelector: 'textarea#chat-main-textarea',
    submitSelector: "button[data-testid='prompt-form-send-button']",
  },
  {
    name: 'Bolt.new',
    url: 'https://bolt.new/',
    inputSelector: "textarea[translate='no']",
    submitSelector: 'button.absolute.flex.justify-center',
  },
]

export default defaultTargets
