import { createContext, PropsWithChildren, useState } from "react";

interface FilterContextType {
    searchInput: string;
    selectedSort: string;
    selectedType: number;
    setSearchInput: (input: string) => void;
    setSelectedSort: (sort: string) => void;
    setSelectedType: (type: number) => void;
}

export const FilterContext = createContext<FilterContextType>({
    searchInput: '',
    selectedSort: 'id',
    selectedType: 0,
    setSearchInput: () => {},
    setSelectedSort: () => {},
    setSelectedType: () => {},
})

export function FilterProvider(params: PropsWithChildren<{}>) {
    const [searchInput, setSearchInput] = useState<string>('')
    const [selectedSort, setSelectedSort] = useState<string>('id');
    const [selectedType, setSelectedType] = useState<number>(0);

    return (
        <FilterContext.Provider value={{ searchInput, selectedSort, selectedType, setSearchInput, setSelectedSort, setSelectedType }}>
            {params.children}
        </FilterContext.Provider>
    )
}
