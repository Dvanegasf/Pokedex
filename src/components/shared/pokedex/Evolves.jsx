import React, { useEffect, useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/evolves.css';
import './styles/pokeCard.css';


function Evolves() {
  const { pokemonId: paramPokemonId } = useParams();
  const [evolutions, setEvolucion] = useState([]);
  const [chainevolve, setchainevolves] = useState([]);
  const [chainevolve2, setchainevolves2] = useState([]);
  const [chainevolve3, setchainevolves3] = useState([]);
  const [details2, setdetails2] = useState([]);
  const [details3, setdetails3] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const [pokemonIdState, setPokemonIdState] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleClick = (pokemonId) => {
    navigate(`/pokedex/${pokemonId}`,{ state
      : true });
  }

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
    let urls = allEvolutions.map(name => `https://pokeapi.co/api/v2/pokemon/${name}/`);
    
    try {
      const responses = await Promise.all(urls.map(url => axios.get(url)));
      const images = responses.map(response => response.data.sprites.other['official-artwork'].front_default);
      setPokemon(images);
      console.log()
    } catch (err) {
      console.error(err);
    }
  };
 
  const fetchPokemonIdState = async () => {
    const allEvolutions = [...chainevolve, ...chainevolve2, ...chainevolve3];
    let urls = allEvolutions.map(name => `https://pokeapi.co/api/v2/pokemon/${name}/`);
    
    try {
      const responses = await Promise.all(urls.map(url => axios.get(url)));
      const id = responses.map(response => response.data);
      setPokemonIdState(id);
      console.log()
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
  useEffect(() => {
    if (chainevolve.length > 0 || chainevolve2.length > 0 || chainevolve3.length > 0) {
      fetchPokemonIdState();
    }
  }, [chainevolve, chainevolve2, chainevolve3]);

  const renderValidDetails = (details) => {
    if (!details || details.length === 0) return null;
  
    const keyMappings = {
      gender: 'gender',
      held_item : 'held item',
      known_move : 'known move',
      known_move_type: 'known move type',
      min_affection : 'req affection',
      min_beauty : 'req beauty',
      min_happiness : 'req happiness',
      min_level : 'req level',
      needs_overworld_rain : 'needs overworld rain',
      party_species : 'party species',
      party_type : 'party type',
      relative_physical_stats : 'relative physical stats',
      time_of_day : 'time of day',
      trade_species : 'trade species',
      turn_upside_down : 'turn upside down',
      trigger : 'method',
      
      
      // Añade más mapeos de claves aquí según sea necesario
    };
  
    const valueMappings = {
      gender: {
        1: 'female',
        2: 'macho',
        0: 'unknown',
      },
      // Añade más mapeos de valores aquí según sea necesario
    };
    
    return details.map((detail, i) => {
      const validDetails = Object.entries(detail)
      .filter(([key, value]) => value !== null && value !== false && value !== "")
      .map(([key, value]) => {
        const displayKey = keyMappings[key] || key; // Cambia el nombre de la clave si existe un mapeo
        let displayValue = value;
        
          if (valueMappings[key]) {
            displayValue = valueMappings[key][value] || value; // Cambia el valor si existe un mapeo para esta clave
          }
          // Asegúrate de que displayValue sea una cadena antes de aplicar el reemplazo
          if (typeof displayValue === 'string') {
            displayValue = displayValue.replace(/[-/_]/g, ' ');
            
          } else if (typeof displayValue === 'object' && displayValue.name) {
            displayValue.name = displayValue.name.replace(/[-/_]/g, ' ');
          }  
          return (
            <div key={key} className="">
              <strong className="detail__item">{displayKey}:</strong> {typeof displayValue === 'object' && displayValue.name ? displayValue.name : displayValue.toString()}
            </div>
          );
        });
  
      return (
        <div key={i} className="detail__group">
          {validDetails.length > 0 ? validDetails : <div>No details available.</div>}
        </div>
      );
    });
  };

  return (
      <div className="evo__cont">
        <div className='evo__1'>
        {chainevolve.map((evolution, index) => (
          <div className={`evo__card ${pokemonIdState[index]?.types[0].type.name}`} key={`first-${index}`}>
            {pokemon[index] && (
              <>  
                <div className='evo__cont4'  onClick={() => handleClick(pokemonIdState[index].id)}>
                  <img
                    className="evo__img"
                    src={pokemon[index]}
                    alt={evolution}
                    />
                  <div className='evo__name'>
                      <span>#{pokemonIdState[index].id} </span>
                      <span>{evolution}</span>
                    </div>
                {chainevolve2.length > 0 && <span className="arrow1">↓</span>}
                </div>     
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
            <div className={`evo__cont2 ${pokemonIdState[index + 1]?.types[0].type.name}`} onClick={() => handleClick(pokemonIdState[chainevolve.length + index].id)}>
              <div className='evo__cont3'>
                <img
                  className="evo__img"
                  src={pokemon[chainevolve.length + index]}
                  alt={evolution}
                />
                <div className='evo__name'>
                      <span>#{pokemonIdState[index + 1].id} </span>
                      <span>{evolution}</span>
                    </div>
              </div>
              <div className="details__cont">
                {renderValidDetails([details2[index]])}
              </div>
            </div>
            
            {index === chainevolve2.length - 1 && chainevolve3.length > 0 && (
              <span className="arrow2">↓</span>
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
            <div className="evo__card" key={`third-${index}`} onClick={() => handleClick(pokemonIdState[chainevolve.length + chainevolve2.length + index].id)}>
              {pokemon[chainevolve.length + chainevolve2.length + index] && (
                <>
                  <div className={`evo__cont2 ${pokemonIdState[index + 1]?.types[0].type.name}`}>
                    <div className='evo__cont3 '>
                    <img
                      className="evo__img"
                      src={pokemon[chainevolve.length + chainevolve2.length + index]}
                      alt={evolution}
                    />
                    <div className='evo__name'>
                      <span>#{pokemonIdState[index + 2].id} </span>
                      <span>{evolution}</span>
                    </div>
                    </div>

                    <div className="details__cont">
                      {renderValidDetails([details3[index]])}
                    </div>
                  </div>
                </>
              )}
          {chainevolve3.length > 1 && index === 0 && <span className="divider">or</span>}
            </div>
          ))}
        </div>
      </div>
  );

}

export default Evolves;
