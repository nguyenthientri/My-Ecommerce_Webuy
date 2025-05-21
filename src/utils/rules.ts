import * as yup from 'yup'
export const schema = yup.object({
  email: yup
    .string()
    .required('Bạn phải nhập email!')
    .email('Email không đúng định dạng!')
    .min(6, 'Độ dài từ 5 - 160 ký tự!')
    .max(160, 'Độ dài từ 5 - 160 ký tự!'),
  password: yup
    .string()
    .required('Bạn phải nhập password!')
    .min(6, 'Độ dài từ 6 - 160 ký tự!')
    .max(160, 'Độ dài từ 6 - 160 ký tự!'),
  // confirm_password: handleConfirmPasswordYup('password'),
  confirm_password: yup
    .string()
    .required('Bạn phải nhập lại password!')
    .min(6, 'Độ dài từ 6 - 160 ký tự!')
    .max(160, 'Độ dài từ 6 - 160 ký tự!')
    .oneOf([yup.ref('password')], 'Password nhập lại không khớp!'),

  name: yup.string().trim().required('')
})
export type Schema = yup.InferType<typeof schema>
