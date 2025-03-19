const transactions = [
  {
    action: "Safe Account created",
    createdBy: "0x417B...00D8",
    time: "8:44 PM",
    status: "Success"
  },
  {
    action: "Transfer sent",
    createdBy: "0x1234...ABCD",
    time: "9:00 PM",
    status: "Pending"
  },
  {
    action: "Token Swapped",
    createdBy: "0x9876...EFGH",
    time: "9:15 PM",
    status: "Failed"
  }
];

const History = () => {
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

export default History