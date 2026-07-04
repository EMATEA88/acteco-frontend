import { Search } from "lucide-react";

interface SearchBarProps {

  value: string;

  placeholder?: string;

  onChange: (

    value: string

  ) => void;

}

export default function SearchBar({

  value,

  placeholder = "Pesquisar...",

  onChange

}: SearchBarProps) {

  return (

    <div className="relative w-full md:w-96">

      <Search

        size={18}

        className="absolute left-3 top-3 text-gray-400"

      />

      <input

        value={value}

        onChange={(e) =>

          onChange(

            e.target.value

          )

        }

        placeholder={placeholder}

        className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

      />

    </div>

  );

}