const HeroSection = () => {
  return (
    <>
      <section className="bg-gradient-to-r from-sky-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Welcome to <span className="text-orange-400">Your Blogo</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8">
            Share your thoughts, ideas, and stories with the world. Start
            writing today and connect with a vibrant community of readers and
            writers.
          </p>
          <div className="flex gap-4">
            <button className="bg-teal-300 hover:bg-slate-300 text-black font-medium py-3 px-6 rounded-lg">
              Start Writing
            </button>
            <button className="bg-white hover:bg-gray-200 text-black font-medium py-3 px-6 rounded-lg">
              Explore Blogs
            </button>
          </div>
        </div>
      </section>
      <section className="flex justify-center items-center flex-col">
        <h1 className="text-center text-[70px] font-sans">Explore us</h1>
        <div>
          <div>
            <img
              src="https://i.ytimg.com/vi/4DqAvWonPAg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC3MBraMSf_Ld4T6VLjIHDu2GlXow"
              alt=""
            />
            <h1 className="text-2xl font-mono">Best React Course In Youtube</h1>
            <a target="_blank"
              href="https://youtu.be/4DqAvWonPAg?si=X4pDa57Rhvvni516"
              className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-slate-300 rounded hover:bg-white group"
            >
              <span className="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
              <span className="relative  w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                Read more
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
