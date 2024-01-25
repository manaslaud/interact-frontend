import categories from "@/utils/categories";
import {useState} from 'react'
export default function NewOpening(){
    const [category,setCategory]=useState<String>('');
  return (
    <div>
         <select
                      onChange={el => setCategory(el.target.value)}
                      className="w-1/2 max-lg:w-full h-12 border-[1px] border-primary_btn  dark:border-dark_primary_btn dark:text-white bg-primary_comp dark:bg-[#10013b30] focus:outline-nonetext-sm rounded-lg block p-2"
                    >
                      {categories.map((c, i) => {
                        return (
                          <option className="bg-primary_comp_hover dark:bg-[#10013b30]" key={i} value={c}>
                            {c}
                          </option>
                        );
                      })}
                    </select>
    </div>
  )  
}