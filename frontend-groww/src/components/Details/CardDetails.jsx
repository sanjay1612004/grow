import React from "react";
import Chart from "./Chart";
import { Info } from "lucide-react";
import { useParams } from "react-router-dom";

const CardDetails = () => {
  const {name}=useParams()
  const [sname,lname]=name.split('-')
  return (
    <div className="min-h-screen w-full bg-white font-sans">
          {console.log(name)}

      <div className="mx-auto w-full max-w-[1230px] px-4 pt-8 sm:px-6 lg:px-0">
        <div className="max-w-[802px] rounded-lg border border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-3">
              <Info
                size={16}
                className="shrink-0 text-gray-400"
              />

              <span className="text-sm text-[#444b64]">
                The current prices are delayed, activate stocks for live prices
              </span>
            </div>

            <button className="shrink-0 text-xs font-bold text-[#00b386] transition-colors hover:text-[#009973]">
              ACTIVATE STOCKS
            </button>
          </div>
        </div>
      </div>

      <Chart sname={sname} lname={lname}/>
    </div>
  );
};

export default CardDetails;
