import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SignupForm } from '../components/auth/SignupForm';
import loginPageImg from '../assets/loginPage.png'
import { Link } from 'react-router-dom';
import { Success } from '../helpers/popup';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (credentials) => {
    
    login(credentials);
    Success('Welcome to Event Manager')
    navigate('/dashboard');
  };

  return (
    <section className="bg-white">
    <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8">
            <div className="absolute inset-0">
                <img className="object-cover w-full h-screen" src={loginPageImg}alt="signup page img" loading="lazy"  />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent h-screen"></div>

            <div className="relative">
                <div className="w-full max-w-xl xl:w-full xl:mx-auto xl:pr-24 xl:max-w-xl">
                    <h3 className="text-4xl font-bold text-white">Make Event Management Simple and Effective</h3>
                    <ul className="grid grid-cols-1 mt-10 sm:grid-cols-2 gap-x-8 gap-y-4">
                        <li className="flex items-center space-x-3">
                            <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full">
                                <svg className="w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <span className="text-lg font-medium text-white"> Create Event </span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full">
                                <svg className="w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <span className="text-lg font-medium text-white"> Edit Event </span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full">
                                <svg className="w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <span className="text-lg font-medium text-white"> Delete Event </span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full">
                                <svg className="w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <span className="text-lg font-medium text-white"> Search Event </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-10">
            <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
                <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign Up</h2>
                <p className="mt-2 text-base text-gray-600">Already have an account? <Link to='/login' className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline">Login</Link></p>

      <SignupForm onSubmit={handleSignup} />
            </div>
        </div>
    </div>
</section>
  );
};


