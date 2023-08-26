import Toaster from '@/utils/toaster';
import React, { FormEvent, useState } from 'react';
import isURL from 'validator/lib/isURL';
import Link from 'next/link';
import getIcon from '@/utils/get_icon';

interface Props {
  links: string[];
  setLinks: React.Dispatch<React.SetStateAction<string[]>>;
}

const Links = ({ links, setLinks }: Props) => {
  const [newLink, setNewLink] = useState('');
  const [showURL, setShowURL] = useState(-1);

  const addLink = (el: FormEvent<HTMLFormElement>) => {
    el.preventDefault();
    if (links && links.length == 5) {
      Toaster.error('Can add only 5 links');
      return;
    }
    if (isURL(newLink)) {
      if (newLink.startsWith('https://www.')) setLinks(prev => [...prev, newLink]);
      else if (newLink.startsWith('https://')) setLinks(prev => [...prev, newLink.replace('https://', 'https://www.')]);
      else if (newLink.startsWith('www.')) setLinks(prev => [...prev, 'https://' + newLink]);
      else setLinks(prev => [...prev, 'https://www.' + newLink]);
      setNewLink('');
    } else Toaster.error('Enter a valid URL');
  };

  const getDomainName = (link: string) => {
    return new URL(link).hostname
      .replace('.com', '')
      .replace('.co', '')
      .replace('.in', '')
      .replace('.org', '')
      .replace('.net', '')
      .replace('www.', '');
  };

  return (
    <>
      <div className="w-full bg-white flex flex-col ">
        <div className="w-full text-sm font-bold">Links {links.length + '/' + '5'}</div>
        <div className="w-full flex flex-col gap-2">
          {links && links.length > 0 ? (
            <div className="flex flex-col gap-4">
              {links.map((link: string, index: number) => {
                return (
                  <div key={index} className="w-full h-8 flex justify-between gap-2 items-center font-Inconsolata">
                    <div
                      className={`flex items-center gap-2 ${showURL === index ? 'hidden' : ''}`}
                      onMouseEnter={() => setShowURL(index)}
                    >
                      {getIcon(getDomainName(link))}
                      <div className="capitalize">{getDomainName(link)}</div>
                    </div>
                    <Link
                      className={`text-xs border-[1px] border-black border-dashed rounded-lg px-2 py-1 ${
                        showURL !== index ? 'hidden' : ''
                      }`}
                      href={link}
                      target="_blank"
                      onMouseLeave={() => setShowURL(-1)}
                    >
                      {link.length < 40 ? link : link.substring(0, 40) + '...'}
                    </Link>
                    <div
                      className="mr-5 cursor-pointer"
                      onClick={() => {
                        const newLinks = [...links];
                        newLinks.splice(index, 1);
                        setLinks(newLinks);
                      }}
                    >
                      X
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <></>
          )}

          {links.length < 5 ? (
            <form onSubmit={addLink}>
              <input
                className="w-full h-12 bg-slate-200 rounded-lg font-Inconsolata px-4 py-2"
                value={newLink}
                onChange={el => setNewLink(el.target.value)}
                placeholder="Add a New Link"
              />
            </form>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default Links;
