'use client'
import useSWR from 'swr'
import axios from 'axios';
import {useState} from 'react'

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
  const { data, error, isLoading } = useSWR("http://35.193.215.175:5000//vehicles", fetcher);
  return (
    <div className="mt-5 flex justify-between flex-row">
      {!error && !isLoading && data && data.length > 0 && data.map((vehicleType, index) => {
            const type = String(vehicleType.VehicleType);
            return(
              <div key={index} className="bg-gray-500 shadow-md rounded-lg min-w-[250px] max-w-[250px] max-h-[1000px] p-1">
                <div className="flex flex-col items-center text-l font-semibold text-white min-h-[50px] mb-2">
                  {type}
                </div>
                <ManufacturerList manufacturers={vehicleType.Manufacturers}/>
              </div>
            )
          }
        )}
      {error ? (
        <h1>No Data Could Be Loaded</h1>
      ):
      (
        <></>
      )
      }
    </div>
  );
}

function ManufacturerList({ manufacturers }: ManufacturerListProps) {
  const [sortField, setSortField] = useState<string>('FullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Sort the manufacturers based on the selected field and order
  const sortedManufacturers = [...(manufacturers || [])].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Toggle the sorting order (ascending/descending)
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4 p-2">
        <label htmlFor="sortField" className="mr-2 text-black font-semibold">
          Sort by:
        </label>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="p-2 text-black rounded-md bg-white shadow-sm"
        >
          <option className='text-black' value="FullName">Full Name</option>
          <option className='text-black' value="Country">Country</option>
          <option className='text-black' value="ShortName">Short Name</option>
        </select>
        <button
          onClick={toggleSortOrder}
          className="ml-4 p-2 rounded-md bg-blue-500 text-white shadow-md min-w-[52px] max-w-[52px]"
        >
          {sortOrder === 'asc' ? 'Asc ↑' : 'Desc ↓'}
        </button>
      </div>
      <div className="overflow-y-scroll max-h-[800px]">
        {sortedManufacturers.map((vehicle, index) => {
          const id = vehicle.Id;
          const shortName = vehicle.ShortName;
          const fullName = vehicle.FullName;
          const country = vehicle.Country;

          return (
            <Vehicle
              key={index}
              Id={id}
              ShortName={shortName}
              FullName={fullName}
              Country={country}
            />
          );
        })}
      </div>
    </div>
  );
}

function Vehicle ({Id, ShortName, FullName, Country}:ManufacturerProps){
  const [toggled, setToggled] = useState<boolean>(false);
  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg min-w-[200px] mb-5 p-5 cursor-pointer" onClick={() => setToggled((v) => !v)}>
      <div className="text-sm font-semibold text-black mb-2">
        {Id === -2 ? "NULL": Id}
      </div>
      {toggled ? (
        <div className={` `}>
          <div className={`text-sm font-semibold text-black mb-2 `}>
            {ShortName}
          </div>
          <div className={`text-sm font-semibold text-black mb-2 `}>
            {FullName}
          </div>
          <div className={`text-sm font-semibold text-black mb-2`}>
            {Country}
          </div>
        </div>
      ):
        <></>
      }
    </div>
  );
}


const fetcher = async (url) => {
  const { data } = await axios.get(url);
  return data;
};