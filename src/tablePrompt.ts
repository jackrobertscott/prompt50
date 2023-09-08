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

type TableRow = string[]

export function tablePrompt(
  question: string,
  table: TableRow[],
  header?: TableRow
): Promise<{ row: number; col: number; value: string }> {
  return new Promise((resolve, reject) => {
    let rowIndex = 0
    let colIndex = 0

    function getMaxColWidths(): number[] {
      const colWidths: number[] = []
      table.forEach((row) => {
        row.forEach((cell, i) => {
          colWidths[i] = Math.max(colWidths[i] || 0, cell.length)
        })
      })
      if (header) {
        header.forEach((cell, i) => {
          colWidths[i] = Math.max(colWidths[i] || 0, cell.length)
        })
      }
      return colWidths
    }

    const maxColWidths = getMaxColWidths()

    function displayTable() {
      console.clear()
      console.log(question)

      const horizontalBorder =
        '+' + maxColWidths.map((width) => '-'.repeat(width + 2)).join('+') + '+'
      console.log(horizontalBorder)

      if (header) {
        const headerStr = header
          .map(
            (cell, cIndex) =>
              `\x1b[100m\x1b[30m ${cell.padEnd(
                maxColWidths[cIndex],
                ' '
              )} \x1b[0m`
          )
          .join('|')
        console.log(`|${headerStr}|`)
        console.log(horizontalBorder)
      }

      table.forEach((row, rIndex) => {
        const rowStr = row
          .map((cell, cIndex) => {
            const paddedCell = cell.padEnd(maxColWidths[cIndex], ' ')
            return rIndex === rowIndex && cIndex === colIndex
              ? `\x1b[44m\x1b[97m ${paddedCell} \x1b[0m`
              : ` ${paddedCell} `
          })
          .join('|')

        console.log(`|${rowStr}|`)
        console.log(horizontalBorder)
      })
    }

    displayTable()

    process.stdin.on('keypress', (str, key) => {
      if (key.name === 'c' && key.ctrl) {
        reject(new Error('User exited.'))
        cleanup()
      } else if (key.name === 'up') {
        rowIndex = (rowIndex - 1 + table.length) % table.length
        displayTable()
      } else if (key.name === 'down') {
        rowIndex = (rowIndex + 1) % table.length
        displayTable()
      } else if (key.name === 'left') {
        colIndex = (colIndex - 1 + maxColWidths.length) % maxColWidths.length
        displayTable()
      } else if (key.name === 'right') {
        colIndex = (colIndex + 1) % maxColWidths.length
        displayTable()
      } else if (key.name === 'return') {
        resolve({
          row: rowIndex,
          col: colIndex,
          value: table[rowIndex][colIndex],
        })
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
