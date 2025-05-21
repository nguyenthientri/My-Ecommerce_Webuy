import { useContext } from 'react'
// import { useState } from 'react'
// import { useFloating, FloatingPortal } from '@floating-ui/react'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import logo from '../../assets/img/Screenshot_2025-05-21_125714-removebg-preview.png'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { AppContext } from 'src/contexts/app.context'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import path from 'src/constants/path'
import omit from 'lodash/omit'
import purchaseApi from 'src/apis/purchase.api'
import { purchasesStatus } from 'src/constants/purchase'
import { clearAccessTokenFromLS } from 'src/utils/auth'
import style from './header.module.css'
import { toast } from 'react-toastify'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])

export default function Header() {
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const { setIsAuthenticated, isAuthenticated } = useContext(AppContext)
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      setIsAuthenticated(false)
      clearAccessTokenFromLS()
    }
  })

  useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })
  // const purchasesInCart = purchasesInCartData?.data.data
  const handleLogout = () => {
    logoutMutation.mutate()
  }
  const navigate = useNavigate()

  //TÌM KIẾM SẢN PHẨM
  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        }
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })
  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/cart')
    } else {
      toast('Bạn chưa đăng nhập!')
    }
  }
  // console.log(queryConfig)

  return (
    <div className='bg-black pb-10 pt-2'>
      <div className='container'>
        <div className='flex justify-end text-white'>
          {isAuthenticated && (
            <div className='center flex cursor-pointer items-center py-1 hover:text-gray-300'>
              <div className='w6 h6 flex-shink-0 mr-2'>
                <img
                  src='https://yt3.ggpht.com/K4ygAstBO0MO0K1YlZroyEcSS2JiKdhS5n84K9e8etsh52XTucdkDxjATnpuVGoRXNV1DhQu=s68-c-k-c0x00ffffff-no-rj'
                  alt=''
                  className='h-full w-8 rounded-full object-cover'
                />
              </div>
              <div>Nguyễn Thiên Trí</div>
            </div>
          )}
        </div>
        <div className='flex justify-end'>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className='rounded-[20px] border border-gray-500 bg-rose-500 px-2 py-1 text-white hover:bg-rose-600'
            >
              Đăng xuất
            </button>
          )}
          {!isAuthenticated && (
            <div className='flex items-center'>
              <Link to='/register' className='mx-3 capitalize text-white hover:text-white'>
                <p className={style.btn_login}>Đăng ký</p>
              </Link>
              <div className='h-4 border-r-[1px] border-r-white/40  '></div>
              <Link to='/login' className='mx-3 capitalize text-white hover:text-white'>
                <p className={style.btn_login}>Đăng nhập</p>
              </Link>
            </div>
          )}
        </div>
        <div className=' grid grid-cols-8 items-end justify-center gap-0'>
          <Link to='/' className='order-1 col-span-3 sm:order-1 sm:col-span-1'>
            <img className=' h-auto w-full' src={logo} alt='' />
          </Link>
          <form
            className='order-3 col-span-12 pt-3 sm:order-2 sm:col-span-4 sm:col-start-3  sm:pt-0'
            onSubmit={onSubmitSearch}
          >
            <div className='flex rounded-sm bg-white  p-1'>
              <input
                type='text'
                placeholder='We buy free ship 0Đ - Đăng ký ngay!'
                className='h-8 w-full flex-grow border-none bg-transparent px-3 py-2 text-black outline-none placeholder:italic placeholder:text-slate-400'
                {...register('name')}
              />
              <button className='py-1.75 flex-shrink-0 rounded-sm bg-rose-600 px-5 hover:opacity-80'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='white'
                  className='h-4 w-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                  />
                </svg>
              </button>
            </div>
          </form>
          <div className='sm:order-0 order-2 col-span-2 col-start-8 flex justify-center sm:col-start-12 sm:col-end-12'>
            <i onClick={handleClick}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='pink'
                className='h-8 w-8 '
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                />
              </svg>
            </i>
          </div>
        </div>
      </div>
    </div>
  )
}
