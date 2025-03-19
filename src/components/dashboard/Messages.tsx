const transactions = [
  {
    action: "Payment Received",
    createdBy: "0xA1B2...C3D4",
    time: "7:20 AM",
    status: "Success"
  },
  {
    action: "Invoice Generated",
    createdBy: "0xE5F6...7890",
    time: "8:10 AM",
    status: "Success"
  },
  {
    action: "Withdrawal Requested",
    createdBy: "0x1122...3344",
    time: "2:45 PM",
    status: "Pending"
  },
  {
    action: "Subscription Cancelled",
    createdBy: "0x5566...7788",
    time: "5:30 PM",
    status: "Failed"
  }
];


const Messages = () => {
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

export default Messages