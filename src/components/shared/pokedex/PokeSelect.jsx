import React, { useEffect, useRef } from 'react';
import useFetch from '../../../hooks/useFetch';
import './styles/pokeSelect.css';

const PokeSelect = ({ setTypeFilter }) => {
    const [types, getTypes] = useFetch();

    useEffect(() => {
        const url = 'https://pokeapi.co/api/v2/type';
        getTypes(url);
    }, []);

    const valueSelect = useRef();

    const handleChange = () => {
        setTypeFilter(valueSelect.current.value);
    };

    return (
        <select className='pokeselect' onChange={handleChange} ref={valueSelect}>
            <option className='pokeselect__option' value="">All types of pokemon </option>
            {
                types?.results
                    .filter(type => !['unknown', 'stellar'].includes(type.name))
                        .map(type => (
                            <option key={type.url} value={type.url}>
                                {type.name}
                            </option>
                    ))
            }
        </select>
    );
};

export default PokeSelect;