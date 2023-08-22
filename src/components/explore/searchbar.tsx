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
    <form onSubmit={handleSubmit} className="w-full bg-slate-100 h-12">
      <input type="text" placeholder="Search" value={search} onChange={el => setSearch(el.target.value)} />
    </form>
  );
};

export default SearchBar;
