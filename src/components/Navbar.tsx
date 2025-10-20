const Navbar = () => {
  return (
    <div className="navbar z-20 flex justify-end text-nowrap border-b-4 border-r-4 border-black bg-stone-300 px-8 py-4">
      <div className="flex gap-8 font-custom text-xl">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  );
};

export default Navbar;
