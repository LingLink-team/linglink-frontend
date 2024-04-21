export const renderSkeletons = () => {
  const skeletons = [];
  for (let i = 0; i < 12; i++) {
    skeletons.push(
      <div key={i} className="mb-4 h-32 animate-pulse">
        <div className="bg-slate-200 h-full w-full rounded-lg"></div>
      </div>
    );
  }
  return skeletons;
};
