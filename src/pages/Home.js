import React, { useCallback, useState } from 'react';
import ActorGrid from '../components/actor/ActorGrid';
import ShowGrid from '../components/shows/ShowGrid';
import MainPageLayout from '../components/MainPageLayout';
import { apiGet } from '../misc/config';
import { useLastQuery } from '../misc/custom-hooks';
import {RadioInputsWrapper,SearchButtonWrapper,SearchInput,} from './Home.styled';
import CustomRadio from '../components/CustomRadio';


const renderResults = (results) => {
  if (results && results.length === 0) {
    return <div>No results</div>;
  }
  if (results && results.length > 0) {
    return results[0].show ? (
      <ShowGrid data={results} />
    ) : (
      <ActorGrid data={results} />
    );
  }
  return null;
};

const Home = () => {
  const [input, setInput] = useLastQuery();
  const [results, setResults] = useState(null);
  const [searchOption, setSearchOption] = useState('shows');

  const isShowsSearch = searchOption === 'shows';

  const onSearch = () => {
    apiGet(`/search/${searchOption}?q=${input}`).then(result => {
      setResults(result);
    });
  };

  const onInputChange =useCallback(ev => {
    setInput(ev.target.value);
  },[setInput]) ;

  const onKeyDown = ev => {
    if (ev.keyCode === 13) {
      onSearch();
    }
  };

  const onRadioChange =useCallback( ev => {
    setSearchOption(ev.target.value);
  },[]);

 
  return (
    <MainPageLayout>
      <SearchInput
        type="text"
        placeholder="Search here"
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={input}
      />
      <RadioInputsWrapper>
        <div>
          <CustomRadio
            label="shows"
            id="shows-search"
            value="shows"
            checked={isShowsSearch}
            onChange={onRadioChange}
          />
        </div>

        <div>
          <CustomRadio
            label="Actors"
            id="actors-search"
            value="people"
            checked={!isShowsSearch}
            onChange={onRadioChange}
          />
        </div>
      </RadioInputsWrapper>

      <SearchButtonWrapper>
        <button type="button" onClick={onSearch}>
          Search
        </button>
      </SearchButtonWrapper>
      {renderResults(results)}
    </MainPageLayout>
  );
};

export default Home;
