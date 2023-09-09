const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

interface Vertex {
  x: number
  y: number
  z: number
}

interface Face {
  vertices: Vertex[]
}

const project = (
  vertex: Vertex,
  width: number,
  height: number
): { x: number; y: number } => {
  const scale = 20
  const x = Math.floor(vertex.x * scale + width / 2)
  const y = Math.floor(vertex.y * scale + height / 2)
  return { x, y }
}

const draw = (faces: Face[], width: number, height: number) => {
  const pixels = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ' ')
  )

  for (const face of faces) {
    for (const vertex of face.vertices) {
      const { x, y } = project(vertex, width, height)
      if (x >= 0 && x < width && y >= 0 && y < height) {
        pixels[y][x] = '*'
      }
    }
  }

  for (const row of pixels) {
    console.log(row.join(''))
  }
}

const rotateZ = (vertex: Vertex, angle: number): Vertex => {
  const { x, y } = vertex
  return {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle),
    z: vertex.z,
  }
}

const main = async () => {
  const width = 80
  const height = 24

  let cube: Face[] = [
    {
      vertices: [
        { x: -1, y: -1, z: -1 },
        { x: 1, y: -1, z: -1 },
        { x: 1, y: 1, z: -1 },
        { x: -1, y: 1, z: -1 },
      ],
    },
    {
      vertices: [
        { x: -1, y: -1, z: 1 },
        { x: 1, y: -1, z: 1 },
        { x: 1, y: 1, z: 1 },
        { x: -1, y: 1, z: 1 },
      ],
    },
    {
      vertices: [
        { x: -1, y: -1, z: -1 },
        { x: 1, y: -1, z: -1 },
        { x: 1, y: -1, z: 1 },
        { x: -1, y: -1, z: 1 },
      ],
    },
    {
      vertices: [
        { x: -1, y: 1, z: -1 },
        { x: 1, y: 1, z: -1 },
        { x: 1, y: 1, z: 1 },
        { x: -1, y: 1, z: 1 },
      ],
    },
    {
      vertices: [
        { x: -1, y: -1, z: -1 },
        { x: -1, y: 1, z: -1 },
        { x: -1, y: 1, z: 1 },
        { x: -1, y: -1, z: 1 },
      ],
    },
    {
      vertices: [
        { x: 1, y: -1, z: -1 },
        { x: 1, y: 1, z: -1 },
        { x: 1, y: 1, z: 1 },
        { x: 1, y: -1, z: 1 },
      ],
    },
  ]

  while (true) {
    console.clear()
    draw(cube, width, height)
    cube = cube.map((face) => ({
      vertices: face.vertices.map((vertex) => rotateZ(vertex, 0.1)),
    }))
    await sleep(100)
  }
}

main().catch((err) => {
  console.error(err)
})
