import { AlertCircle, ChevronDown, X } from "lucide-react"
import { useState } from "react"

interface option {
  name: string,
  id: number
}

const SELECTION = [
  { id: 1, name: "Ethereum One" },
  { id: 1, name: "Ethereum Two" },
  { id: 1, name: "Ethereum Three" },
  { id: 1, name: "Ethereum Four" },
  { id: 1, name: "Ethereum Five" }
]

const Account = () => {
  const [selectedOpen, setSelectOpen] = useState(false)
  const [selected, setSelected] = useState<option[]>([])

  return (
    <section className="bg-gray-100 w-full px-28 py-10">
      <h2 className="text-4xl font-bold">Create new Safe Account</h2>
      <div className="mt-8 grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <div className="border border-gray-300 bg-white rounded-md">
            <div className="px-3 py-6 border-b border-gray-300">
              <div className="flex items-center gap-4">
                <div className="h-6 w-6 bg-black text-white rounded-full flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold">Set up the basics</h3>
                  <p>Give a name to your account and select which networks to deloy it on</p>
                </div>
              </div>
            </div>
            <div className="px-14 py-5 border-b border-gray-300">
              {/* 1 */}
              <div className="space-y-5">
                <div className="relative border border-gray-300 rounded-md p-4">
                  <input type="text" placeholder="Affectionate Ethereum Safe" className="w-full focus:outline-none pr-14" />
                  <div className="text-gray-400 p-1 absolute top-0 left-2 -translate-y-1/2 bg-white">Name</div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <AlertCircle />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Select Networks</h4>
                  <p className="text-sm">Choose which networks you want your account to be active on. You can add more networks later.</p>
                </div>
                <div className="border border-gray-300 rounded-md p-4 relative">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 flex items-center gap-2 flex-wrap">
                      {selected.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1 rounded-full px-1 py-1 border border-gray-300 w-32">
                          <div className="h-6 w-6 rouned-full bg-blue-400 rounded-full" />
                          <div className="flex-1 overflow-hidden truncate">{item.name}</div>
                          <div className="h-5 w-5 rouned-full bg-gray-300 rounded-full text-white flex items-center justify-center hover:bg-gray-200 cursor-pointer" onClick={() => setSelected(selected.filter((select) => select.name !== item.name))}>
                            <X size={16} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="cursor-pointer " onClick={() => setSelectOpen(!selectedOpen)}>
                      <ChevronDown />
                    </div>
                  </div>

                  {selectedOpen && (
                    <div className="absolute top-full left-0 w-full border border-gray-300 mt-2 overflow-y-scroll h-32 p-1 space-y-1 rounded-md bg-gray-100">
                      {SELECTION.map((item, idx) => (
                        <div
                          key={idx}
                          className={`border border-white bg-white rounded-md p-1 hover:bg-gray-300 cursor-pointer text-start w-full`}
                          onClick={() => {
                            if (!selected.some((select) => select.name === item.name)) {
                              setSelected([...selected, item]);
                            }
                          }}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm">By continuing, you agreee to our <span className="font-semibold underline">terms of use</span> and <span className="font-semibold underline">privacy policy</span></p>
              </div>
            </div>

            <div className="px-14 py-5 flex items-center justify-between">
              <div className="px-6 py-2 border-2 border-black rounded-md font-semibold cursor-pointer hover:bg-black hover:text-white transition-colors duration-300">Cancel</div>
              <div className="px-6 py-2 border-2 border-black bg-black rounded-md font-semibold cursor-pointer text-white hover:bg-white hover:text-black transition-colors duration-300">Next</div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          col2
        </div>
      </div>
    </section>
  )
}

export default Account