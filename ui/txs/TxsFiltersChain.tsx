import {
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { TransactionsResponseFiltersChain } from 'types/api/transaction';

import FilterButton from 'ui/shared/filters/FilterButton';


interface Props {
  isActive: boolean;
  defaultValue: TransactionsResponseFiltersChain['filter'];
  onChange: (nextValue: string | Array<string>) => void;
}


const TxsFiltersChain = ({ onChange, defaultValue, isActive }: Props) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Menu>
      <MenuButton>
        <FilterButton
          isActive={ isOpen || isActive }
          onClick={ onToggle }
          as="div"
          label='Chain'
        />
      </MenuButton>
      <MenuList zIndex="popover">
        <MenuOptionGroup defaultValue={ defaultValue || "0" } title="Filter" type="radio" onChange={ onChange }>
          <MenuItemOption value="0">Zenode</MenuItemOption>
          <MenuItemOption value="1">Zenode2</MenuItemOption>
          <MenuItemOption value="2">Zenode3</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default React.memo(TxsFiltersChain);
