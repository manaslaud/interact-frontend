import { EXPLORE_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import SearchSuggestions from './search_suggestions';

interface Props {
  initialValue?: string;
}

const SearchBar = ({ initialValue = '' }: Props) => {
  const [search, setSearch] = useState(initialValue);
  const router = useRouter();
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const submitSearch = async () => {
    const URL = `${EXPLORE_URL}/search`;
    await postHandler(URL, {
      search,
    });
  };

  const handleChange = (el: React.ChangeEvent<HTMLInputElement>) => {
    setShowSearchSuggestions(true);
    setSearch(el.target.value);
  };

  const handleSubmit = (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (search === '') router.push('/explore');
    else {
      submitSearch();
      setShowSearchSuggestions(false);
      router.push(`/explore?search=${search}`);
    }
  };
  return (
    <div className="relative w-taskbar max-md:w-taskbar_md mx-auto">
      <form
        onSubmit={handleSubmit}
        className={`w-full h-taskbar px-4 text-gray-500 ${
          search.trim().length > 0 ? 'bg-white' : 'bg-gray-100'
        } dark:text-white flex items-center justify-between gap-8 mx-auto rounded-md border-white border-2 dark:border-0 shadow-lg dark:shadow-outer dark:bg-gradient-to-b dark:from-dark_primary_gradient_start dark:to-dark_primary_gradient_end transition-ease-200`}
      >
        <input
          className="h-full grow bg-transparent focus:outline-none font-primary font-medium"
          type="text"
          onClick={() => setShowSearchSuggestions(true)}
          placeholder="Search"
          value={search}
          onChange={handleChange}
        />
        <MagnifyingGlass size={32} className="opacity-75" />
      </form>
      {showSearchSuggestions ? (
        <SearchSuggestions search={search} setSearch={setSearch} setShow={setShowSearchSuggestions} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default SearchBar;
