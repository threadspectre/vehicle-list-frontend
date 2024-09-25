'use client'
import useSWR from 'swr'
import axios from 'axios';


export default function Home() {
  return (
    <div className="">
      <main className="">
        <VehicleList/>
      </main>
    </div>
  );
}

interface ManufacturerProps {
  Id?: number;
  ShortName?: string;
  FullName?: string;
  Country?: string;
}

interface ManufacturerListProps {
  manufacturers?: ManufacturerProps[];
}

function VehicleList (){
  const { data, error, isLoading } = useSWR("http://localhost:5106/vehicles", fetcher);
  return (
    <div className="mt-5 flex justify-between flex-row">
      {!error && !isLoading && data && data.length > 0 && data.map((vehicleType, index) => {
            console.log(vehicleType);
            const type = String(vehicleType.VehicleType);
            return(
              <div key={index} className="bg-gray-500 shadow-md rounded-lg min-w-[250px] max-w-[250px] overflow-y-scroll max-h-[1000px] p-1">
                <div className="flex flex-col items-center text-l font-semibold text-white min-h-[50px] mb-2">
                  {type}
                </div>
                <ManufacturerList manufacturers={vehicleType.Manufacturers}/>
              </div>
            )
          }
        )}
    </div>
  );
}

function ManufacturerList ({manufacturers}:ManufacturerListProps){
  return (
    <div>
      {manufacturers && manufacturers.length > 0 && manufacturers.map((vehicle, index) => {
            const id = vehicle.Id;
            const shortName = vehicle.ShortName;
            const fullName = vehicle.FullName;
            const country = vehicle.Country;
            console.log(vehicle)
            return(
              <div key={index} className="flex flex-col bg-white shadow-md rounded-lg min-w-[200px] mb-5 p-5">
                <div className="text-sm font-semibold text-black mb-2">
                  {id}
                </div>
                <div className="text-sm font-semibold text-black mb-2">
                  {shortName}
                </div>
                <div className="text-sm font-semibold text-black mb-2">
                  {fullName}
                </div>
                <div className="text-sm font-semibold text-black">
                  {country}
                </div>
              </div>
            )
          }
        )}
    </div>
  );
}


const fetcher = async (url) => {
  const { data } = await axios.get(url);
  return data;
};