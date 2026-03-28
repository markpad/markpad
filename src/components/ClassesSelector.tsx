import CreatableSelect from 'react-select/creatable'
import allTailwindClassesList from '@/tailwindClasses'
import React from 'react'

interface ClassesSelectorProps {
  name: string
  value: string
  onChange: (e: any) => void
}

const ClassesSelector: React.FC<ClassesSelectorProps> = ({ value, onChange, name }) => {
  const options = allTailwindClassesList.map((tailwindClass: string) => ({ value: tailwindClass, label: tailwindClass }))

  return (
        <label className='flex items-center w-full'>
            <span className='min-w-fit'>{name}</span>
            <CreatableSelect
                options={options}
                className="ml-3 px-1 grow-1 w-full"
                isMulti
                isSearchable
                isClearable
                value={value !== null && value !== undefined ? value.split(' ').map((item: string) => ({ value: item, label: item })) : []}
                onChange={onChange}
            />
    </label>
  )
}

export default ClassesSelector
