import { useFormik } from "formik";
import { registrationSchema } from "../../schemas";
import { signup } from "../../api/auth";
import { Failed } from "../../helpers/popup";

export const SignupForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registrationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const data = await signup({
          email: values.email,
          password: values.password,
        });
        onSubmit(data);
        resetForm();
      } catch (err) {
        formik.setFieldError("email", err.message || "Signup failed");
        Failed("email", err.message || "Signup failed")
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isSubmitting,
    handleSubmit,
  } = formik;

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="space-y-5">
        <div>
          <label className="text-base font-medium text-gray-900">
            Email address
          </label>
          <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter email to get started"
              className={`block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border ${
                errors.email && touched.email
                  ? "border-red-500"
                  : "border-gray-200"
              } rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600`}
            />
            {errors.email && touched.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>
        <div>
          <label className="text-base font-medium text-gray-900">
            Password
          </label>
          <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              className={`block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border ${
                errors.password && touched.password
                  ? "border-red-500"
                  : "border-gray-200"
              } rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600`}
            />
            {errors.password && touched.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </div>
        <div>
          <label className="text-base font-medium text-gray-900">
            Confirm Password
          </label>
          <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
            <input
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm Password"
              className={`block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border ${
                errors.confirmPassword && touched.confirmPassword
                  ? "border-red-500"
                  : "border-gray-200"
              } rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600`}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-gradient-to-r from-fuchsia-600 to-blue-600 focus:outline-none hover:opacity-80 focus:opacity-80"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="absolute w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                <span className="invisible">Submitting...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
