import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const MainColumn = ({ children, className }: Props) => {
  return (
    <Flex
      className={ className }
      flexDir="column"
      flexGrow={ 1 }
      w={{ base: 'calc(100% - 92px)%', lg: 'calc(100% - 235px)' }}
      paddingX={{ base: 4, lg: 12 }}
      paddingTop={{ base: '138px', lg: 9 }}
      paddingBottom={ 10 }
    >
      { children }
    </Flex>
  );
};

export default React.memo(chakra(MainColumn));
