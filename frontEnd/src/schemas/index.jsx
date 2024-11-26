import * as Yup from "yup";

export const registrationSchema=Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
      .required("password is required")
      .min(8, "password must be at leaset 8 characters")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "atleast one symbol required")
      .matches(/[0-9]/, "atleast one number required")
      .matches(/[A-Z]/, "atleast one uppercase letter required")
      .matches(/[a-z]/, "atleast one lowercase letter required"),
      confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  })

  export const loginSchema=Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .required("password is required")
      .min(8, "password must be at leaset 8 characters")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "atleast one symbol required")
      .matches(/[0-9]/, "atleast one number required")
      .matches(/[A-Z]/, "atleast one uppercase letter required")
      .matches(/[a-z]/, "atleast one lowercase letter required")
  })

  export const eventSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title cannot exceed 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description cannot exceed 500 characters'),
    date: Yup.date()
      .required('Date is required')
      .min(new Date(), 'Date cannot be in the past'),
    location: Yup.string()
      .required('Location is required')
      .min(3, 'Location must be at least 3 characters')
      .max(200, 'Location cannot exceed 200 characters'),
  });