import React, { useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddMedicine = () => {
  const [medImg, setMedImg] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('Pain Relief');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  
  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!medImg) {
        return toast.error('Image not selected');
      }

      const formData = new FormData();
      formData.append('image', medImg);
      formData.append('name', name);
      formData.append('type', type);
      formData.append('price', Number(price));
      formData.append('stock', Number(stock));
      formData.append('description', description);

      const { data } = await axios.post(backendUrl + '/api/admin/add-medicine', formData, { headers: { aToken } });

      if (data.success) {
        toast.success(data.message);
        setMedImg(null);
        setName('');
        setType('Pain Relief');
        setPrice('');
        setStock('');
        setDescription('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Medicine</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor='med-img'>
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={medImg ? URL.createObjectURL(medImg) : assets.upload_area} alt='' />
          </label>
          <input onChange={(e) => setMedImg(e.target.files[0])} type='file' id='med-img' hidden />
          <p>Upload medicine image</p>
        </div>

        <div className='flex flex-col gap-4 text-gray-600'>
          <div className='flex flex-col gap-1'>
            <p>Medicine Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type='text' placeholder='Medicine Name' required />
          </div>

          <div className='flex flex-col gap-1'>
            <p>Type</p>
            <select onChange={(e) => setType(e.target.value)} value={type} className='border rounded px-3 py-2'>
              <option value='Pain Relief'>Pain Relief</option>
              <option value='Antibiotic'>Antibiotic</option>
              <option value='Vitamin'>Vitamin</option>
              <option value='Cough & Cold'>Cough & Cold</option>
              <option value='Digestive'>Digestive</option>
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <p>Price</p>
            <input onChange={(e) => setPrice(e.target.value)} value={price} className='border rounded px-3 py-2' type='number' placeholder='Price' required />
          </div>

          <div className='flex flex-col gap-1'>
            <p>Stock</p>
            <input onChange={(e) => setStock(e.target.value)} value={stock} className='border rounded px-3 py-2' type='number' placeholder='Stock' required />
          </div>

          <div className='flex flex-col gap-1'>
            <p>Description</p>
            <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full px-4 pt-2 border rounded' placeholder='Write about medicine' rows={4} required />
          </div>
        </div>

        <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Medicine</button>
      </div>
    </form>
  );
};

export default AddMedicine;
