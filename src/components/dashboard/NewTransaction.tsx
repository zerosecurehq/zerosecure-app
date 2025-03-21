import { ChevronDown, Coins, Link, Plus, X } from "lucide-react"
import { useState } from "react"

const SELECT = [
  {name: "Option 1", id: 1},
  {name: "Option 2", id: 2},
  {name: "Option 3", id: 3},
]

const NewTransaction = ({ close }: { close: () => void }) => {
  const [openSelect, setOpenSelect] = useState(false)
  const [seleted, setSelected] = useState(SELECT[0])

  return (
    <div className="absolute inset-0 bg-gray-200 flex justify-center items-center">
      <div className="absolute -top-2 -right-2 bg-gray-300 p-2 rounded-full text-gray-500 cursor-pointer" onClick={close}>
        <X size={30} />
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-5xl space-y-5">
        <div className="col-span-2 flex items-center justify-between">
          <h3 className="text-5xl font-bold">New Transaction</h3>
          <div className="flex items-center gap-2">
            <div className="bg-purple-500 p-1 rounded-full text-white rotate-90">
              <Link />
            </div>
            <span className="font-semibold text-lg">Polygon</span>
          </div>
        </div>
        <div className="col-span-1" />
        <div className="col-span-2 bg-white rounded-md relative">
          <div className="absolute inset-x-0 h-2 bg-gray-300" />
          <div className="absolute left-0 top-0 w-1/2 h-2 bg-green-400" />
          <div>
            <div className="p-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="border border-gray-300 p-1 rounded-md flex justify-center items-center">
                  <Coins />
                </div>
                <h4 className="text-3xl font-bold">Send tokens</h4>
              </div>
              <div className="flex items-center gap-3">
                <h5 className="text-lg font-semibold">Nonce</h5>
                <div className="font-bold text-xl">#</div>
                <input type="text" className="border border-black rounded-md p-2 w-32 font-semibold text-lg" />
              </div>
            </div>
          </div>

          <div className="p-5 space-y-6 border-t border-b border-gray-300">
            <div className="relative">
              <input type="text" className="w-full border border-gray-300 p-5 rounded-md focus:outline-none pl-28" />
              <div className="absolute left-2 -top-4 bg-white p-1">Recipient address</div>
              <div className="absolute flex items-center gap-3 top-1/2 left-4 -translate-y-1/2">
                <div className="w-8 h-8 rounded-full bg-gray-300 " />
                <span className="text-lg">matic: </span>
              </div>
            </div>

            <div className="flex">
              <div className="relative w-2/3 ">
                <input type="text" className="w-full border border-gray-300 p-5  rounded-tl-md rounded-bl-md focus:outline-none text-lg pr-32" placeholder="0" />
                <div className="absolute left-2 -top-4 bg-white p-1 text-gray-500">Amount *</div>
                <div className="absolute py-3 px-5 bg-gray-300 rounded-md font-semibold right-3 top-1/2 -translate-y-1/2">Max</div>
              </div>
              <div className="w-1/3 rounded-tr-md rounded-br-md p-2 border border-gray-300 border-l-transparent">
                <div className="bg-gray-300 h-full rounded-md flex items-center px-3 py-1 gap-2 w-full relative">
                  <Link className="text-purple-600 rotate-90" />
                  <div className="flex-1 flex items-center justify-between cursor-pointer" onClick={() => setOpenSelect(!openSelect)}>
                    <div className="text-sm" >
                      <div>{seleted.name}</div>
                    </div>
                    <ChevronDown size={16} />
                  </div>
                  {openSelect && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-gray-300 p-1 rounded-md space-y-1">
                    {SELECT.map((item) => (
                      <div key={item.id} className="bg-white p-1 rounded-md hover:bg-gray-200 cursor-pointer" onClick={() => {
                        setSelected(item)
                        setOpenSelect(false)
                      }}>{item.name}</div>
                    ))}
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex justify-end">
              <div className="px-5 py-2 rounded-md bg-black text-white w-fit cursor-pointer">Next</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md h-fit">
          <div className="p-5 border-b border-gray-300">
            <span className="font-semibold text-lg">Transaction status</span>
          </div>
          <div className="p-5">
            <div className="space-y-5 pb-4">
              <div className="flex gap-2 items-center relative">
                <div className="w-4 h-4 rounded-full bg-green-400 text-white">
                  <Plus size={16} />
                </div>
                <div className="text-md font-semibold">Create</div>
                <div className="absolute top-full left-2 -translate-x-1/2 w-[2px] h-5 bg-gray-300" />
              </div>

              <div className="flex gap-2 items-center relative">
                <div className="w-4 h-4 rounded-full bg-green-400 text-white">
                  <Plus size={16} />
                </div>
                <div className="text-md font-semibold">
                  Confirmed (0 of 1)
                </div>
                <div className="absolute top-full left-2 -translate-x-1/2 w-[2px] h-5 bg-gray-300" />
              </div>

              <div className="flex gap-2 items-center relative">
                <div className="w-4 h-4 rounded-full bg-gray-300 text-white">
                  <Plus size={16} />
                </div>
                <div className="text-md text-gray-500 font-semibold">Execute</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewTransaction