"use client";

export type Option = {
  value: string;
  label: string;
};

export default function SelectReact({
  options,
  value,
  isLoading,
  onChange,
}: {
  options: Option[];
  value?: Option | null;
  isLoading: boolean;
  onChange?: (option: Option | null) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption =
      options.find((opt) => opt.value === selectedValue) || null;
    onChange?.(selectedOption);
  };

  return (
    <select
      className="w-full custom-button rounded-xl border !border-gray-300 px-4 py-2   disabled:opacity-50 "
      onChange={handleChange}
      value={value?.value || ""}
      disabled={isLoading}
    >
      <option value="" disabled>
        {isLoading ? "Loading..." : "Select an option"}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
