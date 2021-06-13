import React from 'react'
import { Dropdown } from 'semantic-ui-react'

// fetch the filtereable categories --> is sample mos

const tagOptions = [
  {
    key: 'sample',
    text: 'Samples',
    value: 'isSample',
    // label: { color: 'green', empty: true, circular: true },
  },
  {
    key: 'none',
    text: 'None',
    value: 'none',
    // label: { color: 'blue', empty: true, circular: true },
  },
]


const FilterComp = ({ setChooseCategory }) => {
    const handleSelection = (_,{ value }) => {
        setChooseCategory(value)
    }

    return (
        <Dropdown
            onChange={handleSelection}
            selection
            fluid
            options={tagOptions}
            placeholder='Filter'
        />
    )
}

export default FilterComp