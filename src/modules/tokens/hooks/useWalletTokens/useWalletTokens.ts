import { useState } from 'react';

interface WalletTokenItem {
  image: string;
  name: string;
  category: string;
  id: string;
}

const oneItemMock: WalletTokenItem = {
  image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
  name: 'Nome do token',
  category: 'Nome categoria',
  id: '1',
};

const mock = new Array(6)
  .fill(undefined)
  .map((_) => ({ ...oneItemMock, id: Math.random().toString() }));

export const useWalletTokens = (): [
  { data: Array<WalletTokenItem>; isLoading: boolean },
  { page: number; changePage: (next: number) => void; totalPages: number }
] => {
  const [page, setPage] = useState(1);
  return [
    {
      data: mock,
      isLoading: false,
    },
    {
      page,
      changePage: setPage,
      totalPages: 10,
    },
  ];
};
