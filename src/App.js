import { useState } from "react";
import styled from 'styled-components'
import { BiPause, BiPlay, BiReset, BiCaretUp, BiCaretDown } from "react-icons/bi";

const Contenedor = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  color: gray;
  background:darkgray;
`

const SubContenedor = styled.div`
  display: flex;
  margin-top: 50px;
  margin-bottom: 50px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`

const Tiempo = styled.div`
  border: solid;
  border-radius: 20px;
  width: 200px;
  margin: 0 0 20px 0;
  border-color: gray;
`

const Botones = styled.button`
  border: none;
  background: transparent;
  width: 40px;
  height: 40px;
`
const Subtitulos = styled.h3`
  margin: 0;
  
  color: white;
`

const ContenedorBotones = styled.div`
  display: grid;
  grid-template-columns: 50px 100px 50px;
  justify-content: center;
  align-items: center;
`

const BotonesAjustes = styled.button`
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  color: white;
`

const Length = ({ titulo, setTiempo, tipo, tiempo, formatTiempo, lengthId, increId, decreId }) => {
  return (
    <div>
      <Subtitulos>{titulo}</Subtitulos>
      <div>
        <ContenedorBotones>
          <BotonesAjustes id={decreId} onClick={() => setTiempo(-60, tipo)}>
            <BiCaretDown style={{width: '30px', height: '30px'}} />
          </BotonesAjustes>
          <h3 id={lengthId}>{formatTiempo(tiempo)}</h3>
          <BotonesAjustes id={increId} onClick={() => setTiempo(60, tipo)}>
            <BiCaretUp style={{width: '30px', height: '30px'}} />
          </BotonesAjustes>
        </ContenedorBotones>
      </div>
    </div>
  )
}   

const App = () => {

  const [dtiempo, setDTiempo] = useState(60 * 25)
  const [btiempo, setBTiempo] = useState(60 * 5)
  const [stiempo, setSTiempo] = useState(60 * 25)
  const [tiempoOn, setTiempoOn] = useState(false)
  const [breakOn, setBreakOn] = useState(false)
  const bAudio = new Audio('http://www.sonidosmp3gratis.com/sounds/ringtones-minion-wake-up.mp3')

  const playBSound = () => {
    bAudio.currentTiempo = 0
    bAudio.play()
  }

  const formatTiempo = tiempo => {
    let minutes = Math.floor(tiempo / 60)
    let segundos = tiempo % 60

    return (
      (minutes < 10 ? '0' + minutes : minutes)
      + ':' +
      (segundos < 10 ? '0' + segundos : segundos)
    )
  }

  const setTiempo = (cant, tipo) => {
    if (tipo === 'break') {
      if (btiempo <= 60 && cant < 0) {
        return
      }
      setBTiempo(oper => oper + cant)
    } else {
      if (stiempo <= 60 && cant < 0) {
        return
      }
      setSTiempo(oper => oper + cant)
      if (!tiempoOn) {
        setDTiempo(stiempo + cant)
      }
    }
  }

  const controlTiempo = () => {
    let segundo = 1000
    let date = new Date().getTiempo()
    let nextDate = new Date().getTiempo() + segundo
    let onBVariable = breakOn

    if (!tiempoOn) {
      let interval = setInterval(() => {
        date = new Date().getTiempo()
        if (date > nextDate) {
          setDTiempo(oper => {
            if (oper <= 0 && !onBVariable) {
              playBSound()
              onBVariable = true
              setBreakOn(true)
              return btiempo
            } else if (oper <= 0 && onBVariable) {
              playBSound()
              onBVariable = false
              setBreakOn(false)
              return stiempo
            }
            return oper - 1
          })
          nextDate += segundo
        }
      }, 30)
      localStorage.clear()
      localStorage.setItem('interval-id', interval)
    }

    if (tiempoOn) {
      clearInterval(localStorage.getItem('interval-id'))
    }

    setTiempoOn(!tiempoOn)
  }

  const resetTiempo = () => {
    setDTiempo(25 * 60)
    setBTiempo(5 * 60)
    setSTiempo(25 * 60)
  }

  return (
    <Contenedor>
      <h1 style={{fontSize: '60px'}}>25 + 5 Clock</h1>
      <SubContenedor>
        <div id="break-label">
          <Length
            lengthId='break-length'
            increId='break-increment'
            decreId='break-decrement'
            titulo={'break length'}
            setTiempo={setTiempo}
            tipo={'break'}
            tiempo={btiempo}
            formatTiempo={formatTiempo}
          />
        </div>
        <div id="session-label">
          <Length
            lengthId='session-length'
            increId='session-increment'
            decreId='session-decrement'
            titulo={'session length'}
            setTiempo={setTiempo}
            tipo={'session'}
            tiempo={stiempo}
            formatTiempo={formatTiempo}
          />
        </div>
      </SubContenedor>
      <Tiempo>
        <h3 id="tiempor-label">{breakOn ? 'Break' : 'Session'}</h3>
        <h1 id="tiempo-left">{formatTiempo(dtiempo)}</h1>
      </Tiempo>
      <div>
        <Botones id="start_stop" onClick={controlTiempo}>
          {
            tiempoOn
              ?
              <BiPause style={{width: '30px', height: '30px', color: 'white'}} />
              :
              <BiPlay style={{width: '30px', height: '30px', color: 'white'}} />
          }
        </Botones>
        <Botones id="reset" onClick={resetTiempo}>
          <BiReset style={{width: '30px', height: '30px', color: 'white'}} />
        </Botones>
      </div>
    </Contenedor>
  );
}

export default App;
