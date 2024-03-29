interface Color {
  red: number
  green: number
  blue: color
}

interface DefaultColor extends Color {
  id: string
}

interface Light {
  colors: DefaultColor[]
  name: string
  id: string
  numberOfLEDs: number
  brightness: number
  power: boolean
  mode: LightMode
}

interface User extends firebase.User {
  brightness: boolean
  changeColor: boolean
  createColor: boolean
  togglePower: boolean
}
