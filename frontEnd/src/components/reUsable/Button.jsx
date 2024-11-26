const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseClass = `btn btn-${variant} ${className}`;
  return (
    <button className={baseClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
