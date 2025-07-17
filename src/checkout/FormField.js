import React from "react";

export function Input({
  register,
  name,
  label,
  placeHolder,
  required,
  className,
  type = "text",
  ...rest
}) {
  return (
    <div className={`${className ?? ""}`}>
      {label ? (
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={name}
        >
          {label}
        </label>
      ) : (
        ""
      )}
      <input
        type={type}
        placeholder={placeHolder}
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700  hover:border-gray-400 leading-tight focus:outline-none focus:shadow-outline"
        {...register(name, { required })}
        {...rest}
      />
    </div>
  );
}

export function Select({ register, options, name, label, ...rest }) {
  return (
    <div>
      {label ? (
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={name}
        >
          {label}
        </label>
      ) : (
        ""
      )}
      <div className="mb-4 relative">
        <select
          {...register(name)}
          {...rest}
          className="block appearance-none w-full bg-white border hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
        >
          {options
            ? options.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.value}
                </option>
              ))
            : ""}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
