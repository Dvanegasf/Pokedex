import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import './styles/evolves.css'
import axios from 'axios';

function Evolves() {
  const [evolutions, setEvolucion] = useState([]);
  const [chainevolve, setchainevolves] = useState([]);
  const [pokemon, setPokemon] = useState([]); // Cambiado de useFetch a useState
  const { id } = useParams();

  // Función para obtener datos de la especie de Pokémon
  const evolves = () => {
    axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
      .then((value) => {
        setEvolucion([value.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  





  // Función para obtener la cadena de evolución
  const chainevolves = () => {
    if (evolutions[0]?.evolution_chain.url) {
      axios.get(evolutions[0].evolution_chain.url)
        .then((value) => {

          // comprobar el inicio de la cadena evolutiva
          const firstevolutiondata = [value.data.chain.species.name];

          // Comprobar si hay más evoluciones en el primer nivel          
          const evolutionsData = value.data.chain.evolves_to;
          const evolvedPokemons = evolutionsData.map(evolution => evolution.species.name) || [] ;
          
          // Comprobar si hay más evoluciones en el segundo nivel
          const additionalEvolutions = evolutionsData[0]?.evolves_to.map(evolution => evolution.species.name) || [];

          const allEvolutions = [...firstevolutiondata, ...evolvedPokemons, ...additionalEvolutions];
          setchainevolves(allEvolutions);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // Obtener datos de Pokémon cuando `chainevolve` cambia
  useEffect(() => {
    if (chainevolve.length > 0) {
      const urls = chainevolve.map(name => `https://pokeapi.co/api/v2/pokemon/${name}/`);

      Promise.all(urls.map(url => axios.get(url)))
        .then(responses => {
          // Extraer las imágenes de cada respuesta
          const images = responses.map(response => response.data.sprites.other['official-artwork'].front_default);
          setPokemon(images);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [chainevolve]);

  // Obtener datos de evolución al montar el componente
  useEffect(() => {
    evolves();
  }, []);

  // Obtener la cadena de evolución cuando `evolutions` cambia
  useEffect(() => {
    if (evolutions.length > 0) {
      chainevolves();
    }
  }, [evolutions]);

  return (
    <>
      <ul className='cont__evo'> 
        {chainevolve.map((evolution, index) => (
          <li className='evos' key={index}>
            {pokemon[index] && (
              <img
                className='evo__img'
                src={pokemon[index]}
                alt={evolution}
              />
            )}
            <li className='evo__name'>{evolution}</li>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Evolves;
