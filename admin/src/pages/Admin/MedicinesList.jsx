import React, { useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';

const MedicinesList = () => {
  const { medicines, aToken, getAllMedicines, changeMedicineAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllMedicines();
    }
  }, [aToken]);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Medicines</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {medicines.map((item, index) => (
          <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='w-40 h-40 object-cover bg-indigo-50 group-hover:bg-primary transition-all duration-500' 
                 src={item.image} 
                 alt={item.name} />
            <div className='p-4'>
              <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
              <p className='text-zinc-600 text-sm'>{item.type}</p>
              <p className='text-zinc-600 text-sm'>{item.price}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input 
                  className='w-5 h-5 text-blue-600 bg-blue-600 border-gray-300 rounded focus:ring-blue-500' 
                  onChange={() => changeMedicineAvailability(item._id)} 
                  type='checkbox' 
                  checked={item.available} 
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicinesList;
