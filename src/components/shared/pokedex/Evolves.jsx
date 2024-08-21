import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/evolves.css';

function Evolves() {
  const [evolutions, setEvolucion] = useState([]);
  const [chainevolve, setchainevolves] = useState([]);
  const [chainevolve2, setchainevolves2] = useState([]);
  const [chainevolve3, setchainevolves3] = useState([]);
  const [pokemon, setPokemon] = useState([]); 

  const { id } = useParams();

  const evolves = () => {
    axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
      .then((value) => {
        setEvolucion([value.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const chainevolves = () => {
    if (evolutions[0]?.evolution_chain.url) {
      axios.get(evolutions[0].evolution_chain.url)
        .then((value) => {
          const firstevolutiondata = [value.data.chain.species.name];
          setchainevolves(firstevolutiondata);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const chainevolves2 = () => {
    if (evolutions[0]?.evolution_chain.url) {
      axios.get(evolutions[0].evolution_chain.url)
        .then((value) => {
          const evolutionsData = value.data.chain.evolves_to;
          const evolvedPokemons = evolutionsData.map(evolution => evolution.species.name);
          setchainevolves2(evolvedPokemons);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const chainevolves3 = () => {
    if (evolutions[0]?.evolution_chain.url) {
      axios.get(evolutions[0].evolution_chain.url)
        .then((value) => {
          const evolutionsData = value.data.chain.evolves_to;
          const additionalEvolutions = evolutionsData[0]?.evolves_to.map(evolution => evolution.species.name) || null;
          setchainevolves3(additionalEvolutions);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const allEvolutions = [...chainevolve, ...chainevolve2, ...chainevolve3];

  useEffect(() => {
    evolves();
  }, [id]);

  useEffect(() => {
    if (evolutions.length > 0) {
      chainevolves();
    }
  }, [evolutions]);

  useEffect(() => {
    if (chainevolve.length > 0) {
      chainevolves2();
    }
  }, [chainevolve]);

  useEffect(() => {
    if (chainevolve2.length > 0) {
      chainevolves3();
    }
  }, [chainevolve2]);

  useEffect(() => {
    if (allEvolutions.length > 0) {
      const urls = allEvolutions.map(name => `https://pokeapi.co/api/v2/pokemon/${name}/`);

      Promise.all(urls.map(url => axios.get(url)))
        .then(responses => {
          const images = responses.map(response => response.data.sprites.other['official-artwork'].front_default);
          setPokemon(images);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [allEvolutions]);


  return (
    <div className="evo__cont">
      {chainevolve.map((evolution, index) => (
        <div className="evo__card" key={`first-${index}`}>
          {pokemon[index] && (
            <>
              <img
                className="evo__img"
                src={pokemon[index]}
                alt={evolution}
              />
              <span className="evo__name">{evolution}</span>
              {chainevolve2.length > 0 && <span className="arrow">→</span>}
            </>
          )}
        </div>
      ))}
     {chainevolve2.map((evolution, index) => (
  <div className="evo__card" key={`second-${index}`}>
    {pokemon[chainevolve.length + index] && (
      <>
        <img
          className="evo__img"
          src={pokemon[chainevolve.length + index]}
          alt={evolution}
        />
        {/* Mostrar '/' después de cada imagen */}
        <span className="evo__name">{evolution}</span>
        {chainevolve2.length > 1 &&  <span className="divider">/</span>}
        {chainevolve3.length > 0 && <span className="arrow">→</span>}
      </>
    )}
  </div>
))}
      {chainevolve3.map((evolution, index) => (
        <div className="evo__card" key={`third-${index}`}>
          {pokemon[chainevolve.length + chainevolve2.length + index] && (
            <>
              <img
                className="evo__img"
                src={pokemon[chainevolve.length + chainevolve2.length + index]}
                alt={evolution}
                />
              <span className="evo__name">{evolution}</span>
                {chainevolve3.length > 1 && index === 0 && <span className="divider">/</span>}
            </>
          )}
        </div>
      ))}
    </div>
  );
  
}

export default Evolves;
