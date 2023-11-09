import getDomainName from '@/utils/get_domain_name';
import Link from 'next/link';
import React from 'react';
import getIcon from '@/utils/get_icon';

interface Props {
  links: string[];
  title?: string;
}

const Links = ({ links, title = 'Links' }: Props) => {
  return (
    <div>
      {links && links.length > 0 ? (
        <div className="w-full flex flex-col gap-2">
          <div className="text-lg font-semibold">{title}</div>
          <div className="w-full flex gap-4 justify-start flex-wrap">
            {links.map(link => {
              return (
                <Link key={link} href={link} target="_blank">
                  {getIcon(getDomainName(link), 40)}
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Links;
