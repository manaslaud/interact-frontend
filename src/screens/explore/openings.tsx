import Loader from '@/components/common/loader';
import OpeningCard from '@/components/explore/opening_card';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL, OPENING_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import OpeningView from '@/sections/explore/opening_view';
import { Opening } from '@/types';
import { initialOpening } from '@/types/initials';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';

const Openings = () => {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedOnOpening, setClickedOnOpening] = useState(false);
  const [clickedOpening, setClickedOpening] = useState(initialOpening);

  const fetchOpenings = async (search: string | null) => {
    setLoading(true);
    let URL =
      search && search != ''
        ? `${EXPLORE_URL}/openings/trending${'?search=' + search}`
        : `${EXPLORE_URL}/openings/recommended`;

    const projectSlug = new URLSearchParams(window.location.search).get('project');
    if (projectSlug) URL = `${EXPLORE_URL}/openings/${projectSlug}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setOpenings(res.data.openings || []);
      if (clickedOnOpening) {
        if (res.data.openings?.length > 0) setClickedOpening(res.data.openings[0]);
        else {
          setClickedOnOpening(false);
          setClickedOpening(initialOpening);
        }
      }
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const fetchOpening = async (id: string | null) => {
    setLoading(true);
    const URL = `${OPENING_URL}/${id}`;

    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setOpenings([res.data.opening] || []);

      if (res.data.opening) {
        setClickedOpening(res.data.opening || initialOpening);
        setClickedOnOpening(true);
      }

      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    const oid = new URLSearchParams(window.location.search).get('oid');
    if (oid && oid != '') fetchOpening(oid);
    else fetchOpenings(new URLSearchParams(window.location.search).get('search'));
  }, [window.location.search]);

  return (
    <div className="w-full flex flex-col gap-6 px-2 py-2">
      {loading ? (
        <Loader />
      ) : (
        <>
          {openings.length > 0 ? (
            <div className="flex justify-evenly px-4">
              <div className={`${clickedOnOpening ? 'w-[40%]' : 'w-[720px]'} max-md:w-[720px] flex flex-col gap-4`}>
                {openings.map(opening => {
                  return (
                    <OpeningCard
                      key={opening.id}
                      opening={opening}
                      clickedOpening={clickedOpening}
                      setClickedOnOpening={setClickedOnOpening}
                      setClickedOpening={setClickedOpening}
                    />
                  );
                })}
              </div>
              {clickedOnOpening ? (
                <OpeningView opening={clickedOpening} setShow={setClickedOnOpening} setOpening={setClickedOpening} />
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div>No Openings found</div>
          )}
        </>
      )}
    </div>
  );
};

export default Openings;
