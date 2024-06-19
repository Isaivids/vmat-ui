import { Password } from 'primereact/password';
import React from 'react';

const Changepassword = ({data, setData}: any) => {
  return (
    <div className='flex flex-column gap-2 p-2'>
        <p>Old Password</p>
        <Password 
          value={data.currentPassword} 
          onChange={(e: any) => setData({...data, currentPassword: e.target.value})} 
          feedback={false} 
          tabIndex={1}   
          className='mb-2' 
        />
        <p>New Password</p>
        <Password 
          value={data.newPassword} 
          onChange={(e: any) => setData({...data, newPassword: e.target.value})} 
          feedback={false} 
          tabIndex={1}   
          className='mb-2' 
        />
    </div>
  );
}

export default Changepassword;
