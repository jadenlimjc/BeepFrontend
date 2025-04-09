import { useState } from 'react'
import { Autocomplete } from "./components/Autocomplete";
import { currencies } from "./data/currencies";
import './App.css'


function App() {
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Autocomplete Demo</h1>
      <Autocomplete
        label="Async Search"
        description="With description and custom results display"
        placeholder="Type to begin searching"
        options={currencies}
        value={selected}
        onChange={(val) => setSelected(val)}
        renderOption={(opt) => (
          <div className="flex justify-between">
            <span>{opt.code}</span>
            <span className="text-gray-500">{opt.name}</span>
          </div>
        )}
      />
      <Autocomplete
        label="Sync Search"
        description="With default display and search on focus"
        placeholder="Type to begin searching"
        options={currencies}
        value={selected}
        onChange={(val) => setSelected(val)}
        renderOption={(opt) => (
          <div className="flex justify-between">
            <span>{opt.code}</span>
            <span className="text-gray-500">{opt.name}</span>
          </div>
        )}
        
      />
      <div className="text-gray-700">
        Selected: {selected ? `${selected.code} - ${selected.name}` : "None"}
      </div>
    </div>
  );
}

export default App;
