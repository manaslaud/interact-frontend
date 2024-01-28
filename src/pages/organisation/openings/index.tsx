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
export default function OpeningPage() {
    //todo: add loaders 
    const [loading, setLoading] = useState<boolean>(true);
    const [openingData, setOpeningData] = useState();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [data, setData] = useState<Opening[]>([]);
    const [clickedOnOpening, setClickedOnOpening] = useState<boolean>(false)
    const [openingClicked,setOpeningClicked]= useState<Opening>()
    const currentOrg = useSelector(currentOrgSelector);
    //change the name here maybe, its a string state
    const [clickedOnOpeningId, setClickedOnOpeningId] = useState<string>('')

    const getOpenings = async () => {
        const URL = `/org/${currentOrg.id}/openings`
        console.log(URL)
        const res = await getHandler(URL)
        console.log(res.data.openings)
        setData(res.data.openings);
    }
    useEffect(() => {
        getOpenings()
    }, [])

    // const handleOpeningClick=()=>{

    // }

    return (
        <BaseWrapper title="Openings">
            {clickedOnOpening?<ViewOpening setClickedOnOpening={setClickedOnOpening} openingId={clickedOnOpeningId} openingClicked={openingClicked} setOpeningClicked={setOpeningClicked} data={data} setData={setData}/>:''}
            <OrgSidebar index={15}></OrgSidebar>
            <MainWrapper>
                {openModal ? (<NewOpening setClickedOnNewOpening={setOpenModal} openings={data} setOpenings={setData}/>) : ''}
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
                    data ? (data.map((data: any, index) => {
                        return (
                            <OpeningCard setClickedOnOpening={setClickedOnOpening} openingId={data.id} key={index} isActive={data.active} tags={data.tags} title={data.title} description={data.description} clickedOnOpening={clickedOnOpening} setClickedOnOpeningId={setClickedOnOpeningId} opening={data} setOpeningClicked={setOpeningClicked}/>
                        )
                    })) : (<NoOpenings />)
                }

            </MainWrapper>
        </BaseWrapper>)


}