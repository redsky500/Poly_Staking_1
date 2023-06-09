/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Table = ({ NFTList }: any) => {
  const { address: account }: any = useAccount();
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    // lotteryTableContent().then((res: any) => {
    //   const tableRowsSetting = res.map((item: any) => {
    //     return (
    //       <tr
    //         key={item._id}
    //         className="w-full flex justify-around p-[10px] text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
    //       >
    //         <td className="w-full flex justify-center">
    //           <p className="ellipse-para">{item._id}</p>
    //         </td>
    //         <td className="w-full flex justify-center">
    //           <p className="ellipse-para">{item.totalArbkeys}</p>
    //         </td>
    //         <td className="w-full flex justify-center">
    //           <p className="ellipse-para">{item.totalTickets}</p>
    //         </td>
    //       </tr>
    //     );
    //   });
    //   setTableRows(tableRowsSetting);
    // })
  }, [NFTList, account, setTableRows]);

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-countdownBG">
              <thead className="bg-[#00000059] glossy-shadow flex flex-col items-center justify-between">
                <tr className="w-full flex justify-around">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {/* current user wallet */}
                    Wallet Address
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {/* Total NFTs that current user staked for current lottery. User can stake several NFTs. This is total counts */}
                    Total Arbkeys
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {/* Sum of the current user staked NFTs level */}
                    Total Tickets
                  </th>
                </tr>
              </thead>
              <tbody
                className="bg-[#00000045] table-scroll flex flex-col items-center justify-start overflow-y-scroll divide-y divide-gray-200 glossy-shadow"
                style={{ height: "50vh" }}
              >
                {tableRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
