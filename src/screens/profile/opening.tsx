import { useEffect, useState } from "react"
import ViewOpening from "@/sections/organization/openings/opening_view"
import getHandler from "@/handlers/get_handler"
import { currentOrgSelector } from "@/slices/orgSlice"
import { useSelector } from "react-redux"
import Toaster from "@/utils/toaster"
import { Opening } from "@/types"
import OpeningCard from "@/components/organization/opening_card"
import NewOpening from "@/sections/organization/openings/new_opening";
interface Props{
    orgID:string
}
//copy from projects .tsx

export default function Openings(props:Props){
  const currentOrg = useSelector(currentOrgSelector);
    const[clickedOnNewOpening,setClickedOnNewOpening]=useState<boolean>(false) 
    const [openings,setOpenings]=useState<Opening[]>([]);
    const [clickedOnOpening,setClickedOnOpening]=useState<boolean>(false)
    const [clickedOnOpeningId,setClickedOnOpeningId]=useState<string>('');
    const [openingClicked,setOpeningClicked]=useState<Opening>()
    useEffect(()=>{
      const getOpenings=async()=>{
        const URL=`/org/${currentOrg.id}/openings`
        const res= await getHandler(URL);
        console.log(res)
        if(res.status==0){
          Toaster.error('Error')
          return;
        } 
        setOpenings(res.data.openings) 
        return;
      }
      getOpenings();
      
    },[])
return (
  <>
  {
    clickedOnOpening?(<ViewOpening setClickedOnOpening={setClickedOnOpening} openingId={openingClicked?.id ||'' } openingClicked={openingClicked} data={openings} setData={setOpenings} setOpeningClicked={setOpeningClicked}/>):''
  }
  {
    clickedOnNewOpening?(<NewOpening setClickedOnNewOpening={setClickedOnNewOpening} openings={openings} setOpenings={setOpenings}/>):''
  }
<div className="w-full flex-row flex-wrap relative">
  
<div className="w-full px-2 pb-8 max-md:px-0 max-md:pb-2 z-50">
     <div
              onClick={() => setClickedOnNewOpening(true)}
              className={`mb-8 w-108 max-md:w-5/6 h-24 max-md:hover:scale-105 hover:scale-125 group relative overflow-clip bg-white hover:bg-[#f3f3f3] mx-auto border-[1px] pattern1 rounded-lg cursor-pointer flex-center flex-col transition-ease-300`}
            >
              <div className="backdrop-blur-md opacity-0 group-hover:opacity-60 w-2/3 h-2/3 rounded-xl transition-ease-out-300"></div>
              <div className="font-extrabold text-xl group-hover:text-2xl text-gradient absolute translate-y-0 group-hover:-translate-y-2 transition-ease-out-300">
                Create a new Opening!
              </div>
              <div className="text-xs font-semibold text-primary_black absolute translate-x-0 translate-y-16 group-hover:translate-y-4 transition-ease-out-300">
                Woohooh! New Opening! Who Dis?
              </div>
            </div>
</div>
<div>
  {openings.map((opening:Opening,index:number)=>{
    return(<div>
     <OpeningCard setClickedOnOpening={setClickedOnOpening} openingId={opening.id} key={index} isActive={opening.active} tags={opening.tags} title={opening.title} description={opening.description} clickedOnOpening={clickedOnOpening} setClickedOnOpeningId={setClickedOnOpeningId} opening={opening} setOpeningClicked={setOpeningClicked}/>
    </div>)
  })}
</div>
</div>
</>
)
}