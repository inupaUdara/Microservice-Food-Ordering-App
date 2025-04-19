import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <>

        <div className="relative h-screen flex justify-center items-center flex-col overflow-hidden mx-auto sm:p-10 px-5"
        style={{ backgroundImage: "url('/bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <section className="max-w-7xl w-full">
            <div className="pb-20 pt-36">
              <div className="flex justify-center relative my-20 z-10">
                <div className="max-w-[80vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center gap-3">
                  {/* <img src={logo} width={100} className="mx-auto" /> */}
                  <h1 className="uppercase text-[#111827] text-center text-[40px] md:text-4xl lg:text-5xl font-bold">
                    Agastra Events
                    <br />
                    <span className="font-normal text-xl md:text-2xl">
                      the ultimate table booking solution
                    </span>
                  </h1>
                  <p className="text-[#111827] text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
                    Effortlessly manage table bookings, customize seating plans,
                    and provide a seamless experience for your guests.
                  </p>
                  <Link
                    to="/auth/cover-login"
                    className="border-[#0C21C1] border-2  text-[#0C21C1] py-3 px-8 rounded-full text-lg font-bold hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:border-none hover:text-white transition duration-300 ease-in-out"
                  >
                    <button>Get Started</button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>

    </>
  );
};

export default Landing;
