type TreeNode = {
  value: string
  children: TreeNode[]
}

const renderTree = (
  node: TreeNode,
  indentation: string = '',
  path: number[] = [],
  currentPath: number[] = []
): string => {
  let result = `${indentation}${
    JSON.stringify(path) === JSON.stringify(currentPath) ? '\x1b[32m' : ''
  }${node.value}\x1b[0m\n`
  node.children.forEach(
    (child, i) =>
      (result += renderTree(
        child,
        `${indentation}  `,
        [...path, i],
        currentPath
      ))
  )
  return result
}

const getNodeByPath = (root: TreeNode, path: number[]): TreeNode =>
  path.reduce((node, index) => node.children[index], root)

export const createTreeCLI = (tree: TreeNode): void => {
  let currentPath: number[] = []
  let inputBuffer = ''
  let isEnteringNodeName = false
  let lastKeyPressed: string = ''

  const display = () => {
    console.clear()
    console.log(`Last key pressed: ${lastKeyPressed}`)
    if (isEnteringNodeName) {
      console.log(`Enter the name of the new child node: ${inputBuffer}`)
    } else {
      console.log(
        'Instructions: Use arrow keys to navigate, + to add child, Tab to view tree shape.\n'
      )
      console.log(renderTree(tree, '', [], currentPath))
    }
  }

  display()

  process.stdin.setRawMode(true)
  process.stdin.setEncoding('utf8')

  process.stdin.on('data', (key: string) => {
    if (key === '\u001B\u005B\u0041') {
      lastKeyPressed = 'Up'
    } else if (key === '\u001B\u005B\u0042') {
      lastKeyPressed = 'Down'
    } else if (key === '\u001B\u005B\u0043') {
      lastKeyPressed = 'Right'
    } else if (key === '\u001B\u005B\u0044') {
      lastKeyPressed = 'Left'
    } else {
      lastKeyPressed = key
    }
    if (key === '\u0003') process.exit() // CTRL+C to exit
    if (isEnteringNodeName) {
      if (key === '\r') {
        getNodeByPath(tree, currentPath).children.push({
          value: inputBuffer,
          children: [],
        })
        isEnteringNodeName = false
        inputBuffer = ''
      } else if (key === '\u007F') {
        inputBuffer = inputBuffer.slice(0, -1)
      } else {
        inputBuffer += key
      }
      return display()
    }

    const parentPath = currentPath.slice(0, -1)
    const currentNode = getNodeByPath(tree, parentPath)
    const siblings = currentNode.children

    if (key === 'u' || key === 'd') {
      // 'u' for Shift+Up and 'd' for Shift+Down
      const parentPath = currentPath.slice(0, -1)
      const siblings = getNodeByPath(tree, parentPath).children
      if (siblings.length > 1) {
        const index = currentPath.pop()!
        const change = key === 'u' ? -1 : 1
        const newIndex = (siblings.length + index + change) % siblings.length
        ;[siblings[index], siblings[newIndex]] = [
          siblings[newIndex],
          siblings[index],
        ]
        currentPath.push(newIndex)
      }
    } else if (key === '\u001B\u005B\u0041' || key === '\u001B\u005B\u0042') {
      // Up or Down
      if (siblings.length > 0) {
        const change = key === '\u001B\u005B\u0041' ? -1 : 1
        currentPath[currentPath.length - 1] =
          (siblings.length + currentPath.pop()! + change) % siblings.length
      }
    } else if (
      key === '\u001B\u005B\u0043' &&
      getNodeByPath(tree, currentPath).children.length > 0
    ) {
      // Right
      currentPath.push(0)
    } else if (key === '\u001B\u005B\u0044' && currentPath.length > 0) {
      // Left
      currentPath.pop()
    } else if (key === '+') {
      // Add child
      isEnteringNodeName = true
    } else if (key === '\u0009') {
      // Tab
      console.clear()
      console.log(JSON.stringify(tree, null, 2))
      return
    }

    display()
  })
}

const tree: TreeNode = {
  value: 'Root',
  children: [
    { value: 'Child 1', children: [] },
    { value: 'Child 2', children: [] },
  ],
}
createTreeCLI(tree)
