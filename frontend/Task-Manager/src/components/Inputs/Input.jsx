import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const Input = ({ value, onChange, label, placeholder, type = 'text' }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <div>
      {label && <label className='text-[13px] text-slate-800'>{label}</label>}
      <div className='input-box flex items-center gap-2'>
        <input
          type={inputType}
          placeholder={placeholder}
          className='w-full bg-transparent outline-none'
          value={value}
          onChange={onChange}
        />

        {isPasswordType && (
          showPassword ? (
            <FaRegEye
              size={22}
              className='text-primary cursor-pointer'
              onClick={toggleShowPassword}
            />
          ) : (
            <FaRegEyeSlash
              size={22}
              className='text-slate-400 cursor-pointer'
              onClick={toggleShowPassword}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Input;
