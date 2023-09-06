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
      className="w-taskbar h-taskbar px-4 flex items-center justify-between gap-8 mx-auto rounded-md shadow-outer bg-gradient-to-b from-primary_gradient_start to-primary_gradient_end"
    >
      <input
        className="h-full grow bg-transparent focus:outline-none font-primary text-white font-medium"
        type="text"
        placeholder="Search"
        value={search}
        onChange={el => setSearch(el.target.value)}
      />
      <MagnifyingGlass color="white" size={32} className="opacity-75" />
    </form>
  );
};

export default SearchBar;
