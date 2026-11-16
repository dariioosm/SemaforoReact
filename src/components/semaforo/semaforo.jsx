import { useEffect,useReducer } from "react";
import './semaforo.css';

const estadoInicial={
   luz:'rojo',
   averiado:false,
   ciclos:0
}

const sigueLuz={
   rojo:'verde',
   verde:'ambar',
   ambar:'rojo'
};
const tiempos = {
  rojo: 4000,
  verde: 3000,
  ambar: 1000,
};

function reducer(estado, accion) {
  switch (accion.type) {
    case 'avanzar':
      if (estado.averiado) {
        return estado;
      }

      return {
        ...estado,
        luz: sigueLuz[estado.luz],
        ciclos: estado.ciclos + (estado.luz === 'ambar' ? 1 : 0),
      };

    case 'averia':
      return { ...estado, luz: 'ambar', averiado: true };

    case 'reparar':
      return { ...estadoInicial, ciclos: estado.ciclos };

    case 'reset':
      return { ...estadoInicial };

    default:
      throw new Error('Acción desconocida');
  }
}

export default function Semaforo() {
  const [estado, dispatch] = useReducer(reducer, estadoInicial);
  const { luz, averiado, ciclos } = estado;

  useEffect(() => {
    if (estado.averiado) {
      return;
    }

    const temporizador = setTimeout(() => {
      dispatch({ type: 'avanzar' });
    }, tiempos[estado.luz]);

    return () => clearTimeout(temporizador);
  }, [estado]);

  return (
    <section>
      <div className="semaforo" aria-hidden="true">
        <div className={`luz ${luz === 'rojo' ? 'rojo' : ''}`} />

        <div
          className={`luz ${luz === 'ambar' ? 'ambar' : ''} ${
            averiado ? 'parpadeo' : ''
          }`}
        />

        <div className={`luz ${luz === 'verde' ? 'verde' : ''}`} />
      </div>

      <p>Luz actual: {averiado ? 'Ámbar parpadeando' : luz === 'ambar' ? 'ámbar' : luz}</p>
      <p>Ciclos completados: {ciclos}</p>

      <div className="semaforo-botones">
        <button type="button" onClick={() => dispatch({ type: 'avanzar' })}>
          Avanzar
        </button>
        <button type="button" onClick={() => dispatch({ type: 'averia' })}>
          Avería
        </button>
        <button type="button" onClick={() => dispatch({ type: 'reparar' })}>
          Reparar
        </button>
        <button type="button" onClick={() => dispatch({ type: 'reset' })}>
          Reset
        </button>
      </div>
    </section>
  );
}