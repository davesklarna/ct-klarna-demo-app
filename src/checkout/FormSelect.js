export default function FormSelect({
  fieldName,
  label,
  value,
  setValue,
  options,
  showEmptyOption = true,
}) {
  const handleChange = (event) => {
    const target = event.target;
    setValue(target.id, target.value);
  };

  return (
    <>
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={fieldName}
      >
        {label}
      </label>
      <div className="mb-4 relative">
        <select
          id={fieldName}
          onChange={handleChange}
          value={value}
          className="block appearance-none w-full bg-white border hover:border-gray-400 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
        >
          {showEmptyOption ? <option value=""></option> : <></>}
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
    </>
  );
}
