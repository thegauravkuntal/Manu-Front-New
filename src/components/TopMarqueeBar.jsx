const TopMarqueeBar = () => {
  const text = `
  Paper Cup Machines • Plate Making Machines • Bag Making Machines • Packaging Solutions • Disposable Industry • Automation Systems • Industrial Machinery • Eco-Friendly Production • High Speed Machines • Reliable After-Sales Support •
  `;

  return (
    <div className="bg-[#1f4d2b] text-white py-2 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee">
        <p className="mx-4 text-sm font-medium tracking-wide">{text}</p>
        <p className="mx-4 text-sm font-medium tracking-wide">{text}</p>
      </div>
    </div>
  );
};

export default TopMarqueeBar;
