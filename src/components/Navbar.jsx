const Navbar = () => {
  return (
    <div className="fixed top-0 z-50 flex w-full justify-between text-nowrap border-b-2 border-black bg-stone-300 px-8 py-4 tracking-tighter">
      <div className=""></div>
      <div className="z-20">
        <a className="mx-5 font-custom text-xl" href="#about">
          About
        </a>
        <a className="mx-5 font-custom text-xl" href="#projects">
          My&ensp;Work
        </a>
        <a className="mx-5 font-custom text-xl" href="#contact">
          Contact
        </a>
      </div>
    </div>
  );
};

export default Navbar;
