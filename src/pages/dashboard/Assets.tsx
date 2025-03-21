import { Coins } from "lucide-react"
import { useState } from "react"
import NewTransaction from "../../components/dashboard/NewTransaction"

const Assets = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="bg-gray-100 w-full overflow-x-hidden overflow-y-auto relative">
      <div className="flex items-center justify-center h-full p-20">
        <div className="p-10 bg-white w-full grid grid-cols-2 shadow-md rounded-md relative">
          <div className="absolute inset-x-0 h-2 bg-gray-300" />
          <div className="absolute left-0 top-0 w-1/4 h-2 bg-green-400" />
          <div>
            {/* TODO add image */}
            <h3 className="font-bold text-5xl">New Transaction</h3>
          </div>
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-xl mb-5">Manage Assets</h3>
            <div className="flex items-center justify-center gap-3 py-4 px-16 bg-black w-fit text-white rounded-md cursor-pointer" onClick={() => setIsOpen(true)}>
              <Coins />
              <span className="font-semibold text-lg">Send Token</span>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <NewTransaction close={() => setIsOpen(false)} />
      )}
    </section>
  )
}

export default Assets