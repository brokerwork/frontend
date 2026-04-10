export default ({
  src,
  autoPlay = false,
  controls = true,
  loop = false,
  className = ''
}) => {
  const props = {
    src,
    autoPlay,
    controls,
    loop,
    className
  };
  return <audio {...props} />;
};
