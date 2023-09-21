import { MagnifyingGlass } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface Props {
  initialValue?: string;
}

const SearchBar = ({ initialValue = '' }: Props) => {
  const [search, setSearch] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (el: React.FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (search === '') router.push('/explore');
    else router.push(`/explore?search=${search}`);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={`w-taskbar max-md:w-taskbar_md h-taskbar px-4 text-gray-500 ${
        search.trim().length > 0 ? 'bg-white' : ''
      } dark:text-white flex items-center justify-between gap-8 mx-auto rounded-md border-gray-100 border-2 dark:border-0 shadow-lg dark:shadow-outer dark:bg-gradient-to-b dark:from-dark_primary_gradient_start dark:to-dark_primary_gradient_end transition-ease-100`}
    >
      <input
        className="h-full grow bg-transparent focus:outline-none font-primary font-medium"
        type="text"
        placeholder="Search"
        value={search}
        onChange={el => setSearch(el.target.value)}
      />
      <MagnifyingGlass size={32} className="opacity-75" />
    </form>
  );
};

export default SearchBar;
