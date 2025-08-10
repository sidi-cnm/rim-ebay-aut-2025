import Input from "./Input"

export default function InputDialog(){
    return(
        <div className="flex left-1/4 ml-25 transform -translate-x-1">
        <select
          className="text-black rounded-2xl mt-20  px-28 py-2 outline-none"
          onChange={handleSelectChange}
          value={selectedOption}
        >
          <option value="Slect Catergorie">Select</option>
          <option value="Cars">Cars</option>
          <option value="Trucks">Trucks</option>
          <option value="Bikes">Bikes</option>
          <option value="Buses">Buses</option>
        </select>
        
        {/* Afficher le bouton Avances uniquement si une option est sélectionnée */}
       
        <button
          className={`ml-5 mt-20 px-4 py-2 rounded-xl transition duration-300
                      ${selectedOption && selectedOption !== "Slect Catergorie" ? 'bg-white hover:bg-blue-600 text-black' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          onClick={() => setIsopen(true)}
          disabled={!selectedOption}
        >
          {t('nav.Avances')}
        </button>

      </div>
    )
}