import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Menu, MenuProps } from './Menu'
import { QueryClient, QueryClientProvider } from 'react-query';

export default {
  title: 'shared/Menu',
  component: Menu,
} as ComponentMeta<typeof Menu>;

const singleProps: MenuProps = {
  title: 'Nome do usuario',
  walletAddress: '0x4ffef6c6Acc7fewcwc8g8',
  items: [{item: 'Central de ajuda', onClick: ()=>{}}],
  footer: <p>Footer</p>
} 

const Template: ComponentStory<typeof Menu> = (_) => (<Menu {...singleProps} />);

export const Example = Template.bind({});

Example.args = singleProps;


