import React, { useEffect } from 'react';
const axios = require('axios');
import { APIS } from 'lib/api/apis';


export default function useTxsSortAPI(query: string) {

  const [ dataResult, setData ] = React.useState<any>();

  const getMyData = async (query: string) => {
    try {
      const promises = APIS.map((url) => axios.get(`${url}?filter=${query}`));
   
      const responses = await Promise.all(promises);
      const getData = responses.map(res => {
        if (res.status !== 200) {
          return [];
        }
       
        return res?.data?.items;
      });

      setData(getData[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const callback: any = () => {
    getMyData(query);
  }

  useEffect(() => {
    getMyData(query);
  }, [])

  React.useCallback(() => () => {
    getMyData(query);
  }, [ query ]);


  return {
    dataResult,
    callback
  };

}
