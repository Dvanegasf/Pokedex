import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/evolves.css';

function Evolves() {
  const [evolutions, setEvolucion] = useState([]);
  const [chainevolve, setchainevolves] = useState([]);
  const [chainevolve2, setchainevolves2] = useState([]);
  const [chainevolve3, setchainevolves3] = useState([]);
  const [details2, setdetails2] = useState([]);
  const [details3, setdetails3] = useState([]);
  const [pokemon, setPokemon] = useState([]);

  const { id } = useParams();

  // Obtener la cadena de evoluciones
  const fetchEvolutionChain = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
      setEvolucion([response.data]);
    } catch (err) {
      console.error(err);
    }
  };

  // Obtener los nombres de las evoluciones y detalles
  const fetchEvolutionData = async () => {
    if (evolutions[0]?.evolution_chain.url) {
      try {
        const response = await axios.get(evolutions[0].evolution_chain.url);
        const chain = response.data.chain;
        
        // Primer nivel de evolución
        setchainevolves([chain.species.name]);
        
        // Segundo nivel de evolución
        const secondEvolves = chain.evolves_to.map(evo => evo.species.name);
        setchainevolves2(secondEvolves);
        
        // Detalles del segundo nivel
        const details2 = chain.evolves_to.map(evo => evo.evolution_details[0] || {});
        setdetails2(details2);
        
        // Tercer nivel de evolución
        const thirdEvolves = chain.evolves_to.flatMap(evo => evo.evolves_to.map(evo2 => evo2.species.name));
        setchainevolves3(thirdEvolves);
        
        // Detalles del tercer nivel
        const details3 = chain.evolves_to.flatMap(evo => evo.evolves_to.map(evo2 => evo2.evolution_details[0] || {}));
        setdetails3(details3);

      } catch (err) {
        console.error(err);
      }
    }
  };

  // Obtener imágenes de Pokémon
  const fetchPokemonImages = async () => {
    const allEvolutions = [...chainevolve, ...chainevolve2, ...chainevolve3];
    const urls = allEvolutions.map(name => `https://pokeapi.co/api/v2/pokemon/${name}/`);

    try {
      const responses = await Promise.all(urls.map(url => axios.get(url)));
      const images = responses.map(response => response.data.sprites.other['official-artwork'].front_default);
      setPokemon(images);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvolutionChain();
  }, [id]);

  useEffect(() => {
    if (evolutions.length > 0) {
      fetchEvolutionData();
    }
  }, [evolutions]);

  useEffect(() => {
    if (chainevolve.length > 0 || chainevolve2.length > 0 || chainevolve3.length > 0) {
      fetchPokemonImages();
    }
  }, [chainevolve, chainevolve2, chainevolve3]);

  const renderValidDetails = (details) => {
    if (!details || details.length === 0) return null;
  
    return details.map((detail, i) => {
      
      const validDetails = Object.entries(detail)
        .filter(([key, value]) => value !== null && value !== false && value !== "")
        .map(([key, value]) => (
          <div key={key} className="detail__item">
            <strong>{key}:</strong> {typeof value === 'object' && value.name ? value.name : value.toString()}
          </div>
        ));
  
      return (
        <div key={i} className="detail__group">
          {validDetails.length > 0 ? validDetails : <div>No details available.</div>}
        </div>
      );
    });
  };;

  return (
    <div className="evo__cont">
      <div className='evo__1'>
      {chainevolve.map((evolution, index) => (
        <div className="evo__card" key={`first-${index}`}>
          {pokemon[index] && (
            <>  
              <div className='evo__cont3'>
                <img
                  className="evo__img"
                  src={pokemon[index]}
                  alt={evolution}
                  />
                <span className="evo__name">{evolution}</span>
              </div>     
                {chainevolve2.length > 0 && <span className="arrow">↓</span>}
            </>
          )}
        </div>
      ))}
    </div>
  <div className='evo__2'>
    {chainevolve2.map((evolution, index) => (
    <div className="evo__card" key={`second-${index}`}>
      {pokemon[chainevolve.length + index] && (
        <>
          <div className='evo__cont2'>
            <div className='evo__cont3'>
              <img
                className="evo__img"
                src={pokemon[chainevolve.length + index]}
                alt={evolution}
              />
              <span className="evo__name">{evolution}</span>
            </div>
            <div className="details__cont">
              {renderValidDetails([details2[index]])}
            </div>
          </div>
          {index === chainevolve2.length - 1 && chainevolve3.length > 0 && (
            <span className="arrow">↓</span>
          )}
        </>
      )}
      {chainevolve2.length > 1 && index !== chainevolve2.length - 1 && (
        <span className="divider">or</span>
      )}
    </div>
  
  ))}
  </div>
    <div className='evo__3'>
        {chainevolve3.map((evolution, index) => (
          <div className="evo__card" key={`third-${index}`}>
            {pokemon[chainevolve.length + chainevolve2.length + index] && (
              <>
                <div className='evo__cont2'>
                  <div className='evo__cont3'>
                  <img
                    className="evo__img"
                    src={pokemon[chainevolve.length + chainevolve2.length + index]}
                    alt={evolution}
                  />
                  <span className="evo__name">{evolution}</span>
                  </div>

                  <div className="details__cont">
                    {renderValidDetails([details3[index]])}
                  </div>
                </div>
                  {chainevolve3.length > 1 && index === 0 && <span className="divider">or</span>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

}

export default Evolves;
