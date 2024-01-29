import BaseWrapper from "@/wrappers/base"
import OrgSidebar from "@/components/common/org_sidebar"
import MainWrapper from "@/wrappers/main"
import getHandler from '@/handlers/get_handler';
import { useSelector } from 'react-redux';
import { currentOrgSelector } from '@/slices/orgSlice';
import { useState, useEffect } from 'react'
import NewOpening from "@/sections/organization/openings/new_opening";
import checkOrgAccess from "@/utils/funcs/check_org_access";
import { Plus } from "@phosphor-icons/react";
import { ORG_MANAGER } from "@/config/constants";
import NoOpenings from "@/components/empty_fillers/no_openings";
import OpeningCard from "@/components/organization/opening_card";
import ViewOpening from "@/sections/organization/openings/opening_view";
import { Opening } from "@/types";
import Toaster from "@/utils/toaster";
import { SERVER_ERROR } from "@/config/errors";
export default function OpeningPage() {
    //todo: add loaders 
    const [loading, setLoading] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [opening, setOpening] = useState<Opening[]>([]);
    const [clickedOnOpening, setClickedOnOpening] = useState<boolean>(false)
    const [openingClicked,setOpeningClicked]= useState<Opening>()
    const currentOrg = useSelector(currentOrgSelector);
    //change the name here maybe, its a string state
    const [clickedOnOpeningId, setClickedOnOpeningId] = useState<string>('')

    const getOpenings = async () => {
        const URL = `/org/${currentOrg.id}/orgopenings`
        const res = await getHandler(URL)
        if (res.statusCode === 200) {
           setOpening(res.data.openings|| []);
          } else {
            if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
            else {
              Toaster.error(SERVER_ERROR, 'error_toaster');
            }
          }
    }
    useEffect(() => {
        getOpenings()
    }, [])


    return (
        <BaseWrapper title="Openings">
            {clickedOnOpening?<ViewOpening setClickedOnOpening={setClickedOnOpening} openingId={clickedOnOpeningId} clickedOpening={openingClicked} setClickedOpening={setOpeningClicked} opening={opening} setOpening={setOpening}/>:''}
            <OrgSidebar index={15}></OrgSidebar>
            <MainWrapper>
                {openModal ? (<NewOpening setClickedOnNewOpening={setOpenModal} openings={opening} setOpenings={setOpening}/>) : ''}
                <div className="w-full flex justify-between items-center p-base_padding f ">

                    <div className="w-fit text-6xl font-semibold dark:text-white font-primary ">Openings</div>
                    {checkOrgAccess(ORG_MANAGER) ? (
                        <Plus
                            onClick={() => setOpenModal(!openModal)}
                            size={42}
                            className="flex-center rounded-full hover:bg-white p-2 transition-ease-300 cursor-pointer"
                            weight="regular"
                        />) : ''}


                </div>

                {
                    opening ? (opening.map((data: Opening, index) => {
                        return (
                            <OpeningCard setClickedOnOpening={setClickedOnOpening} openingId={data.id} key={index} clickedOnOpening={clickedOnOpening} setClickedOnOpeningId={setClickedOnOpeningId} opening={data} setOpeningClicked={setOpeningClicked}/>
                        )
                    })) : (<NoOpenings />)
                }

            </MainWrapper>
        </BaseWrapper>)


}