import CommonForm from '@/components/common/form'
import { loginFormControls } from '@/config'
import { useToast } from '@/hooks/use-toast'
import { loginUser } from '@/store/auth-slice'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const initialState = {
  email: '',
  password: ''
}
const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const {toast} = useToast();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });

        // Redirect based on user role
        const userRole = data?.payload?.user?.role;
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'user') {
          navigate('/shop/home');
        } else {
          navigate('/'); // Fallback in case the role is unexpected
        }
      } else {
        toast({
          title: data?.payload?.message,
          variant: 'destructive',
        });
      }
    });
  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Sign In To Your Account</h1>

      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={'Sign Up'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <p className='mt-2'>Don't have an account?
        <Link className='font-medium text-primary ml-1 hover:underline' to='/auth/register'>Register</Link>
      </p>
    </div>

  )
}

export default AuthLogin;
