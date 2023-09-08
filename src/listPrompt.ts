import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

readline.emitKeypressEvents(process.stdin)
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true)
}

export function listPrompt(
  question: string,
  choices: string[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    let index = 0

    function displayChoices() {
      console.clear()
      console.log(question)
      choices.forEach((choice, i) => {
        if (i === index) {
          console.log(`> ${choice}`)
        } else {
          console.log(`  ${choice}`)
        }
      })
    }

    displayChoices()

    process.stdin.on('keypress', (str, key) => {
      if (key.name === 'c' && key.ctrl) {
        // Ctrl+C, exit
        reject(new Error('User exited.'))
        cleanup()
      } else if (key.name === 'up') {
        // Arrow up
        index = (index - 1 + choices.length) % choices.length
        displayChoices()
      } else if (key.name === 'down') {
        // Arrow down
        index = (index + 1) % choices.length
        displayChoices()
      } else if (key.name === 'return') {
        // Enter key, select
        resolve(choices[index])
        cleanup()
      }
    })

    function cleanup() {
      rl.close()
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false)
      }
      process.stdin.removeAllListeners('keypress')
    }
  })
}
