const transactions = [
  {
    action: "NFT Minted",
    createdBy: "0x9A7C...BB21",
    time: "10:05 AM",
    status: "Success"
  },
  {
    action: "Smart Contract Deployed",
    createdBy: "0x2F8D...C3E4",
    time: "11:20 AM",
    status: "Success"
  },
  {
    action: "Liquidity Added",
    createdBy: "0x55AA...FF99",
    time: "1:45 PM",
    status: "Pending"
  },
  {
    action: "Vote Submitted",
    createdBy: "0x7B3E...11DD",
    time: "3:30 PM",
    status: "Failed"
  }
];


const Queue = () => {
  return (
    <article>
      <div className="text-gray-600 font-semibold mb-3">MAR 17, 2025</div>
      <table className="w-full h-full">
        <tbody className="w-full h-full space-y-3">
          {transactions?.map((transaction, index) => (
            <tr id={`${index}`} className="py-3 w-full rounded-md mt-1 bg-white grid grid-cols-4">
              <td className="text-center">{transaction.action}</td>
              <td className="text-center">{transaction.createdBy}</td>
              <td className="text-center text-gray-500">{transaction.time}</td>
              <td className={`text-center ${transaction.status === "Success" ? "text-green-500" : transaction.status === "Pending" ? "text-orange-400" : "text-red-500"}`}>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}

export default Queue