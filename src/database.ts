import { useState, useEffect } from 'react'
import firebase from './firebase'

const firestore = firebase.firestore()

export const useDefaultColors = () => {
  const [defaultColors, setDefaultColors] = useState<Array<DefaultColor>>([])
  useEffect(() => {
    const unsubscribe = firestore.collection('defaults').onSnapshot(doc => {
      setDefaultColors(
        doc.docs.map(color => {
          return {
            ...(color.data() as Color),
            id: color.id,
          }
        })
      )
    })
    return unsubscribe
  }, [])
  return { defaultColors, setDefaultColors }
}

export const useLights = () => {
  const [lights, setLights] = useState<Array<Light>>([])
  useEffect(() => {
    const unsubscribe = firestore.collection('lights').onSnapshot(doc => {
      setLights(
        doc.docs.map(light => {
          const lightData = light.data() as Light
          return {
            ...lightData,
            id: light.id,
            colors: lightData.colors.map(x => {
              return { ...x, id: `${Math.random()}` }
            }),
          }
        })
      )
    })
    return unsubscribe
  }, [])
  return { lights, setLights }
}

export const useLight = (lightId: string) => {
  const [light, setLight] = useState<Light | null>(null)
  useEffect(() => {
    const unsubscribe = firestore
      .collection('lights')
      .doc(lightId)
      .onSnapshot(doc => {
        const lightData = doc.data() as Light
        setLight({ ...lightData, id: lightId })
      })
    return unsubscribe
  }, [lightId])
  return { light, setLight }
}

export const addNewDefaultColor = (color: Color) => {
  firestore.collection('defaults').add({
    red: color.red,
    green: color.green,
    blue: color.blue,
  })
}

export const saveLight = (light: Light) => {
  firestore
    .collection('lights')
    .doc(light.id)
    .set({
      colors: light.colors.map(color => {
        return { red: color.red, green: color.green, blue: color.blue }
      }),
      name: light.name,
      numberOfLEDs: light.numberOfLEDs,
      brightness: light.brightness,
      mode: light.mode,
      power: light.power,
    })
}

export const deleteDefaultColor = (color: DefaultColor) => {
  firestore
    .collection('defaults')
    .doc(color.id)
    .delete()
}

export const useUser = (uid: string | null) => {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    if (uid) {
      return firestore
        .collection('users')
        .doc(uid)
        .onSnapshot(x => {
          setUser(x.data() as User)
        })
    } else {
      setUser(null)
    }
  }, [uid])
  return user
}

export const getUser = (uid: string) => {
  return firestore
    .collection('users')
    .doc(uid)
    .get()
    .then(x => {
      return x.data()
    })
}

export const createUser = (user: any) => {
  return firestore
    .collection('users')
    .doc(user.uid)
    .set({
      name: user.displayName,
      brightness: false,
      changeColor: false,
      createColor: false,
      togglePower: false,
    })
}
