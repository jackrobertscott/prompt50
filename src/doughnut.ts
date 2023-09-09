// TypeScript code to create a 3D rotating doughnut using standard input and output.

const kTwoPi = Math.PI * 2

let A = 0
let B = 0

const drawFrame = () => {
  let output: string[] = []
  let zbuffer: number[] = []

  for (let i = 0; i < 1760; i++) {
    output[i] = ' '
    zbuffer[i] = 0
  }

  for (let j = 0; j < kTwoPi; j += 0.07) {
    for (let i = 0; i < kTwoPi; i += 0.02) {
      const c = Math.sin(i),
        d = Math.cos(j),
        e = Math.sin(A),
        f = Math.sin(j),
        g = Math.cos(A),
        h = d + 2,
        D = 1 / (c * h * e + f * g + 5),
        l = Math.cos(i),
        m = Math.cos(B),
        n = Math.sin(B),
        t = c * h * g - f * e

      let x = Math.floor(40 + 30 * D * (l * h * m - t * n))
      let y = Math.floor(12 + 15 * D * (l * h * n + t * m))
      let o = Math.floor(x + 80 * y)
      let N = Math.floor(
        8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n)
      )

      if (1761 > o && o > 0 && D > zbuffer[o]) {
        zbuffer[o] = D
        const luminanceIndex = N > 0 ? N : 0
        output[o] = '.,-~:;=!*#$@'[luminanceIndex]
      }
    }
  }

  process.stdout.write('\x1b[H')
  for (let k = 0; k < 1761; k++) {
    process.stdout.write(k % 80 > 0 ? output[k] : '\n')
  }
}

const mainLoop = () => {
  A += 0.04
  B += 0.02
  drawFrame()
  setTimeout(mainLoop, 50)
}

mainLoop()
